# Versionamento do Projeto Visão EnvX

Este documento explica como o versionamento do projeto Visão EnvX é gerenciado usando Git e GitHub.

## Configuração Inicial

Para configurar o versionamento do projeto, execute o script `setup-git.ps1`. Este script:

1. Verifica se o Git está instalado e oferece opções para instalá-lo
2. Inicializa um repositório Git no diretório do projeto
3. Cria um arquivo `.gitignore` apropriado
4. Configura o usuário Git (se necessário)
5. Faz o primeiro commit
6. Configura o repositório remoto no GitHub

```powershell
.\setup-git.ps1
```

## Atualização do Repositório

Para atualizar o repositório GitHub com suas alterações, use o script `update-github.ps1`. Este script:

1. Verifica o status do repositório
2. Adiciona todas as alterações
3. Solicita uma mensagem de commit
4. Faz o commit das alterações
5. Verifica se há atualizações no repositório remoto
6. Envia as alterações para o GitHub

```powershell
.\update-github.ps1
```

## Gerenciamento de Branches

Para gerenciar branches do projeto, use o script `manage-branches.ps1`. Este script oferece um menu interativo para:

1. Listar todas as branches
2. Criar nova branch
3. Mudar para outra branch
4. Mesclar branch com a branch atual
5. Excluir branch
6. Atualizar branch atual com o repositório remoto
7. Enviar branch atual para o repositório remoto

```powershell
.\manage-branches.ps1
```

## Fluxo de Trabalho Recomendado

Para evitar problemas de sobreposição e perda de arquivos, recomendamos o seguinte fluxo de trabalho:

### 1. Antes de começar a trabalhar

```powershell
# Atualizar sua branch principal (main)
git checkout main
git pull origin main

# Criar uma nova branch para sua tarefa
git checkout -b feature/nome-da-funcionalidade
```

Ou use o script `manage-branches.ps1` para criar uma nova branch.

### 2. Durante o desenvolvimento

Faça commits frequentes para salvar seu progresso:

```powershell
git add .
git commit -m "Descrição das alterações"
```

Ou use o script `update-github.ps1` para fazer commits.

### 3. Ao finalizar a tarefa

```powershell
# Atualizar sua branch com a branch principal
git checkout main
git pull origin main
git checkout feature/nome-da-funcionalidade
git merge main

# Resolver conflitos, se houver
# ...

# Enviar sua branch para o GitHub
git push -u origin feature/nome-da-funcionalidade
```

Ou use o script `manage-branches.ps1` para mesclar branches e enviar para o GitHub.

### 4. Criar um Pull Request

1. Acesse o repositório no GitHub
2. Clique em "Pull Requests" > "New Pull Request"
3. Selecione sua branch como "compare" e main como "base"
4. Clique em "Create Pull Request"
5. Adicione uma descrição e solicite revisão

### 5. Após o Pull Request ser aprovado

```powershell
# Voltar para a branch principal
git checkout main

# Atualizar a branch principal
git pull origin main

# Excluir a branch local (opcional)
git branch -d feature/nome-da-funcionalidade
```

Ou use o script `manage-branches.ps1` para excluir branches.

## Boas Práticas

1. **Nunca faça commit diretamente na branch main**
2. **Sempre crie uma branch para cada tarefa ou correção**
3. **Faça commits frequentes com mensagens descritivas**
4. **Atualize sua branch com a branch principal regularmente**
5. **Resolva conflitos imediatamente**
6. **Faça revisão de código antes de mesclar**
7. **Mantenha o histórico de commits limpo e organizado**

## Resolução de Problemas

### Conflitos de Merge

Se ocorrerem conflitos durante um merge:

1. Abra os arquivos com conflitos (marcados com `<<<<<<<`, `=======`, `>>>>>>>`)
2. Edite os arquivos para resolver os conflitos
3. Salve os arquivos
4. Execute `git add .` para marcar os conflitos como resolvidos
5. Execute `git commit` para finalizar o merge

### Reverter Alterações

Para reverter alterações não commitadas:

```powershell
git checkout -- arquivo.txt  # Reverter um arquivo específico
git checkout -- .            # Reverter todos os arquivos
```

Para reverter um commit:

```powershell
git revert HASH_DO_COMMIT
```

### Stash (Armazenamento Temporário)

Para salvar alterações temporariamente:

```powershell
git stash save "Descrição do stash"
```

Para aplicar as alterações salvas:

```powershell
git stash apply  # Mantém o stash na lista
git stash pop    # Remove o stash da lista após aplicá-lo
```

## Comandos Git Úteis

```powershell
# Ver histórico de commits
git log

# Ver alterações em um arquivo
git diff arquivo.txt

# Ver status do repositório
git status

# Ver branches
git branch

# Criar tag (versão)
git tag -a v1.0.0 -m "Versão 1.0.0"
git push origin v1.0.0
``` 