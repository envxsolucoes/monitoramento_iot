# Script para verificar o ambiente do projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Verificando o ambiente do projeto Visao EnvX ===" -ForegroundColor Green

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

# Verificar se o ambiente virtual Python existe
if (Test-Path -Path "venv") {
    Write-Host "Ambiente virtual Python encontrado" -ForegroundColor Green
} else {
    Write-Host "Ambiente virtual Python nao encontrado. Execute 'python -m venv venv' para cria-lo." -ForegroundColor Yellow
}

# Verificar estrutura do projeto
$rootDir = $PWD
$backendDir = Join-Path -Path $rootDir -ChildPath "backend"
$frontendDir = Join-Path -Path $rootDir -ChildPath "frontend"

# Verificar backend
if (Test-Path -Path $backendDir) {
    Write-Host "Diretorio backend encontrado" -ForegroundColor Green
    
    # Verificar arquivos essenciais do backend
    $backendFiles = @("app.py", "requirements.txt", ".env")
    foreach ($file in $backendFiles) {
        $filePath = Join-Path -Path $backendDir -ChildPath $file
        if (Test-Path -Path $filePath) {
            Write-Host "  Arquivo $file encontrado" -ForegroundColor Green
        } else {
            Write-Host "  Arquivo $file nao encontrado" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Diretorio backend nao encontrado" -ForegroundColor Red
}

# Verificar frontend
if (Test-Path -Path $frontendDir) {
    Write-Host "Diretorio frontend encontrado" -ForegroundColor Green
    
    # Verificar arquivos essenciais do frontend
    $frontendFiles = @("package.json", "src/App.js", "public/index.html")
    foreach ($file in $frontendFiles) {
        $filePath = Join-Path -Path $frontendDir -ChildPath $file
        if (Test-Path -Path $filePath) {
            Write-Host "  Arquivo $file encontrado" -ForegroundColor Green
        } else {
            Write-Host "  Arquivo $file nao encontrado" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Diretorio frontend nao encontrado" -ForegroundColor Red
}

# Verificar se as dependencias do backend estao instaladas
Write-Host "`n=== Verificando dependencias do backend ===" -ForegroundColor Green
try {
    if (Test-Path -Path "venv\Scripts\Activate.ps1") {
        & .\venv\Scripts\Activate.ps1
        $modules = @("fastapi", "uvicorn", "python-multipart", "sqlalchemy", "opencv-python")
        foreach ($module in $modules) {
            try {
                $moduleInfo = pip show $module 2>&1
                if ($moduleInfo -match "Name: $module") {
                    Write-Host "Modulo $module instalado" -ForegroundColor Green
                } else {
                    Write-Host "Modulo $module nao instalado" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "Modulo $module nao instalado" -ForegroundColor Yellow
            }
        }
        deactivate
    } else {
        Write-Host "Arquivo de ativacao do ambiente virtual nao encontrado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Nao foi possivel ativar o ambiente virtual" -ForegroundColor Yellow
}

Write-Host "`n=== Verificacao concluida ===" -ForegroundColor Green
Write-Host "Para iniciar os servidores, execute o script 'start-servers.ps1'" -ForegroundColor Cyan
Write-Host "Para configurar o ambiente completo, execute o script 'start-project.ps1'" -ForegroundColor Cyan 