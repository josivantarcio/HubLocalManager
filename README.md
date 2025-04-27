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
│   └── Dockerfile          # Configuração do Docker
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

- Node.js (v16 ou superior)
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

8. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

## Deploy

### Backend (Render.com)

1. Crie uma conta no [Render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Selecione o repositório e branch
4. O Render.com usará o `render.yaml` para configurar automaticamente
5. Configure manualmente a variável `JWT_SECRET`

### Frontend (Netlify)

1. Crie uma conta no [Netlify](https://netlify.com)
2. Conecte seu repositório GitHub
3. Selecione o repositório e branch
4. O Netlify usará o `netlify.toml` para configurar automaticamente
5. Configure a variável `NEXT_PUBLIC_API_URL` com a URL do backend após o deploy

## Variáveis de Ambiente

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hublocal
DB_SYNCHRONIZE=false
DB_SSL=false
NODE_ENV=development
JWT_SECRET=seu_secret_aqui
JWT_EXPIRATION=1d
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Documentação da API

A documentação completa da API está disponível em `/api/docs` após iniciar o backend.

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login

#### Empresas
- `GET /companies` - Listar todas as empresas
- `GET /companies/:id` - Visualizar detalhes de uma empresa
- `POST /companies` - Criar nova empresa
- `PUT /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Deletar empresa

#### Localizações
- `GET /locations` - Listar todas as localizações
- `GET /locations/:id` - Visualizar detalhes de uma localização
- `POST /locations` - Criar nova localização
- `PUT /locations/:id` - Atualizar localização
- `DELETE /locations/:id` - Deletar localização

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 