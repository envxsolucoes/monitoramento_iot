# Script para iniciar apenas o frontend
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Iniciando o frontend do projeto Visao EnvX ===" -ForegroundColor Green

# Definir caminhos
$rootDir = $PWD
$frontendDir = Join-Path -Path $rootDir -ChildPath "frontend"

# Verificar se o diretorio frontend existe
if (-not (Test-Path -Path $frontendDir)) {
    Write-Host "Diretorio frontend nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo package.json existe no frontend
if (-not (Test-Path -Path "$frontendDir\package.json")) {
    Write-Host "Arquivo package.json nao encontrado no diretorio frontend" -ForegroundColor Red
    exit 1
}

Write-Host "Navegando para o diretorio frontend..." -ForegroundColor Yellow
Set-Location -Path $frontendDir

Write-Host "Iniciando o servidor de desenvolvimento do frontend..." -ForegroundColor Green
Write-Host "O frontend estara disponivel em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Credenciais de login: admin@admin.com / admin" -ForegroundColor Yellow
Write-Host "Pressione Ctrl+C para encerrar o servidor" -ForegroundColor Red

# Iniciar o frontend
npm start 