# Visão EnvX - Instruções para Windows

Este documento contém instruções específicas para configurar e executar o projeto Visão EnvX em ambientes Windows.

## Requisitos

- Windows 10 ou superior
- Python 3.8+ (recomendamos a instalação via [Microsoft Store](https://apps.microsoft.com/store/detail/python-310/9PJPW5LDXLZ5) ou [python.org](https://www.python.org/downloads/windows/))
- Node.js 16+ ([Download](https://nodejs.org/en/download/))
- Git para Windows ([Download](https://git-scm.com/download/win))
- Visual Studio Build Tools (para compilação de algumas dependências)

## Instalação do Ambiente de Desenvolvimento

1. **Instale o Visual Studio Build Tools**:
   - Baixe e instale o [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Durante a instalação, selecione "Desenvolvimento para desktop com C++"

2. **Clone o repositório**:
   ```
   git clone https://github.com/envxsolucoes/Vision_ENVX.git
   cd Vision_ENVX
   ```

3. **Configure o ambiente virtual Python**:
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```

4. **Instale as dependências do backend**:
   ```
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

5. **Instale as dependências do frontend**:
   ```
   cd frontend
   npm install
   cd ..
   ```

## Executando o Projeto

1. **Inicie o backend**:
   ```
   .\venv\Scripts\activate
   cd backend
   python app.py
   ```

2. **Em outro terminal, inicie o frontend**:
   ```
   cd frontend
   npm start
   ```

3. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Documentação da API: http://localhost:8000/docs

## Solução de Problemas Comuns

### Erro ao instalar pacotes Python com componentes C/C++

Se você encontrar erros ao instalar pacotes como OpenCV, verifique se:
- Visual Studio Build Tools está instalado corretamente
- Você está usando uma versão de Python compatível (recomendamos 3.8 ou 3.9)
- Execute o PowerShell como administrador e tente novamente

### Erro "npm não é reconhecido como um comando"

Verifique se o Node.js está instalado corretamente e se o caminho está nas variáveis de ambiente do sistema.
Você pode adicionar manualmente o caminho (geralmente `C:\Program Files\nodejs\`) às variáveis de ambiente.

### Problemas com a câmera

Para testar a câmera no Windows:
```
python -c "import cv2; cap = cv2.VideoCapture(0); print('Câmera disponível:', cap.isOpened()); cap.release()"
```

Se a câmera não for detectada, verifique:
- Se os drivers da câmera estão instalados
- Se outras aplicações não estão usando a câmera
- Se as permissões de acesso à câmera estão habilitadas nas configurações de privacidade do Windows

## Desenvolvimento com WSL (Windows Subsystem for Linux)

Para um ambiente de desenvolvimento mais próximo ao de produção, considere usar o WSL:

1. **Instale o WSL 2** seguindo as [instruções oficiais da Microsoft](https://docs.microsoft.com/pt-br/windows/wsl/install)

2. **Instale uma distribuição Linux** (recomendamos Ubuntu)

3. **Dentro do WSL**, siga as instruções de instalação para Linux no README principal

Esta abordagem é especialmente útil se você planeja implantar em um Raspberry Pi ou outro sistema Linux. 