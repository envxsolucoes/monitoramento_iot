#!/usr/bin/env python
"""
Script para inicializar o banco de dados PostgreSQL para o projeto Visão EnvX.
Este script cria as tabelas necessárias e configura o banco de dados.
"""

import os
import sys
import logging

# Adicionar o diretório pai ao path para importar os módulos do backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import init_db

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("init_db")

def main():
    """Função principal para inicializar o banco de dados."""
    try:
        logger.info("Inicializando banco de dados...")
        init_db()
        logger.info("Banco de dados inicializado com sucesso!")
    except Exception as e:
        logger.error(f"Erro ao inicializar banco de dados: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 