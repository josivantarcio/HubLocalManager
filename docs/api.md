# Documentação da API

## Visão Geral

A API do HubLocal Manager é uma API RESTful que utiliza JSON para comunicação. Todos os endpoints requerem autenticação via JWT, exceto os endpoints de autenticação.

## Base URL

- **Desenvolvimento**: `http://localhost:3001`
- **Produção**: `https://hublocal-backend.onrender.com`

## Autenticação

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Registro

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

## Empresas

### Listar Empresas

```http
GET /companies
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Empresa Exemplo",
      "cnpj": "12345678000190",
      "website": "https://exemplo.com",
      "logoUrl": "https://exemplo.com/logo.png",
      "createdAt": "2025-04-26T00:00:00.000Z",
      "updatedAt": "2025-04-26T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Obter Empresa

```http
GET /companies/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Empresa Exemplo",
  "cnpj": "12345678000190",
  "website": "https://exemplo.com",
  "logoUrl": "https://exemplo.com/logo.png",
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Criar Empresa

```http
POST /companies
```

**Request Body:**
```json
{
  "name": "Empresa Exemplo",
  "cnpj": "12345678000190",
  "website": "https://exemplo.com",
  "logoUrl": "https://exemplo.com/logo.png"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Empresa Exemplo",
  "cnpj": "12345678000190",
  "website": "https://exemplo.com",
  "logoUrl": "https://exemplo.com/logo.png",
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Atualizar Empresa

```http
PATCH /companies/:id
```

**Request Body:**
```json
{
  "name": "Nova Empresa",
  "website": "https://novo-exemplo.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Nova Empresa",
  "cnpj": "12345678000190",
  "website": "https://novo-exemplo.com",
  "logoUrl": "https://exemplo.com/logo.png",
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Remover Empresa

```http
DELETE /companies/:id
```

**Response:**
```json
{
  "message": "Empresa removida com sucesso"
}
```

## Localizações

### Listar Localizações

```http
GET /locations
```

**Query Parameters:**
- `companyId` (obrigatório): ID da empresa
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Matriz",
      "cep": "12345678",
      "street": "Rua Exemplo",
      "number": "123",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "companyId": 1,
      "createdAt": "2025-04-26T00:00:00.000Z",
      "updatedAt": "2025-04-26T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Obter Localização

```http
GET /locations/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Matriz",
  "cep": "12345678",
  "street": "Rua Exemplo",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "companyId": 1,
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Criar Localização

```http
POST /locations
```

**Request Body:**
```json
{
  "name": "Matriz",
  "cep": "12345678",
  "street": "Rua Exemplo",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "companyId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Matriz",
  "cep": "12345678",
  "street": "Rua Exemplo",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "companyId": 1,
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Atualizar Localização

```http
PATCH /locations/:id
```

**Request Body:**
```json
{
  "name": "Nova Matriz",
  "street": "Nova Rua"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Nova Matriz",
  "cep": "12345678",
  "street": "Nova Rua",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "companyId": 1,
  "createdAt": "2025-04-26T00:00:00.000Z",
  "updatedAt": "2025-04-26T00:00:00.000Z"
}
```

### Remover Localização

```http
DELETE /locations/:id
```

**Response:**
```json
{
  "message": "Localização removida com sucesso"
}
```

## Erros

A API retorna erros no seguinte formato:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "error": "Bad Request"
}
```

### Códigos de Status

- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Documentação Swagger

A documentação completa da API está disponível em `/api/docs` quando a aplicação está rodando. 