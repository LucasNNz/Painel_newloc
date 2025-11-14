
# =========================================
# Stage 1: Dependências
# =========================================
FROM node:20-alpine AS deps

# Instalar dependências necessárias para compilação
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY nextjs_space/package.json nextjs_space/yarn.lock* nextjs_space/.yarnrc.yml ./
COPY nextjs_space/.yarn ./.yarn

# Instalar dependências
RUN yarn install --frozen-lockfile

# =========================================
# Stage 2: Builder
# =========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY nextjs_space/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Variáveis de ambiente necessárias para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build da aplicação Next.js
RUN yarn build

# =========================================
# Stage 3: Runner (Produção)
# =========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar apenas dependências de runtime
RUN apk add --no-cache openssl curl

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copiar Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Dar permissões ao usuário nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expor porta 3000
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
