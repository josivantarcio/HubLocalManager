# HubLocal Manager

Sistema de gerenciamento de empresas e filiais desenvolvido com NestJS (backend) e Next.js (frontend).

## 🚀 Funcionalidades

- Autenticação de usuários
- Gerenciamento de empresas
- Gerenciamento de filiais
- Interface moderna e responsiva
- API RESTful documentada
- Tratamento de erros robusto
- Logs estruturados

## 🛠️ Tecnologias

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI
- Winston Logger

### Frontend
- Next.js
- Material-UI
- Redux Toolkit
- Axios
- React Hook Form

## 📋 Pré-requisitos

- Node.js >= 20
- PostgreSQL >= 14
- Docker (opcional)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/josivantarcio/HubLocalManager
cd hublocal-manager
```

2. Instale as dependências:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Backend
cp backend/.env.example backend/.env
# Edite o arquivo .env com suas configurações

# Frontend
cp frontend/.env.example frontend/.env
# Edite o arquivo .env com suas configurações
```

4. Inicie o banco de dados:
```bash
# Usando Docker
docker-compose up -d

# Ou configure um banco PostgreSQL local
```

5. Execute as migrações:
```bash
cd backend
npm run migration:run
```

6. Inicie os serviços:
```bash
# Backend
cd backend
npm run start:dev

# Frontend (em outro terminal)
cd frontend
npm run dev
```

## 📚 Documentação

- [Arquitetura](docs/architecture.md)
- [Backend](docs/backend.md)
- [Frontend](docs/frontend.md)
- [API](docs/api.md)

## 🌐 Deploy

O projeto está configurado para deploy no Render.com:

1. Backend: `https://hublocal-backend.onrender.com`
2. Frontend: `https://hublocal-frontend.onrender.com`
3. Documentação da API: `https://hublocal-backend.onrender.com/api/docs`

## 🐛 Debugging

### Logs
- Backend: `logs/` (arquivos rotativos)
- Frontend: Console do navegador (em desenvolvimento)

### Erros Comuns
1. Problemas de conexão com o banco:
   - Verifique as credenciais no `.env`
   - Confirme se o banco está rodando

2. Erros de migração:
   - Execute `npm run migration:run`
   - Verifique os logs em `logs/error-*.log`

3. Problemas de CORS:
   - Verifique `CORS_ORIGIN` no `.env`
   - Confirme se as URLs estão corretas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Em caso de problemas, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento. 