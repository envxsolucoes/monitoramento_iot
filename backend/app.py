from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import cv2
import numpy as np
import os
import shutil
from datetime import datetime
import logging
from typing import List, Optional
import json
from pydantic import BaseModel
import time
from pathlib import Path
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from database import get_db, Image, Analysis, init_db
import models as vision_models

# Carregar variáveis de ambiente
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("visao_envx")

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)
os.makedirs("models", exist_ok=True)
os.makedirs("static", exist_ok=True)

# Inicializar banco de dados
init_db()

# Obter origens permitidas
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8000").split(",")

app = FastAPI(
    title="Visão EnvX API",
    description="API para sistema de visão computacional para monitoramento ambiental",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Data models
class AnalysisResult(BaseModel):
    id: str
    timestamp: str
    image_path: str
    results: dict
    status: str

class AnalysisRequest(BaseModel):
    analysis_type: str
    parameters: Optional[dict] = None

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API Visão EnvX", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join("uploads", filename)
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read image with OpenCV to validate it
        img = cv2.imread(file_path)
        if img is None:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Arquivo inválido ou não é uma imagem")
        
        height, width = img.shape[:2]
        file_size = os.path.getsize(file_path)
        
        # Salvar informações da imagem no banco de dados
        db_image = Image(
            filename=filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            width=width,
            height=height
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        
        return {
            "filename": filename,
            "file_path": file_path,
            "size": file_size,
            "dimensions": f"{width}x{height}"
        }
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar o upload: {str(e)}")

@app.post("/analyze/{image_id}")
async def analyze_image(
    image_id: str, 
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        # Check if image exists in database
        db_image = db.query(Image).filter(Image.filename == image_id).first()
        if not db_image:
            # Check if image exists in filesystem as fallback
            file_path = os.path.join("uploads", image_id)
            if not os.path.exists(file_path):
                raise HTTPException(status_code=404, detail="Imagem não encontrada")
            
            # Se a imagem existe no sistema de arquivos mas não no banco, criar registro
            img = cv2.imread(file_path)
            height, width = img.shape[:2]
            file_size = os.path.getsize(file_path)
            
            db_image = Image(
                filename=image_id,
                original_filename=image_id,
                file_path=file_path,
                file_size=file_size,
                width=width,
                height=height
            )
            db.add(db_image)
            db.commit()
            db.refresh(db_image)
        
        # Create analysis ID
        analysis_id = f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create analysis record in database
        db_analysis = Analysis(
            analysis_id=analysis_id,
            image_id=db_image.id,
            analysis_type=request.analysis_type,
            parameters=request.parameters,
            status="processing",
            results={}
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        # Process in background
        background_tasks.add_task(
            process_image, 
            analysis_id, 
            db_image.file_path, 
            request.analysis_type,
            request.parameters
        )
        
        return {"analysis_id": analysis_id, "status": "processing"}
    
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao analisar imagem: {str(e)}")

@app.get("/results/{analysis_id}")
async def get_analysis_results(analysis_id: str, db: Session = Depends(get_db)):
    db_analysis = db.query(Analysis).filter(Analysis.analysis_id == analysis_id).first()
    if not db_analysis:
        raise HTTPException(status_code=404, detail="Análise não encontrada")
    
    # Converter para o formato esperado pelo frontend
    return {
        "id": db_analysis.analysis_id,
        "timestamp": db_analysis.created_at.isoformat(),
        "image_path": db_analysis.image.file_path if db_analysis.image else None,
        "status": db_analysis.status,
        "results": db_analysis.results or {}
    }

@app.get("/results")
async def list_results(db: Session = Depends(get_db)):
    db_analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
    
    # Converter para o formato esperado pelo frontend
    results = []
    for analysis in db_analyses:
        results.append({
            "id": analysis.analysis_id,
            "timestamp": analysis.created_at.isoformat(),
            "image_path": analysis.image.file_path if analysis.image else None,
            "status": analysis.status,
            "results": analysis.results or {}
        })
    
    return results

# Function for image processing
def process_image(analysis_id: str, image_path: str, analysis_type: str, parameters: Optional[dict] = None):
    # Obter sessão do banco de dados
    db = next(get_db())
    
    try:
        # Get analysis from database
        db_analysis = db.query(Analysis).filter(Analysis.analysis_id == analysis_id).first()
        if not db_analysis:
            logger.error(f"Analysis {analysis_id} not found in database")
            return
        
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            db_analysis.status = "failed"
            db_analysis.error = "Não foi possível ler a imagem"
            db.commit()
            return
        
        # Get appropriate model
        try:
            model = vision_models.get_model(analysis_type)
        except ValueError as e:
            db_analysis.status = "failed"
            db_analysis.error = str(e)
            db.commit()
            return
        
        # Run prediction
        results = model.predict(img)
        
        # Save results to database
        db_analysis.results = results
        db_analysis.status = "completed"
        db_analysis.completed_at = datetime.now()
        db.commit()
        
        # Save results to file as backup
        result_path = os.path.join("results", f"{analysis_id}.json")
        with open(result_path, "w") as f:
            json.dump(results, f)
        
    except Exception as e:
        logger.error(f"Error processing image {analysis_id}: {str(e)}")
        
        # Update database with error
        if db_analysis:
            db_analysis.status = "failed"
            db_analysis.error = str(e)
            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    port = int(os.getenv("APP_PORT", "8000"))
    host = os.getenv("APP_HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    uvicorn.run("app:app", host=host, port=port, reload=debug) 