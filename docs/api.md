# Documentação da API

## 📋 Visão Geral

A API do HubLocal Manager é uma API RESTful que permite o gerenciamento de empresas e filiais. Todas as requisições devem incluir o token JWT no header `Authorization`.

## 🔐 Autenticação

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## 🏢 Empresas

### Listar Empresas
```http
GET /api/companies
Authorization: Bearer <token>
```

### Criar Empresa
```http
POST /api/companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nome da Empresa",
  "cnpj": "12345678901234",
  "website": "https://exemplo.com"
}
```

### Detalhes da Empresa
```http
GET /api/companies/:id
Authorization: Bearer <token>
```

### Atualizar Empresa
```http
PATCH /api/companies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "website": "https://novo-exemplo.com"
}
```

### Remover Empresa
```http
DELETE /api/companies/:id
Authorization: Bearer <token>
```

## 📍 Filiais

### Listar Filiais
```http
GET /api/locations
Authorization: Bearer <token>
```

### Criar Filial
```http
POST /api/locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nome da Filial",
  "cep": "12345678",
  "street": "Rua Exemplo",
  "number": "123",
  "neighborhood": "Bairro",
  "city": "Cidade",
  "state": "Estado",
  "companyId": 1
}
```

### Detalhes da Filial
```http
GET /api/locations/:id
Authorization: Bearer <token>
```

### Atualizar Filial
```http
PATCH /api/locations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "number": "456"
}
```

### Remover Filial
```http
DELETE /api/locations/:id
Authorization: Bearer <token>
```

## ⚠️ Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/companies",
  "error": "Bad Request",
  "message": "Mensagem do erro"
}
```

### Códigos de Erro Comuns

- 400: Requisição inválida
- 401: Não autorizado
- 403: Acesso negado
- 404: Recurso não encontrado
- 500: Erro interno do servidor

## 🔄 Paginação

Endpoints que retornam listas suportam paginação:

```http
GET /api/companies?page=1&limit=10
```

## 📊 Respostas

Todas as respostas seguem o formato:

```json
{
  "data": {}, // Dados da resposta
  "message": "Sucesso",
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Documentação Interativa

Acesse a documentação interativa da API em:
```
https://hublocal-backend.onrender.com/api/docs
``` 