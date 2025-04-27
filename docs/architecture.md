# Arquitetura do HubLocal Manager

## Visão Geral da Arquitetura

O HubLocal Manager é uma aplicação web moderna construída com uma arquitetura de microserviços, utilizando NestJS para o backend e Next.js para o frontend. A arquitetura foi projetada para ser escalável, segura e fácil de manter.

## Diagrama de Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │     │    Backend      │     │   PostgreSQL    │
│   (Next.js)     │◄───►│   (NestJS)      │◄───►│   Database      │
│   Netlify       │     │   Render.com    │     │   Render.com    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Componentes Principais

### Frontend (Next.js)

O frontend é construído com Next.js, oferecendo:
- Renderização do lado do servidor (SSR)
- Roteamento dinâmico
- Otimização de imagens
- Geração estática de páginas

#### Estrutura de Diretórios
```
frontend/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   ├── hooks/          # Hooks personalizados
│   ├── contexts/       # Contextos React
│   ├── utils/          # Funções utilitárias
│   └── styles/         # Estilos globais
```

### Backend (NestJS)

O backend é construído com NestJS, seguindo os princípios:
- Arquitetura modular
- Injeção de dependência
- Programação orientada a objetos
- Programação funcional

#### Estrutura de Diretórios
```
backend/
├── src/
│   ├── auth/           # Autenticação e autorização
│   ├── companies/      # Gerenciamento de empresas
│   ├── locations/      # Gerenciamento de localizações
│   ├── users/          # Gerenciamento de usuários
│   ├── common/         # Utilitários comuns
│   └── main.ts         # Ponto de entrada
├── Dockerfile          # Configuração do Docker
└── .env.production     # Variáveis de ambiente para produção
```

## Containerização

O projeto utiliza Docker para containerização, com um Dockerfile multi-stage otimizado:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install NestJS CLI and update npm
RUN npm install -g npm@latest && \
    npm install -g @nestjs/cli

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the application
CMD ["node", "dist/main"]
```

## Padrões de Design

### Backend

1. **Repository Pattern**
   - Separação entre lógica de negócios e acesso a dados
   - Facilita a manutenção e testes

2. **Service Layer**
   - Lógica de negócios centralizada
   - Reutilização de código
   - Facilita a manutenção

3. **DTOs (Data Transfer Objects)**
   - Validação de dados
   - Segurança
   - Documentação

4. **Interceptors**
   - Transformação de dados
   - Logging
   - Tratamento de erros

### Frontend

1. **Component-Based Architecture**
   - Componentes reutilizáveis
   - Separação de responsabilidades
   - Facilita a manutenção

2. **Custom Hooks**
   - Lógica reutilizável
   - Separação de responsabilidades
   - Facilita os testes

3. **Context API**
   - Gerenciamento de estado global
   - Compartilhamento de dados entre componentes

## Deploy

### Backend (Render.com)

O backend é implantado no Render.com usando Docker, com as seguintes configurações:

- **Web Service**: Container Docker
- **PostgreSQL**: Banco de dados gerenciado
- **Environment Variables**: Configuração dinâmica
- **Health Checks**: Monitoramento de saúde
- **Auto-scaling**: Escalabilidade automática

### Frontend (Netlify)

O frontend é implantado no Netlify, com as seguintes configurações:

- **Deploy Automático**: Integração com GitHub
- **Preview Deployments**: Para cada pull request
- **Environment Variables**: Configuração dinâmica
- **Cache e CDN**: Otimização de performance

## Segurança

1. **Autenticação**
   - JWT para autenticação
   - Tokens de acesso e refresh
   - Proteção de rotas

2. **Autorização**
   - Controle de acesso baseado em roles
   - Guards para proteção de endpoints
   - Validação de permissões

3. **CORS**
   - Configuração de origens permitidas
   - Proteção contra CSRF
   - Headers de segurança

4. **Banco de Dados**
   - Conexão SSL
   - Migrações seguras
   - Backup automático

## Monitoramento

1. **Health Checks**
   - Endpoint `/api/health`
   - Monitoramento de dependências
   - Alertas automáticos

2. **Logging**
   - Logs estruturados
   - Níveis de log configuráveis
   - Rotação de logs

3. **Métricas**
   - Performance da aplicação
   - Uso de recursos
   - Tempo de resposta

## Escalabilidade

### Horizontal
- Balanceamento de carga
- Replicação de banco de dados
- Cache

### Vertical
- Otimização de queries
- Índices
- Particionamento

## Banco de Dados

### PostgreSQL
- Relacional
- Suporte a JSON
- Transações ACID
- Índices e otimizações

### Migrações
- Versionamento do esquema
- Rollback de alterações
- Controle de versão

## API REST

### Padrões
- RESTful
- Versionamento
- Documentação com Swagger
- Paginação
- Filtros
- Ordenação

### Endpoints
- Autenticação
- Empresas
- Localizações
- Usuários

## DevOps

### Docker
- Containerização
- Ambiente consistente
- Facilidade de deploy

### CI/CD
- Integração contínua
- Deploy contínuo
- Testes automatizados

## Monitoramento

### Logs
- Estruturação
- Níveis
- Rotação

### Métricas
- Performance
- Uso de recursos
- Alertas

## Deploy

### Backend (Render.com)
- Container Docker
- Banco de dados PostgreSQL
- Variáveis de ambiente
- Health checks
- Auto-scaling

### Frontend (Netlify)
- Deploy automático
- Preview deployments
- Variáveis de ambiente
- Cache e CDN 