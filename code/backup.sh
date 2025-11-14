
#!/bin/bash
# =========================================
# Script de Backup - Portal NewLoc
# =========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Portal NewLoc - Backup Script${NC}"
echo -e "${GREEN}=========================================${NC}"

# Configurações
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="newloc_backup_${TIMESTAMP}.sql"
CONTAINER_NAME="newloc_postgres"

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Verificar se o container está rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Erro: Container PostgreSQL não está rodando!${NC}"
    exit 1
fi

echo -e "${YELLOW}Criando backup do banco de dados...${NC}"

# Fazer backup usando pg_dump
docker exec "$CONTAINER_NAME" pg_dump -U postgres portal_newloc > "$BACKUP_DIR/$BACKUP_FILE"

# Comprimir backup
echo -e "${YELLOW}Comprimindo backup...${NC}"
gzip "$BACKUP_DIR/$BACKUP_FILE"

BACKUP_FILE_GZ="${BACKUP_FILE}.gz"
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE_GZ" | cut -f1)

echo -e "${GREEN}Backup criado com sucesso!${NC}"
echo -e "Arquivo: ${BACKUP_DIR}/${BACKUP_FILE_GZ}"
echo -e "Tamanho: ${BACKUP_SIZE}"

# Limpar backups antigos (manter últimos 7)
echo -e "${YELLOW}Limpando backups antigos...${NC}"
cd "$BACKUP_DIR"
ls -t newloc_backup_*.sql.gz | tail -n +8 | xargs -r rm

BACKUP_COUNT=$(ls -1 newloc_backup_*.sql.gz 2>/dev/null | wc -l)
echo -e "${GREEN}Total de backups mantidos: ${BACKUP_COUNT}${NC}"

echo ""
echo -e "${GREEN}Para restaurar este backup, use:${NC}"
echo "  gunzip -c $BACKUP_DIR/$BACKUP_FILE_GZ | docker exec -i $CONTAINER_NAME psql -U postgres portal_newloc"
