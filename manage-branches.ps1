# Script para gerenciar branches do Git no projeto Visao EnvX
# Autor: Assistente Claude
# Data: 2025-03-11

Write-Host "=== Gerenciamento de Branches do projeto Visao EnvX ===" -ForegroundColor Green

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

# Função para exibir o menu principal
function Show-Menu {
    Write-Host "`n=== Menu de Gerenciamento de Branches ===" -ForegroundColor Cyan
    Write-Host "1. Listar todas as branches" -ForegroundColor Yellow
    Write-Host "2. Criar nova branch" -ForegroundColor Yellow
    Write-Host "3. Mudar para outra branch" -ForegroundColor Yellow
    Write-Host "4. Mesclar branch com a branch atual" -ForegroundColor Yellow
    Write-Host "5. Excluir branch" -ForegroundColor Yellow
    Write-Host "6. Atualizar branch atual com o repositório remoto" -ForegroundColor Yellow
    Write-Host "7. Enviar branch atual para o repositório remoto" -ForegroundColor Yellow
    Write-Host "8. Sair" -ForegroundColor Yellow
    
    $choice = Read-Host "`nEscolha uma opção (1-8)"
    return $choice
}

# Função para listar todas as branches
function List-Branches {
    Write-Host "`n=== Branches Locais ===" -ForegroundColor Cyan
    git branch
    
    Write-Host "`n=== Branches Remotas ===" -ForegroundColor Cyan
    git branch -r
    
    Write-Host "`nBranch atual:" -ForegroundColor Green
    git branch --show-current
}

# Função para criar uma nova branch
function Create-Branch {
    $branchName = Read-Host "`nDigite o nome da nova branch (ex: feature/login, bugfix/navbar)"
    
    if (-not $branchName) {
        Write-Host "Nome da branch não pode ser vazio." -ForegroundColor Red
        return
    }
    
    # Verificar se a branch já existe
    $branchExists = git show-ref --verify --quiet refs/heads/$branchName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "A branch '$branchName' já existe." -ForegroundColor Red
        return
    }
    
    # Criar a nova branch
    Write-Host "`nCriando branch '$branchName'..." -ForegroundColor Yellow
    git checkout -b $branchName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Branch '$branchName' criada com sucesso e definida como branch atual." -ForegroundColor Green
        
        # Perguntar se deseja enviar a branch para o repositório remoto
        $pushChoice = Read-Host "Deseja enviar esta branch para o repositório remoto? (S/N)"
        if ($pushChoice -eq "S" -or $pushChoice -eq "s") {
            git push -u origin $branchName
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Branch '$branchName' enviada para o repositório remoto." -ForegroundColor Green
            } else {
                Write-Host "Erro ao enviar a branch para o repositório remoto." -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Erro ao criar a branch." -ForegroundColor Red
    }
}

# Função para mudar para outra branch
function Switch-Branch {
    # Listar branches disponíveis
    Write-Host "`n=== Branches Disponíveis ===" -ForegroundColor Cyan
    git branch
    
    $branchName = Read-Host "`nDigite o nome da branch para a qual deseja mudar"
    
    if (-not $branchName) {
        Write-Host "Nome da branch não pode ser vazio." -ForegroundColor Red
        return
    }
    
    # Verificar se há alterações não commitadas
    $hasChanges = git status --porcelain
    if ($hasChanges) {
        Write-Host "`nHá alterações não commitadas no seu repositório." -ForegroundColor Yellow
        Write-Host "Recomenda-se fazer commit das alterações antes de mudar de branch." -ForegroundColor Yellow
        
        $commitChoice = Read-Host "Deseja fazer commit das alterações antes de mudar de branch? (S/N)"
        if ($commitChoice -eq "S" -or $commitChoice -eq "s") {
            git add .
            
            $commitMessage = Read-Host "Digite uma mensagem para o commit"
            if (-not $commitMessage) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                $commitMessage = "Alterações antes de mudar para branch $branchName - $timestamp"
            }
            
            git commit -m "$commitMessage"
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Erro ao fazer commit das alterações." -ForegroundColor Red
                return
            }
        } else {
            $stashChoice = Read-Host "Deseja salvar as alterações em um stash temporário? (S/N)"
            if ($stashChoice -eq "S" -or $stashChoice -eq "s") {
                $stashName = "stash_before_switch_to_$branchName"
                git stash push -m $stashName
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "Erro ao criar stash das alterações." -ForegroundColor Red
                    return
                }
                
                Write-Host "Alterações salvas em stash temporário." -ForegroundColor Green
            }
        }
    }
    
    # Mudar para a branch especificada
    Write-Host "`nMudando para a branch '$branchName'..." -ForegroundColor Yellow
    git checkout $branchName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Agora você está na branch '$branchName'." -ForegroundColor Green
    } else {
        Write-Host "Erro ao mudar para a branch '$branchName'. Verifique se o nome está correto." -ForegroundColor Red
    }
}

