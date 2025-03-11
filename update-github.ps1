# Script para atualizar o repositório GitHub do projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Atualizando o repositório GitHub do projeto Visao EnvX ===" -ForegroundColor Green

# Verificar se o Git está instalado
try {
    $gitVersion = git --version 2>&1
    if ($gitVersion -match "git version") {
        Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "Git não encontrado. Por favor, execute o script setup-git.ps1 primeiro." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Git não encontrado. Por favor, execute o script setup-git.ps1 primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se estamos em um repositório Git
if (-not (Test-Path -Path ".git" -PathType Container)) {
    Write-Host "Repositório Git não encontrado. Por favor, execute o script setup-git.ps1 primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se há um repositório remoto configurado
$remoteRepo = git remote -v
if (-not $remoteRepo) {
    Write-Host "Repositório remoto não configurado. Por favor, execute o script setup-git.ps1 primeiro." -ForegroundColor Red
    exit 1
}

# Verificar o status do repositório
Write-Host "`nVerificando o status do repositório..." -ForegroundColor Yellow
git status

# Perguntar se deseja continuar
$continueChoice = Read-Host "`nDeseja continuar com a atualização do repositório? (S/N)"
if (-not ($continueChoice -eq "S" -or $continueChoice -eq "s")) {
    Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
    exit 0
}

# Verificar se há alterações para adicionar
$hasChanges = git status --porcelain
if ($hasChanges) {
    # Adicionar todas as alterações
    Write-Host "`nAdicionando todas as alterações..." -ForegroundColor Yellow
    git add .
    
    # Solicitar mensagem de commit
    $commitMessage = Read-Host "`nDigite uma mensagem descritiva para o commit (ex: 'Corrigido bug na tela de login')"
    
    if (-not $commitMessage) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $commitMessage = "Atualização do projeto em $timestamp"
    }
    
    # Fazer o commit
    Write-Host "`nRealizando commit com a mensagem: '$commitMessage'" -ForegroundColor Yellow
    git commit -m "$commitMessage"
    
    # Verificar se o commit foi bem-sucedido
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao realizar o commit. Verifique as mensagens acima." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`nNão há alterações para commit." -ForegroundColor Yellow
}

# Verificar se há commits para enviar
$hasCommitsToPush = git log @(git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)").."HEAD" --oneline
if ($hasCommitsToPush -or $hasChanges) {
    # Perguntar se deseja enviar para o GitHub
    $pushChoice = Read-Host "`nDeseja enviar as alterações para o GitHub? (S/N)"
    
    if ($pushChoice -eq "S" -or $pushChoice -eq "s") {
        # Verificar se há atualizações no repositório remoto
        Write-Host "`nVerificando atualizações no repositório remoto..." -ForegroundColor Yellow
        git fetch
        
        $behindCount = git rev-list --count HEAD..@{u} 2>$null
        if ($behindCount -gt 0) {
            Write-Host "`nO repositório local está desatualizado em relação ao remoto." -ForegroundColor Yellow
            Write-Host "Recomenda-se fazer um pull antes de enviar suas alterações." -ForegroundColor Yellow
            
            $pullChoice = Read-Host "Deseja fazer um pull antes de enviar suas alterações? (S/N)"
            if ($pullChoice -eq "S" -or $pullChoice -eq "s") {
                Write-Host "`nBaixando atualizações do repositório remoto..." -ForegroundColor Yellow
                git pull
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "Erro ao baixar atualizações. Pode haver conflitos que precisam ser resolvidos manualmente." -ForegroundColor Red
                    exit 1
                }
            }
        }
        
        # Enviar para o GitHub
        Write-Host "`nEnviando alterações para o GitHub..." -ForegroundColor Yellow
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nAlterações enviadas com sucesso para o GitHub!" -ForegroundColor Green
        } else {
            Write-Host "`nErro ao enviar alterações para o GitHub. Verifique as mensagens acima." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "`nAlterações não foram enviadas para o GitHub." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nNão há commits para enviar ao GitHub." -ForegroundColor Yellow
}

Write-Host "`n=== Operação concluída ===" -ForegroundColor Green 