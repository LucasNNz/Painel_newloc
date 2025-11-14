
#!/bin/bash
# =========================================
# Script de Deploy - Portal NewLoc
# =========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Portal NewLoc - Deploy Script${NC}"
echo -e "${GREEN}=========================================${NC}"

if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Erro: docker-compose.yml não encontrado!${NC}"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Aviso: Arquivo .env não encontrado!${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}Arquivo .env criado. EDITE-O antes de continuar!${NC}"
        exit 1
    fi
fi

confirm() {
    read -r -p "${1} [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            true
            ;;
        *)
            false
            ;;
    esac
}

echo ""
echo "Escolha uma opção:"
echo "1) Deploy inicial (primeira vez)"
echo "2) Atualizar aplicação (rebuild)"
echo "3) Restart dos serviços"
echo "4) Ver logs"
echo "5) Parar todos os serviços"
echo "6) Limpar tudo e reinstalar"
echo ""
read -r -p "Opção: " option

case $option in
    1)
        echo -e "${GREEN}Iniciando deploy inicial...${NC}"
        docker compose down
        echo -e "${YELLOW}Building Docker images...${NC}"
        docker compose build --no-cache
        echo -e "${YELLOW}Starting services...${NC}"
        docker compose up -d
        echo -e "${YELLOW}Aguardando PostgreSQL...${NC}"
        sleep 10
        echo -e "${YELLOW}Running database migrations...${NC}"
        docker compose exec web npx prisma migrate deploy
        if confirm "Deseja popular o banco com dados iniciais?"; then
            docker compose exec web npx prisma db seed
        fi
        echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
        echo -e "${GREEN}Acesse: http://localhost:3000${NC}"
        ;;
    2)
        echo -e "${GREEN}Atualizando aplicação...${NC}"
        if confirm "Isso irá rebuildar a aplicação. Continuar?"; then
            echo -e "${YELLOW}Criando backup do banco...${NC}"
            ./backup.sh
            docker compose up -d --build
            echo -e "${YELLOW}Running migrations...${NC}"
            docker compose exec web npx prisma migrate deploy
            echo -e "${GREEN}Atualização concluída!${NC}"
        fi
        ;;
    3)
        echo -e "${GREEN}Reiniciando serviços...${NC}"
        docker compose restart
        echo -e "${GREEN}Serviços reiniciados!${NC}"
        ;;
    4)
        echo -e "${GREEN}Logs dos serviços:${NC}"
        docker compose logs -f
        ;;
    5)
        if confirm "Deseja parar todos os serviços?"; then
            docker compose down
            echo -e "${GREEN}Serviços parados!${NC}"
        fi
        ;;
    6)
        if confirm "ATENÇÃO: Isso irá DELETAR TODOS OS DADOS! Continuar?"; then
            echo -e "${YELLOW}Criando backup final...${NC}"
            ./backup.sh
            docker compose down -v
            docker system prune -af
            echo -e "${GREEN}Tudo limpo! Execute opção 1 para reinstalar.${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        exit 1
        ;;
esac