# Função para mesclar uma branch com a branch atual
function Merge-Branch {
    # Obter a branch atual
    $currentBranch = git branch --show-current
    
    # Listar branches disponíveis
    Write-Host "`n=== Branches Disponíveis para Mesclar na Branch Atual ($currentBranch) ===" -ForegroundColor Cyan
    git branch
    
    $branchName = Read-Host "`nDigite o nome da branch que deseja mesclar na branch atual"
    
    if (-not $branchName) {
        Write-Host "Nome da branch não pode ser vazio." -ForegroundColor Red
        return
    }
    
    if ($branchName -eq $currentBranch) {
        Write-Host "Não é possível mesclar a branch atual com ela mesma." -ForegroundColor Red
        return
    }
    
    # Verificar se a branch existe
    $branchExists = git show-ref --verify --quiet refs/heads/$branchName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "A branch '$branchName' não existe." -ForegroundColor Red
        return
    }
    
    # Mesclar a branch
    Write-Host "`nMesclando a branch '$branchName' na branch atual '$currentBranch'..." -ForegroundColor Yellow
    git merge $branchName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Branch '$branchName' mesclada com sucesso na branch '$currentBranch'." -ForegroundColor Green
    } else {
        Write-Host "Ocorreram conflitos durante a mesclagem." -ForegroundColor Red
        Write-Host "Resolva os conflitos manualmente e depois execute 'git add .' seguido de 'git commit'." -ForegroundColor Yellow
    }
}

# Função para excluir uma branch
function Delete-Branch {
    # Obter a branch atual
    $currentBranch = git branch --show-current
    
    # Listar branches disponíveis
    Write-Host "`n=== Branches Disponíveis para Exclusão ===" -ForegroundColor Cyan
    git branch
    
    $branchName = Read-Host "`nDigite o nome da branch que deseja excluir"
    
    if (-not $branchName) {
        Write-Host "Nome da branch não pode ser vazio." -ForegroundColor Red
        return
    }
    
    if ($branchName -eq $currentBranch) {
        Write-Host "Não é possível excluir a branch atual. Mude para outra branch primeiro." -ForegroundColor Red
        return
    }
    
    # Verificar se a branch existe
    $branchExists = git show-ref --verify --quiet refs/heads/$branchName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "A branch '$branchName' não existe." -ForegroundColor Red
        return
    }
    
    # Confirmar exclusão
    $confirmChoice = Read-Host "Tem certeza que deseja excluir a branch '$branchName'? (S/N)"
    if (-not ($confirmChoice -eq "S" -or $confirmChoice -eq "s")) {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        return
    }
    
    # Excluir a branch local
    Write-Host "`nExcluindo a branch local '$branchName'..." -ForegroundColor Yellow
    git branch -d $branchName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "A branch '$branchName' não foi totalmente mesclada." -ForegroundColor Yellow
        $forceChoice = Read-Host "Deseja forçar a exclusão? (S/N)"
        
        if ($forceChoice -eq "S" -or $forceChoice -eq "s") {
            git branch -D $branchName
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Branch '$branchName' excluída com sucesso (forçado)." -ForegroundColor Green
            } else {
                Write-Host "Erro ao excluir a branch." -ForegroundColor Red
                return
            }
        } else {
            Write-Host "Operação cancelada." -ForegroundColor Yellow
            return
        }
    } else {
        Write-Host "Branch '$branchName' excluída com sucesso." -ForegroundColor Green
    }
    
    # Perguntar se deseja excluir a branch remota também
    $remoteChoice = Read-Host "Deseja excluir a branch remota também? (S/N)"
    if ($remoteChoice -eq "S" -or $remoteChoice -eq "s") {
        git push origin --delete $branchName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Branch remota '$branchName' excluída com sucesso." -ForegroundColor Green
        } else {
            Write-Host "Erro ao excluir a branch remota. Ela pode não existir no repositório remoto." -ForegroundColor Red
        }
    }
}

