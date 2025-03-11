# Script para configurar o Git e o versionamento do projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Configurando o Git e o versionamento do projeto Visao EnvX ===" -ForegroundColor Green

# Verificar se o Git está instalado
$gitInstalled = $false
try {
    $gitVersion = git --version 2>&1
    if ($gitVersion -match "git version") {
        $gitInstalled = $true
        Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
    }
} catch {
    $gitInstalled = $false
}

# Se o Git não estiver instalado, oferecer opções para instalá-lo
if (-not $gitInstalled) {
    Write-Host "Git não encontrado no sistema." -ForegroundColor Yellow
    Write-Host "Você precisa instalar o Git para continuar." -ForegroundColor Yellow
    Write-Host "Opções de instalação:" -ForegroundColor Cyan
    Write-Host "1. Baixe o instalador do Git em: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "2. Ou instale via winget (Windows 10/11): winget install --id Git.Git" -ForegroundColor Cyan
    Write-Host "3. Ou instale via Chocolatey: choco install git" -ForegroundColor Cyan
    
    $choice = Read-Host "Deseja tentar instalar o Git automaticamente via winget? (S/N)"
    if ($choice -eq "S" -or $choice -eq "s") {
        try {
            Write-Host "Tentando instalar o Git via winget..." -ForegroundColor Yellow
            winget install --id Git.Git
            
            # Recarregar o PATH para reconhecer o Git recém-instalado
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Verificar se o Git foi instalado com sucesso
            $gitVersion = git --version 2>&1
            if ($gitVersion -match "git version") {
                $gitInstalled = $true
                Write-Host "Git instalado com sucesso: $gitVersion" -ForegroundColor Green
            } else {
                Write-Host "Falha ao instalar o Git automaticamente." -ForegroundColor Red
                Write-Host "Por favor, instale o Git manualmente e execute este script novamente." -ForegroundColor Red
                exit 1
            }
        } catch {
            Write-Host "Falha ao instalar o Git automaticamente." -ForegroundColor Red
            Write-Host "Por favor, instale o Git manualmente e execute este script novamente." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Por favor, instale o Git manualmente e execute este script novamente." -ForegroundColor Red
        exit 1
    }
}

# Verificar se estamos no diretório correto do projeto
$rootDir = $PWD
$backendDir = Join-Path -Path $rootDir -ChildPath "backend"
$frontendDir = Join-Path -Path $rootDir -ChildPath "frontend"

if (-not (Test-Path -Path $backendDir) -or -not (Test-Path -Path $frontendDir)) {
    Write-Host "Diretórios do projeto não encontrados. Certifique-se de executar este script no diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

# Verificar se o repositório Git já está inicializado
$gitInitialized = Test-Path -Path ".git" -PathType Container
if (-not $gitInitialized) {
    Write-Host "Inicializando o repositório Git..." -ForegroundColor Yellow
    git init
    
    # Criar arquivo .gitignore
    Write-Host "Criando arquivo .gitignore..." -ForegroundColor Yellow
    @"
# Ambiente virtual Python
venv/
env/
ENV/

# Arquivos de cache Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependências
node_modules/
jspm_packages/

# Arquivos de ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Arquivos de build
/build
/dist

# Arquivos de IDE
.idea/
.vscode/
*.swp
*.swo
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
} else {
    Write-Host "Repositório Git já inicializado" -ForegroundColor Green
}

# Configurar usuário Git (se necessário)
$gitUserName = git config --global user.name
$gitUserEmail = git config --global user.email

if (-not $gitUserName -or -not $gitUserEmail) {
    Write-Host "Configurando usuário Git..." -ForegroundColor Yellow
    
    if (-not $gitUserName) {
        $userName = Read-Host "Digite seu nome para o Git"
        git config --global user.name "$userName"
    }
    
    if (-not $gitUserEmail) {
        $userEmail = Read-Host "Digite seu email para o Git"
        git config --global user.email "$userEmail"
    }
}

# Adicionar arquivos ao Git
Write-Host "Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# Fazer o primeiro commit
Write-Host "Fazendo o primeiro commit..." -ForegroundColor Yellow
git commit -m "Versão inicial do projeto Visão EnvX"

# Configurar o repositório remoto no GitHub
$configuredRemote = git remote -v
if (-not $configuredRemote) {
    Write-Host "Configurando repositório remoto no GitHub..." -ForegroundColor Yellow
    Write-Host "Para continuar, você precisa criar um repositório no GitHub:" -ForegroundColor Cyan
    Write-Host "1. Acesse https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Crie um novo repositório (pode ser público ou privado)" -ForegroundColor Cyan
    Write-Host "3. NÃO inicialize o repositório com README, .gitignore ou licença" -ForegroundColor Cyan
    
    $repoUrl = Read-Host "Cole a URL do repositório GitHub (ex: https://github.com/seu-usuario/visao-envx.git)"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        
        # Configurar a branch principal como 'main'
        git branch -M main
        
        # Enviar para o GitHub
        Write-Host "Enviando o código para o GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        Write-Host "Repositório configurado com sucesso!" -ForegroundColor Green
        Write-Host "URL do repositório: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "URL do repositório não fornecida. O código não foi enviado para o GitHub." -ForegroundColor Yellow
        Write-Host "Você pode configurar o repositório remoto posteriormente com:" -ForegroundColor Cyan
        Write-Host "git remote add origin URL_DO_REPOSITORIO" -ForegroundColor Cyan
        Write-Host "git push -u origin main" -ForegroundColor Cyan
    }
} else {
    Write-Host "Repositório remoto já configurado:" -ForegroundColor Green
    Write-Host $configuredRemote -ForegroundColor Green
    
    # Perguntar se deseja enviar as alterações para o GitHub
    $pushChoice = Read-Host "Deseja enviar as alterações para o GitHub? (S/N)"
    if ($pushChoice -eq "S" -or $pushChoice -eq "s") {
        git push
    }
}

Write-Host "`n=== Configuração do Git concluída ===" -ForegroundColor Green
Write-Host "Seu projeto agora está versionado com Git e pode ser sincronizado com o GitHub." -ForegroundColor Cyan
Write-Host "Para enviar novas alterações, use os seguintes comandos:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor Yellow
Write-Host "2. git commit -m 'Descrição das alterações'" -ForegroundColor Yellow
Write-Host "3. git push" -ForegroundColor Yellow 