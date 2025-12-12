# Dockerfile para o backend NestJS
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY src ./src

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas arquivos necessários
COPY package*.json ./
RUN npm ci --only=production

# Copia build do estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe porta
EXPOSE 3000

# Comando de start
CMD ["node", "dist/main.js"]

