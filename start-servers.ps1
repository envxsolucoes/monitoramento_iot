# Script simplificado para iniciar o projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Iniciando o projeto Visao EnvX ===" -ForegroundColor Green

# Definir caminhos
$rootDir = $PWD
$backendDir = Join-Path -Path $rootDir -ChildPath "backend"
$frontendDir = Join-Path -Path $rootDir -ChildPath "frontend"

# Verificar se os diretorios existem
if (-not (Test-Path -Path $backendDir)) {
    Write-Host "Diretorio backend nao encontrado" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -Path $frontendDir)) {
    Write-Host "Diretorio frontend nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo app.py existe no backend
if (-not (Test-Path -Path "$backendDir\app.py")) {
    Write-Host "Arquivo app.py nao encontrado no diretorio backend" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo package.json existe no frontend
if (-not (Test-Path -Path "$frontendDir\package.json")) {
    Write-Host "Arquivo package.json nao encontrado no diretorio frontend" -ForegroundColor Red
    exit 1
}

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
Write-Host "Aguardando o backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar o frontend em uma nova janela
Write-Host "Iniciando o frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm start"

Write-Host "`n=== Servidores iniciados com sucesso! ===" -ForegroundColor Green
Write-Host "Voce pode fechar esta janela agora. Os servidores continuarao rodando nas novas janelas." -ForegroundColor Cyan 