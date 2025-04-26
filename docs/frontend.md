# Documentação do Frontend

## Visão Geral

O frontend do HubLocal Manager é construído com Next.js, React e Material-UI, oferecendo uma interface moderna e responsiva para gerenciamento de empresas e localizações. O sistema está configurado para rodar localmente em desenvolvimento e na AWS em produção.

## Configuração de Portas

- **Desenvolvimento Local**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:3001`

- **Produção (AWS)**:
  - Frontend: `https://hublocal-manager.vercel.app`
  - Backend: `https://api.hublocal-manager.com`

## Infraestrutura AWS

O frontend está configurado para ser implantado na AWS usando os seguintes serviços:

- **Amplify**: Para hospedagem e CI/CD
- **CloudFront**: Para distribuição de conteúdo
- **S3**: Para armazenamento de arquivos estáticos
- **Route 53**: Para gerenciamento de DNS
- **CloudWatch**: Para monitoramento e logs

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── layout/        # Componentes de layout
│   │   ├── forms/         # Componentes de formulário
│   │   ├── tables/        # Componentes de tabela
│   │   └── common/        # Componentes comuns
│   ├── pages/             # Páginas da aplicação
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── companies/     # Páginas de empresas
│   │   └── locations/     # Páginas de localizações
│   ├── services/          # Serviços de API
│   │   ├── api.ts         # Configuração do Axios
│   │   └── authService.ts # Serviço de autenticação
│   ├── hooks/             # Hooks personalizados
│   ├── contexts/          # Contextos React
│   ├── utils/             # Funções utilitárias
│   └── styles/            # Estilos globais
└── public/                # Arquivos estáticos
```

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor
- **React**: Biblioteca para construção de interfaces
- **Material-UI**: Biblioteca de componentes UI
- **Tailwind CSS**: Framework CSS utilitário
- **Axios**: Cliente HTTP
- **React Query**: Gerenciamento de estado e cache
- **React Hook Form**: Gerenciamento de formulários
- **Yup**: Validação de formulários

## Componentes Principais

### Layout

- **Header**: Cabeçalho da aplicação com menu de navegação
- **Sidebar**: Menu lateral com links para diferentes seções
- **Footer**: Rodapé da aplicação
- **Container**: Container principal para conteúdo

### Formulários

- **CompanyForm**: Formulário para criação/edição de empresas
- **LocationForm**: Formulário para criação/edição de localizações
- **LoginForm**: Formulário de login
- **RegisterForm**: Formulário de registro

### Tabelas

- **CompanyTable**: Tabela de empresas com paginação
- **LocationTable**: Tabela de localizações com paginação

## Páginas

### Autenticação

- **Login**: Página de login
- **Register**: Página de registro

### Empresas

- **Companies**: Lista de empresas
- **CompanyDetails**: Detalhes da empresa
- **CompanyForm**: Formulário de empresa

### Localizações

- **Locations**: Lista de localizações
- **LocationDetails**: Detalhes da localização
- **LocationForm**: Formulário de localização

## Serviços

### API

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Autenticação

```typescript
// src/services/authService.ts
import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: RegisterData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

## Hooks Personalizados

### useAuth

```typescript
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### useCompanies

```typescript
// src/hooks/useCompanies.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useCompanies = (page = 1, limit = 10) => {
  return useQuery(['companies', page, limit], async () => {
    const response = await api.get(`/companies?page=${page}&limit=${limit}`);
    return response.data;
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (companyData) => api.post('/companies', companyData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('companies');
      },
    }
  );
};
```

## Contextos

### AuthContext

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout } from '../services/authService';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email, password) => {
    const response = await login(email, password);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData) => {
    const response = await register(userData);
    return response;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## Estilos

### Tailwind CSS

O projeto utiliza Tailwind CSS para estilização. A configuração está em `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#dc004e',
      },
    },
  },
  plugins: [],
};
```

### Estilos Globais

Os estilos globais estão em `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

## Rotas

O Next.js utiliza um sistema de roteamento baseado em arquivos. As rotas são definidas pela estrutura de diretórios em `src/pages`:

- `/` → `pages/index.tsx`
- `/auth/login` → `pages/auth/login.tsx`
- `/auth/register` → `pages/auth/register.tsx`
- `/companies` → `pages/companies/index.tsx`
- `/companies/[id]` → `pages/companies/[id].tsx`
- `/locations` → `pages/locations/index.tsx`
- `/locations/[id]` → `pages/locations/[id].tsx`

## Proteção de Rotas

As rotas protegidas são verificadas usando um componente `PrivateRoute`:

```typescript
// src/components/PrivateRoute.tsx
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return children;
};
```

## Deploy

O frontend pode ser deployado em qualquer serviço que suporte Next.js, como:

- Vercel
- Netlify
- AWS Amplify
- Heroku

Para fazer o deploy:

1. Construa a aplicação:
```bash
npm run build
```

2. Inicie a aplicação em produção:
```bash
npm start
```

## Variáveis de Ambiente

As variáveis de ambiente são definidas em `.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testes

O projeto utiliza Jest e React Testing Library para testes:

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage
``` 