#!/bin/bash
# Script para configurar e iniciar o ambiente de desenvolvimento

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Configurando ambiente de desenvolvimento para Visão EnvX...${NC}"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 não encontrado. Por favor, instale o Python 3.8 ou superior.${NC}"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Por favor, instale o Node.js 16 ou superior.${NC}"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm não encontrado. Por favor, instale o npm 8 ou superior.${NC}"
    exit 1
fi

# Criar ambiente virtual Python se não existir
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Criando ambiente virtual Python...${NC}"
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo -e "${YELLOW}Ativando ambiente virtual...${NC}"
source venv/bin/activate || source venv/Scripts/activate

# Instalar dependências do backend
echo -e "${YELLOW}Instalando dependências do backend...${NC}"
pip install -r backend/requirements.txt

# Inicializar banco de dados
echo -e "${YELLOW}Inicializando banco de dados...${NC}"
python scripts/init_db.py

# Instalar dependências do frontend
echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
cd frontend && npm install && cd ..

# Iniciar backend e frontend
echo -e "${GREEN}Iniciando servidores de desenvolvimento...${NC}"
echo -e "${YELLOW}Backend estará disponível em: http://localhost:8000${NC}"
echo -e "${YELLOW}Frontend estará disponível em: http://localhost:3000${NC}"

# Iniciar backend em segundo plano
cd backend && python app.py &
BACKEND_PID=$!

# Iniciar frontend
cd frontend && npm start

# Quando o frontend for encerrado, encerrar também o backend
kill $BACKEND_PID 