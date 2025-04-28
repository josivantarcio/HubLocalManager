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

## 🌐 Deploy

O projeto está configurado para deploy no Render.com:

1. Backend: `https://hublocal-backend.onrender.com`
2. Frontend: `https://hublocal-frontend.onrender.com`
3. Documentação da API: `https://hublocal-backend.onrender.com/api/docs`

### Configuração do Deploy

1. **Backend (Render.com)**:
   - Crie um novo Web Service
   - Conecte com seu repositório GitHub
   - O Render vai detectar o render.yaml automaticamente
   - Configure as variáveis de ambiente:
     - DB_HOST
     - DB_PORT
     - DB_USERNAME
     - DB_PASSWORD
     - DB_NAME
     - JWT_SECRET
     - CORS_ORIGIN (URL do frontend)

2. **Frontend (Render.com)**:
   - Crie um novo Web Service
   - Conecte com seu repositório GitHub
   - Configure as variáveis de ambiente:
     - NEXT_PUBLIC_API_URL (URL do backend)
     - NODE_ENV=production

## 📚 Documentação

- [Arquitetura](docs/architecture.md)
- [Backend](docs/backend.md)
- [Frontend](docs/frontend.md)
- [API](docs/api.md)

## 🐛 Debugging

### Logs
- Backend: Logs disponíveis no painel do Render.com
- Frontend: Console do navegador

### Erros Comuns
1. Problemas de conexão com o banco:
   - Verifique as credenciais no painel do Render.com
   - Confirme se o banco está rodando

2. Problemas de CORS:
   - Verifique `CORS_ORIGIN` no painel do Render.com
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