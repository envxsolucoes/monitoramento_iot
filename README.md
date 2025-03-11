# Visão EnvX

Sistema de visão computacional para monitoramento ambiental.

## Requisitos

### Para desenvolvimento:
- Python 3.8+
- Node.js 16+
- npm 8+
- Git (para versionamento)

### Para produção (Raspberry Pi):
- Raspberry Pi 4 (recomendado)
- Sistema operacional Raspberry Pi OS (64-bit recomendado)
- Câmera compatível com Raspberry Pi

## Instalação

### Ambiente de Desenvolvimento

1. Clone o repositório:
```
git clone https://github.com/envxsolucoes/Vision_ENVX.git
cd Vision_ENVX
```

2. Inicie o ambiente de desenvolvimento:

**No Linux/macOS:**
```
cd scripts
chmod +x dev.sh
./dev.sh
```

**No Windows:**
```
.\scripts\dev.bat
```
ou use os scripts PowerShell:
```
.\start-project.ps1
```

O script irá:
- Criar um ambiente virtual Python
- Instalar todas as dependências do backend
- Instalar todas as dependências do frontend
- Iniciar o servidor de desenvolvimento do backend
- Iniciar o servidor de desenvolvimento do frontend

### Instalação em Produção (Raspberry Pi)

1. Clone o repositório:
```
git clone https://github.com/envxsolucoes/Vision_ENVX.git
cd Vision_ENVX
```

2. Execute o script de instalação:
```
cd scripts
chmod +x install.sh
sudo ./install.sh
```

O script irá:
- Instalar todas as dependências necessárias
- Configurar o ambiente Python
- Configurar o frontend
- Configurar o backend
- Configurar o Nginx como proxy reverso
- Configurar o serviço systemd para inicialização automática

## Estrutura do Projeto

```
Vision_ENVX/
├── backend/           # API FastAPI
├── frontend/          # Interface React
├── scripts/           # Scripts de instalação e desenvolvimento
└── models/            # Modelos de visão computacional
```

## Uso

### Desenvolvimento

O ambiente de desenvolvimento estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Documentação da API: http://localhost:8000/docs

### Produção

Após a instalação em produção, o sistema estará disponível em:
- Interface web: http://[IP-DO-RASPBERRY]
- API: http://[IP-DO-RASPBERRY]/api

## Scripts PowerShell (Windows)

Para facilitar o desenvolvimento no Windows, o projeto inclui vários scripts PowerShell:

- `check-environment.ps1`: Verifica se o ambiente está configurado corretamente
- `start-project.ps1`: Configura o ambiente e inicia os servidores
- `start-servers.ps1`: Inicia os servidores de backend e frontend
- `start-backend.ps1`: Inicia apenas o servidor backend
- `start-frontend.ps1`: Inicia apenas o servidor frontend
- `fix-backend.ps1`: Corrige erros comuns ao iniciar o backend

Para mais informações sobre os scripts, consulte o arquivo [README-SCRIPTS.md](README-SCRIPTS.md).

## Versionamento

O projeto utiliza Git para versionamento. Para configurar e gerenciar o versionamento, use os seguintes scripts:

- `setup-git.ps1`: Configura o Git e o repositório remoto
- `update-github.ps1`: Atualiza o repositório GitHub com suas alterações
- `manage-branches.ps1`: Gerencia branches do projeto

Para mais informações sobre o versionamento, consulte o arquivo [README-GIT.md](README-GIT.md).

## Manutenção

### Logs
```
# Visualizar logs do backend
sudo journalctl -u visao_envx -f

# Visualizar logs do nginx
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar Serviços
```
# Reiniciar backend
sudo systemctl restart visao_envx

# Reiniciar nginx
sudo systemctl restart nginx
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.