# Função para atualizar a branch atual com o repositório remoto
function Update-Branch {
    # Obter a branch atual
    $currentBranch = git branch --show-current
    
    # Verificar se há alterações não commitadas
    $hasChanges = git status --porcelain
    if ($hasChanges) {
        Write-Host "`nHá alterações não commitadas no seu repositório." -ForegroundColor Yellow
        Write-Host "Recomenda-se fazer commit das alterações antes de atualizar a branch." -ForegroundColor Yellow
        
        $commitChoice = Read-Host "Deseja fazer commit das alterações antes de atualizar? (S/N)"
        if ($commitChoice -eq "S" -or $commitChoice -eq "s") {
            git add .
            
            $commitMessage = Read-Host "Digite uma mensagem para o commit"
            if (-not $commitMessage) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                $commitMessage = "Alterações antes de atualizar a branch $currentBranch - $timestamp"
            }
            
            git commit -m "$commitMessage"
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Erro ao fazer commit das alterações." -ForegroundColor Red
                return
            }
        } else {
            $stashChoice = Read-Host "Deseja salvar as alterações em um stash temporário? (S/N)"
            if ($stashChoice -eq "S" -or $stashChoice -eq "s") {
                $stashName = "stash_before_update_$currentBranch"
                git stash push -m $stashName
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "Erro ao criar stash das alterações." -ForegroundColor Red
                    return
                }
                
                Write-Host "Alterações salvas em stash temporário." -ForegroundColor Green
            }
        }
    }
    
    # Atualizar a branch atual
    Write-Host "`nAtualizando a branch '$currentBranch' com o repositório remoto..." -ForegroundColor Yellow
    
    # Primeiro, buscar as alterações do repositório remoto
    git fetch origin
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao buscar alterações do repositório remoto." -ForegroundColor Red
        return
    }
    
    # Verificar se há alterações para puxar
    $behindCount = git rev-list --count HEAD..origin/$currentBranch 2>$null
    if ($behindCount -eq 0) {
        Write-Host "A branch '$currentBranch' já está atualizada com o repositório remoto." -ForegroundColor Green
        return
    }
    
    # Puxar as alterações
    git pull origin $currentBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Branch '$currentBranch' atualizada com sucesso." -ForegroundColor Green
        
        # Verificar se havia um stash e perguntar se deseja aplicá-lo
        $stashList = git stash list | Select-String "stash_before_update_$currentBranch"
        if ($stashList) {
            $applyStashChoice = Read-Host "Deseja aplicar o stash temporário criado anteriormente? (S/N)"
            if ($applyStashChoice -eq "S" -or $applyStashChoice -eq "s") {
                git stash apply
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Stash aplicado com sucesso." -ForegroundColor Green
                    
                    $dropStashChoice = Read-Host "Deseja remover o stash da lista? (S/N)"
                    if ($dropStashChoice -eq "S" -or $dropStashChoice -eq "s") {
                        git stash drop
                    }
                } else {
                    Write-Host "Erro ao aplicar o stash." -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "Ocorreram conflitos durante a atualização." -ForegroundColor Red
        Write-Host "Resolva os conflitos manualmente e depois execute 'git add .' seguido de 'git commit'." -ForegroundColor Yellow
    }
}

