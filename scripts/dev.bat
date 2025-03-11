@echo off
REM Script para configurar e iniciar o ambiente de desenvolvimento no Windows

echo Configurando ambiente de desenvolvimento para Visao EnvX...

REM Verificar se Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python nao encontrado. Por favor, instale o Python 3.8 ou superior.
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js nao encontrado. Por favor, instale o Node.js 16 ou superior.
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo npm nao encontrado. Por favor, instale o npm 8 ou superior.
    exit /b 1
)

REM Criar ambiente virtual Python se não existir
if not exist venv (
    echo Criando ambiente virtual Python...
    python -m venv venv
)

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate

REM Instalar dependências do backend
echo Instalando dependencias do backend...
pip install -r backend\requirements.txt

REM Inicializar banco de dados
echo Inicializando banco de dados...
python scripts\init_db.py

REM Instalar dependências do frontend
echo Instalando dependencias do frontend...
cd frontend && npm install && cd ..

REM Iniciar backend e frontend
echo Iniciando servidores de desenvolvimento...
echo Backend estara disponivel em: http://localhost:8000
echo Frontend estara disponivel em: http://localhost:3000

REM Iniciar backend em segundo plano
start cmd /k "call venv\Scripts\activate && cd backend && python app.py"

REM Iniciar frontend
cd frontend && npm start 