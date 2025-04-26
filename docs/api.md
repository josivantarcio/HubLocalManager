# Documentação da API

## Visão Geral

A API do HubLocal Manager é uma API RESTful que utiliza JSON para comunicação. Todos os endpoints requerem autenticação via JWT, exceto os endpoints de autenticação.

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
  "number": "456"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Nova Matriz",
  "cep": "12345678",
  "street": "Rua Exemplo",
  "number": "456",
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

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Requisição inválida |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Não autorizado |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 500 | Internal Server Error - Erro interno do servidor |

## Headers

### Autenticação
```
Authorization: Bearer <token>
```

### Content-Type
```
Content-Type: application/json
```

## Paginação

Todos os endpoints de listagem suportam paginação através dos parâmetros de query:
- `page`: Número da página (começando em 1)
- `limit`: Número de itens por página

A resposta inclui:
- `data`: Array com os itens da página atual
- `total`: Número total de itens 