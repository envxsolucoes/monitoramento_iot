# Script para corrigir o erro ao iniciar o backend
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Corrigindo o erro ao iniciar o backend ===" -ForegroundColor Green

# Definir caminhos
$rootDir = $PWD
$backendDir = Join-Path -Path $rootDir -ChildPath "backend"

# Verificar se o diretorio backend existe
if (-not (Test-Path -Path $backendDir)) {
    Write-Host "Diretorio backend nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo app.py existe no backend
if (-not (Test-Path -Path "$backendDir\app.py")) {
    Write-Host "Arquivo app.py nao encontrado no diretorio backend" -ForegroundColor Red
    exit 1
}

Write-Host "O erro 'Could not import module app' ocorre quando voce tenta iniciar o backend a partir do diretorio raiz." -ForegroundColor Yellow
Write-Host "Para corrigir este erro, voce deve navegar para o diretorio backend antes de iniciar o servidor." -ForegroundColor Yellow

# Verificar se o ambiente virtual está ativado
$envActive = $env:VIRTUAL_ENV -ne $null
if (-not $envActive) {
    Write-Host "Ativando ambiente virtual..." -ForegroundColor Yellow
    try {
        & "$rootDir\venv\Scripts\Activate.ps1"
    } catch {
        Write-Host "Nao foi possivel ativar o ambiente virtual. Continuando sem ativar..." -ForegroundColor Yellow
    }
}

# Verificar e instalar o módulo cv2 (OpenCV)
Write-Host "Verificando se o módulo OpenCV (cv2) está instalado..." -ForegroundColor Yellow
$cv2Installed = $false
try {
    $moduleInfo = pip show opencv-python 2>&1
    if ($moduleInfo -match "Name: opencv-python") {
        $cv2Installed = $true
        Write-Host "Módulo OpenCV (cv2) já está instalado" -ForegroundColor Green
    }
} catch {
    $cv2Installed = $false
}

if (-not $cv2Installed) {
    Write-Host "Instalando o módulo OpenCV (cv2)..." -ForegroundColor Yellow
    pip install opencv-python
    
    # Verificar se a instalação foi bem-sucedida
    try {
        $moduleInfo = pip show opencv-python 2>&1
        if ($moduleInfo -match "Name: opencv-python") {
            Write-Host "Módulo OpenCV (cv2) instalado com sucesso" -ForegroundColor Green
        } else {
            Write-Host "Falha ao instalar o módulo OpenCV (cv2). Tente instalar manualmente com 'pip install opencv-python'" -ForegroundColor Red
        }
    } catch {
        Write-Host "Falha ao instalar o módulo OpenCV (cv2). Tente instalar manualmente com 'pip install opencv-python'" -ForegroundColor Red
    }
}

Write-Host "`nIniciando o backend corretamente..." -ForegroundColor Green

# Navegar para o diretorio backend
Set-Location -Path $backendDir

# Iniciar o backend
Write-Host "Executando: uvicorn app:app --reload" -ForegroundColor Cyan
Write-Host "O backend estara disponivel em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para encerrar o servidor" -ForegroundColor Red

# Iniciar o backend
uvicorn app:app --reload 