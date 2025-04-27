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

8. Em outro terminal, inicie o frontend:
```bash
cd ../frontend
npm run dev
```

## API Documentation

### Companies Endpoints

#### GET /companies
Retorna a lista de empresas do usuário autenticado.

**Response:**
```json
{
  "companies": [
    {
      "id": 1,
      "name": "Company Name",
      "cnpj": "12345678901234",
      "website": "https://example.com",
      "locationsCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST /companies
Cria uma nova empresa.

**Request Body:**
```json
{
  "name": "Company Name",
  "cnpj": "12345678901234",
  "website": "https://example.com"
}
```

#### GET /companies/:id
Retorna uma empresa específica.

#### PATCH /companies/:id
Atualiza uma empresa existente.

**Request Body:**
```json
{
  "name": "Updated Company Name",
  "website": "https://updated-example.com"
}
```

#### DELETE /companies/:id
Remove uma empresa.

## Deploy

### Backend (Render.com)
1. Crie uma nova aplicação Web Service no Render.com
2. Conecte ao repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático será iniciado

### Frontend (Netlify)
1. Crie um novo site no Netlify
2. Conecte ao repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático será iniciado

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 