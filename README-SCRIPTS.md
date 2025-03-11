# Scripts para o Projeto Visão EnvX

Este diretório contém scripts para facilitar o desenvolvimento, teste e execução do projeto Visão EnvX.

## Scripts Disponíveis

### 1. `check-environment.ps1`

Este script verifica se o ambiente de desenvolvimento está corretamente configurado.

**Funcionalidades:**
- Verifica se Python, Node.js e npm estão instalados
- Verifica se o ambiente virtual Python existe
- Verifica a estrutura do projeto (diretórios e arquivos essenciais)
- Verifica se as dependências do backend estão instaladas

**Como usar:**
```powershell
.\check-environment.ps1
```

### 2. `start-servers.ps1`

Este script simplificado inicia os servidores de backend e frontend em janelas separadas.

**Funcionalidades:**
- Inicia o servidor backend com uvicorn
- Inicia o servidor frontend com npm start
- Abre janelas separadas para cada servidor

**Como usar:**
```powershell
.\start-servers.ps1
```

### 3. `start-project.ps1`

Este script completo configura o ambiente e inicia os servidores.

**Funcionalidades:**
- Verifica se Python, Node.js e npm estão instalados
- Cria e ativa o ambiente virtual Python se não existir
- Instala as dependências do backend
- Verifica se o backend está funcionando
- Instala as dependências do frontend
- Inicia os servidores de backend e frontend em janelas separadas

**Como usar:**
```powershell
.\start-project.ps1
```

### 4. `fix-backend.ps1`

Este script corrige o erro comum ao tentar iniciar o backend a partir do diretório raiz.

**Funcionalidades:**
- Navega para o diretório backend
- Verifica e instala o módulo OpenCV (cv2) se necessário
- Inicia o servidor backend corretamente
- Explica o erro e como evita-lo

**Como usar:**
```powershell
.\fix-backend.ps1
```

### 5. `start-frontend.ps1`

Este script inicia apenas o servidor de desenvolvimento do frontend.

**Funcionalidades:**
- Navega para o diretório frontend
- Inicia o servidor frontend com npm start

**Como usar:**
```powershell
.\start-frontend.ps1
```

### 6. `start-backend.ps1`

Este script inicia apenas o servidor backend.

**Funcionalidades:**
- Navega para o diretório backend
- Verifica e instala o módulo OpenCV (cv2) se necessário
- Inicia o servidor backend com uvicorn

**Como usar:**
```powershell
.\start-backend.ps1
```

## Fluxo de Trabalho Recomendado

1. Execute `.\check-environment.ps1` para verificar se o ambiente está configurado corretamente
2. Execute `.\start-project.ps1` para configurar o ambiente e iniciar os servidores
3. Se encontrar erros, use os scripts específicos:
   - `.\fix-backend.ps1` para corrigir problemas com o backend
   - `.\start-frontend.ps1` para iniciar apenas o frontend
   - `.\start-backend.ps1` para iniciar apenas o backend

## Informações de Acesso

Após iniciar os servidores:

- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:3000
- **Documentação da API:** http://localhost:8000/docs
- **Credenciais de login:** admin@admin.com / admin

## Solução de Problemas

### Erro ao executar scripts PowerShell

Se você encontrar erros de permissão ao executar os scripts, pode ser necessário alterar a política de execução do PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro ao iniciar o backend

Se o backend não iniciar corretamente, verifique:
1. Se você está no diretório correto (deve estar dentro do diretório `backend`)
2. Se todas as dependências estão instaladas
3. Se o arquivo app.py existe no diretório backend

**Erro comum 1:** `ERROR: Error loading ASGI app. Could not import module "app".`
- **Solução:** Use o script `fix-backend.ps1` ou navegue para o diretório backend antes de iniciar o servidor:
  ```powershell
  cd backend
  uvicorn app:app --reload
  ```

**Erro comum 2:** `ModuleNotFoundError: No module named 'cv2'`
- **Solução:** Instale o módulo OpenCV usando pip:
  ```powershell
  pip install opencv-python
  ```
  Ou use os scripts atualizados `fix-backend.ps1` ou `start-backend.ps1` que instalam automaticamente o OpenCV.

### Erro ao iniciar o frontend

Se o frontend não iniciar corretamente, verifique:
1. Se você está no diretório correto (deve estar dentro do diretório `frontend`)
2. Se todas as dependências estão instaladas
3. Se o arquivo package.json existe no diretório frontend

### Problemas com dependências

Se encontrar erros relacionados a dependências faltando:

**Para o backend:**
```powershell
pip install fastapi uvicorn python-multipart python-dotenv sqlalchemy opencv-python
```

**Para o frontend:**
```powershell
cd frontend
npm install
``` 