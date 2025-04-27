# HubLocal Manager

Sistema de gerenciamento de empresas e localizações desenvolvido com NestJS (backend) e Next.js (frontend).

## Visão Geral

O HubLocal Manager é uma aplicação web que permite o gerenciamento de empresas e suas localizações. O sistema oferece funcionalidades de cadastro, consulta, atualização e remoção (CRUD) de empresas e localizações, com autenticação de usuários e controle de acesso.

## Tecnologias Utilizadas

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT para autenticação
- Swagger para documentação da API
- Docker e Docker Compose
- Render.com para deploy
- Node.js 20+

### Frontend
- Next.js
- React
- Material-UI
- Tailwind CSS
- Axios para requisições HTTP
- React Query para gerenciamento de estado
- Netlify para deploy

## Estrutura do Projeto

```
HubLocalManager/
├── backend/                 # Aplicação NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── companies/      # Módulo de empresas
│   │   ├── locations/      # Módulo de localizações
│   │   ├── users/          # Módulo de usuários
│   │   ├── common/         # Utilitários e filtros comuns
│   │   └── main.ts         # Ponto de entrada da aplicação
│   ├── docker-compose.yml  # Configuração do Docker Compose
│   ├── Dockerfile          # Configuração do Docker
│   └── .env.production     # Variáveis de ambiente para produção
│
└── frontend/               # Aplicação Next.js
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/          # Páginas da aplicação
    │   ├── services/       # Serviços de API
    │   └── styles/         # Estilos globais
    └── public/             # Arquivos estáticos
```

## Requisitos

- Node.js (v20 ou superior)
- Docker e Docker Compose
- PostgreSQL
- Conta no Render.com (para backend)
- Conta no Netlify (para frontend)

## Instalação e Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/josivantarcio/HubLocalManager
cd HubLocalManager
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env` no diretório backend
   - Copie `.env.example` para `.env` no diretório frontend
   - Ajuste as variáveis conforme necessário

5. Inicie os containers Docker:
```bash
cd ..
docker-compose up -d
```

6. Execute as migrações do banco de dados:
```bash
cd backend
npm run migration:run
```

7. Inicie o backend:
```bash
npm run start:dev
```

8. Inicie o frontend:
```bash
cd ../frontend
npm run dev
```

## Deploy

### Backend (Render.com)

1. Crie um novo Web Service no Render.com
2. Selecione "Docker" como ambiente
3. Configure as variáveis de ambiente:
   ```
   DB_HOST=<host do banco>
   DB_PORT=5432
   DB_USERNAME=<usuário>
   DB_PASSWORD=<senha>
   DB_NAME=<nome do banco>
   JWT_SECRET=<uma string segura>
   CORS_ORIGIN=https://seu-frontend.netlify.app
   ```
4. Configure o Health Check Path como `/api/health`

### Frontend (Netlify)

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
   ```
3. Configure o build command:
   ```
   npm run build
   ```
4. Configure o publish directory:
   ```
   .next
   ```

## Documentação

A documentação detalhada está disponível na pasta `docs/`:

- [Documentação do Backend](docs/backend.md)
- [Documentação do Frontend](docs/frontend.md)
- [Documentação da API](docs/api.md)
- [Arquitetura do Sistema](docs/architecture.md)

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 