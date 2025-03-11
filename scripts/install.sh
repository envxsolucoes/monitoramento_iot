#!/bin/bash
# Script para instalar o sistema Visão EnvX em produção (Raspberry Pi)

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está sendo executado como root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Por favor, execute este script como root (sudo).${NC}"
  exit 1
fi

echo -e "${GREEN}Instalando Visão EnvX em produção...${NC}"

# Atualizar sistema
echo -e "${YELLOW}Atualizando sistema...${NC}"
apt update && apt upgrade -y

# Instalar dependências do sistema
echo -e "${YELLOW}Instalando dependências do sistema...${NC}"
apt install -y python3 python3-pip python3-venv nodejs npm nginx postgresql postgresql-contrib libpq-dev

# Criar usuário para o serviço
echo -e "${YELLOW}Configurando usuário do serviço...${NC}"
if ! id -u visao_envx > /dev/null 2>&1; then
    useradd -m -s /bin/bash visao_envx
fi

# Configurar diretório da aplicação
APP_DIR="/opt/visao_envx"
echo -e "${YELLOW}Configurando diretório da aplicação: ${APP_DIR}${NC}"
mkdir -p $APP_DIR
cp -r ../backend $APP_DIR/
cp -r ../frontend $APP_DIR/
cp -r ../models $APP_DIR/
cp -r ../scripts $APP_DIR/
cp ../.env $APP_DIR/ 2>/dev/null || echo "Arquivo .env não encontrado, será necessário criar manualmente."
cp ../LICENSE $APP_DIR/
cp ../README.md $APP_DIR/

# Configurar permissões
echo -e "${YELLOW}Configurando permissões...${NC}"
chown -R visao_envx:visao_envx $APP_DIR
chmod -R 755 $APP_DIR

# Criar ambiente virtual Python
echo -e "${YELLOW}Criando ambiente virtual Python...${NC}"
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate

# Instalar dependências do backend
echo -e "${YELLOW}Instalando dependências do backend...${NC}"
pip install -r backend/requirements.txt

# Configurar banco de dados PostgreSQL
echo -e "${YELLOW}Configurando banco de dados PostgreSQL...${NC}"
# Verificar se o banco já existe
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw vision_saas; then
    echo -e "${YELLOW}Criando banco de dados e usuário...${NC}"
    sudo -u postgres psql -c "CREATE USER vision_user WITH PASSWORD 'Manager2025@';"
    sudo -u postgres psql -c "CREATE DATABASE vision_saas WITH OWNER = vision_user;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vision_saas TO vision_user;"
else
    echo -e "${YELLOW}Banco de dados já existe, pulando criação...${NC}"
fi

# Inicializar banco de dados
echo -e "${YELLOW}Inicializando banco de dados...${NC}"
python scripts/init_db.py

# Construir frontend
echo -e "${YELLOW}Construindo frontend...${NC}"
cd $APP_DIR/frontend
npm install
npm run build

# Configurar Nginx
echo -e "${YELLOW}Configurando Nginx...${NC}"
cat > /etc/nginx/sites-available/visao_envx << EOF
server {
    listen 80;
    server_name _;

    location / {
        root $APP_DIR/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /openapi.json {
        proxy_pass http://localhost:8000/openapi.json;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Ativar configuração do Nginx
ln -sf /etc/nginx/sites-available/visao_envx /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Configurar serviço systemd
echo -e "${YELLOW}Configurando serviço systemd...${NC}"
cat > /etc/systemd/system/visao_envx.service << EOF
[Unit]
Description=Visão EnvX - Sistema de visão computacional para monitoramento ambiental
After=network.target postgresql.service

[Service]
User=visao_envx
Group=visao_envx
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/venv/bin/python $APP_DIR/backend/app.py
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=visao_envx
Environment="PATH=$APP_DIR/venv/bin:/usr/local/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
EOF

# Recarregar systemd e iniciar serviço
systemctl daemon-reload
systemctl enable visao_envx
systemctl start visao_envx

echo -e "${GREEN}Instalação concluída!${NC}"
echo -e "${YELLOW}O sistema está disponível em: http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "${YELLOW}API disponível em: http://$(hostname -I | awk '{print $1}')/api${NC}"
echo -e "${YELLOW}Documentação da API: http://$(hostname -I | awk '{print $1}')/docs${NC}" 