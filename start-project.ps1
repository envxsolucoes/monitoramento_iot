# Script para testar e iniciar o projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Iniciando o projeto Visao EnvX ===" -ForegroundColor Green
Write-Host "Este script ira testar e iniciar o backend e frontend" -ForegroundColor Cyan

# Verificar se Python esta instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python nao encontrado. Por favor, instale o Python 3.8 ou superior." -ForegroundColor Red
    exit 1
}

# Verificar se Node.js esta instalado
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js nao encontrado. Por favor, instale o Node.js 16 ou superior." -ForegroundColor Red
    exit 1
}

# Verificar se npm esta instalado
try {
    $npmVersion = npm --version 2>&1
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm nao encontrado. Por favor, instale o npm." -ForegroundColor Red
    exit 1
}

# Definir caminhos
$rootDir = $PWD
$backendDir = Join-Path -Path $rootDir -ChildPath "backend"
$frontendDir = Join-Path -Path $rootDir -ChildPath "frontend"

# Criar e ativar ambiente virtual Python se nao existir
if (-not (Test-Path -Path "venv")) {
    Write-Host "Criando ambiente virtual Python..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Ativando ambiente virtual..." -ForegroundColor Yellow
try {
    & .\venv\Scripts\Activate.ps1
} catch {
    Write-Host "Erro ao ativar o ambiente virtual. Continuando sem ativar..." -ForegroundColor Yellow
}

# Instalar dependencias do backend
Write-Host "Instalando dependencias do backend..." -ForegroundColor Yellow
if (Test-Path -Path "$backendDir\requirements.txt") {
    try {
        pip install -r "$backendDir\requirements.txt"
    } catch {
        Write-Host "Erro ao instalar todas as dependencias. Instalando dependencias basicas..." -ForegroundColor Yellow
        pip install fastapi uvicorn python-multipart python-dotenv sqlalchemy opencv-python
    }
} else {
    Write-Host "Arquivo requirements.txt nao encontrado. Instalando dependencias basicas..." -ForegroundColor Yellow
    pip install fastapi uvicorn python-multipart python-dotenv sqlalchemy opencv-python
}

# Verificar se o backend esta funcionando
Write-Host "Testando o backend..." -ForegroundColor Yellow
if (Test-Path -Path $backendDir) {
    Set-Location -Path $backendDir
    
    # Verificar se o arquivo app.py existe
    if (Test-Path -Path "app.py") {
        Write-Host "Arquivo app.py encontrado" -ForegroundColor Green
    } else {
        Write-Host "Arquivo app.py nao encontrado no diretorio backend" -ForegroundColor Red
        Set-Location -Path $rootDir
        exit 1
    }
    
    # Voltar ao diretorio raiz
    Set-Location -Path $rootDir
} else {
    Write-Host "Diretorio backend nao encontrado" -ForegroundColor Red
    exit 1
}

# Instalar dependencias do frontend
Write-Host "Instalando dependencias do frontend..." -ForegroundColor Yellow
if (Test-Path -Path $frontendDir) {
    Set-Location -Path $frontendDir
    
    # Verificar se o package.json existe
    if (Test-Path -Path "package.json") {
        Write-Host "Arquivo package.json encontrado" -ForegroundColor Green
        npm install
    } else {
        Write-Host "Arquivo package.json nao encontrado no diretorio frontend" -ForegroundColor Red
        Set-Location -Path $rootDir
        exit 1
    }
    
    # Voltar ao diretorio raiz
    Set-Location -Path $rootDir
} else {
    Write-Host "Diretorio frontend nao encontrado" -ForegroundColor Red
    exit 1
}

# Iniciar o backend e frontend
Write-Host "`n=== Iniciando os servidores ===" -ForegroundColor Green
Write-Host "Backend estara disponivel em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend estara disponivel em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Credenciais de login: admin@admin.com / admin" -ForegroundColor Yellow
Write-Host "Pressione Ctrl+C para encerrar os servidores`n" -ForegroundColor Red

# Iniciar o backend em uma nova janela
Write-Host "Iniciando o backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; uvicorn app:app --reload"

# Aguardar alguns segundos para o backend iniciar
Start-Sleep -Seconds 5

# Iniciar o frontend em uma nova janela
Write-Host "Iniciando o frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm start"

Write-Host "`n=== Servidores iniciados com sucesso! ===" -ForegroundColor Green
Write-Host "Voce pode fechar esta janela agora. Os servidores continuarao rodando nas novas janelas." -ForegroundColor Cyan 