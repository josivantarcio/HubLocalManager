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
- AWS (RDS, ECS, S3)

### Frontend
- Next.js
- React
- Material-UI
- Tailwind CSS
- Axios para requisições HTTP
- React Query para gerenciamento de estado
- AWS (Amplify, CloudFront)

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

## Instalação

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
cd ../frontend
npm run dev
```

## Uso

### Backend
- A API estará disponível em `http://localhost:3001`
- A documentação Swagger estará disponível em `http://localhost:3001/api`

### Frontend
- A aplicação estará disponível em `http://localhost:3000`

### Produção (AWS)
- Frontend: `https://hublocal-manager.vercel.app`
- Backend: `https://api.hublocal-manager.com`
- Banco de Dados: AWS RDS PostgreSQL

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

### Empresas
- `POST /companies` - Criar nova empresa
- `GET /companies` - Listar empresas
- `GET /companies/:id` - Obter empresa específica
- `PATCH /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Remover empresa

### Localizações
- `POST /locations` - Criar nova localização
- `GET /locations` - Listar localizações
- `GET /locations/:id` - Obter localização específica
- `PATCH /locations/:id` - Atualizar localização
- `DELETE /locations/:id` - Remover localização

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 