# Função para enviar a branch atual para o repositório remoto
function Push-Branch {
    # Obter a branch atual
    $currentBranch = git branch --show-current
    
    # Verificar se há alterações não commitadas
    $hasChanges = git status --porcelain
    if ($hasChanges) {
        Write-Host "`nHá alterações não commitadas no seu repositório." -ForegroundColor Yellow
        
        $commitChoice = Read-Host "Deseja fazer commit das alterações antes de enviar? (S/N)"
        if ($commitChoice -eq "S" -or $commitChoice -eq "s") {
            git add .
            
            $commitMessage = Read-Host "Digite uma mensagem para o commit"
            if (-not $commitMessage) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                $commitMessage = "Alterações na branch $currentBranch - $timestamp"
            }
            
            git commit -m "$commitMessage"
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Erro ao fazer commit das alterações." -ForegroundColor Red
                return
            }
        } else {
            Write-Host "Você precisa fazer commit das alterações antes de enviar para o repositório remoto." -ForegroundColor Red
            return
        }
    }
    
    # Verificar se há commits para enviar
    $hasCommitsToPush = git log @(git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)").."HEAD" --oneline
    if (-not $hasCommitsToPush -and -not $hasChanges) {
        Write-Host "`nNão há commits para enviar ao repositório remoto." -ForegroundColor Yellow
        return
    }
    
    # Enviar a branch atual para o repositório remoto
    Write-Host "`nEnviando a branch '$currentBranch' para o repositório remoto..." -ForegroundColor Yellow
    
    # Verificar se a branch existe no repositório remoto
    $remoteBranchExists = git ls-remote --heads origin $currentBranch
    
    if ($remoteBranchExists) {
        git push origin $currentBranch
    } else {
        git push -u origin $currentBranch
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Branch '$currentBranch' enviada com sucesso para o repositório remoto." -ForegroundColor Green
    } else {
        Write-Host "Erro ao enviar a branch para o repositório remoto." -ForegroundColor Red
        Write-Host "Pode ser necessário atualizar sua branch local antes de enviar." -ForegroundColor Yellow
        
        $pullChoice = Read-Host "Deseja atualizar sua branch local antes de tentar novamente? (S/N)"
        if ($pullChoice -eq "S" -or $pullChoice -eq "s") {
            Update-Branch
            
            # Tentar enviar novamente
            Write-Host "`nTentando enviar a branch novamente..." -ForegroundColor Yellow
            git push origin $currentBranch
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Branch '$currentBranch' enviada com sucesso para o repositório remoto." -ForegroundColor Green
            } else {
                Write-Host "Erro ao enviar a branch para o repositório remoto." -ForegroundColor Red
            }
        }
    }
}

# Loop principal do menu
$exit = $false
while (-not $exit) {
    $choice = Show-Menu
    
    switch ($choice) {
        "1" { List-Branches }
        "2" { Create-Branch }
        "3" { Switch-Branch }
        "4" { Merge-Branch }
        "5" { Delete-Branch }
        "6" { Update-Branch }
        "7" { Push-Branch }
        "8" { $exit = $true }
        default { Write-Host "`nOpção inválida. Por favor, escolha uma opção de 1 a 8." -ForegroundColor Red }
    }
    
    if (-not $exit) {
        Write-Host "`nPressione Enter para continuar..." -ForegroundColor Cyan
        Read-Host
    }
}

Write-Host "`n=== Saindo do Gerenciamento de Branches ===" -ForegroundColor Green 