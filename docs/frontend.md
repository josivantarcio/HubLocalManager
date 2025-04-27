# Documentação do Frontend

## Visão Geral

O frontend do HubLocal Manager é construído com Next.js, React e Material-UI, oferecendo uma interface moderna e responsiva para gerenciamento de empresas e localizações. O sistema está configurado para rodar localmente em desenvolvimento e no Netlify em produção.

## Configuração de Portas

- **Desenvolvimento Local**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:3001`

- **Produção (Netlify)**:
  - Frontend: `https://hublocal-manager.netlify.app`
  - Backend: `https://hublocal-backend.onrender.com`

## Infraestrutura Netlify

O frontend está configurado para ser implantado no Netlify usando os seguintes recursos:

- **Deploy Automático**: Integração com GitHub
- **Preview Deployments**: Para cada pull request
- **Environment Variables**: Para configuração
- **Cache e CDN**: Para performance
- **Forms e Functions**: Para funcionalidades serverless

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

interface AuthContextData {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoragedData = () => {
      const storagedUser = localStorage.getItem('user');
      const storagedToken = localStorage.getItem('token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    };

    loadStoragedData();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    const { user, access_token } = response;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', access_token);

    setUser(user);
  };

  const signUp = async (userData: any) => {
    const response = await register(userData);
    const { user, access_token } = response;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', access_token);

    setUser(user);
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Deploy

O deploy é feito automaticamente no Netlify através do arquivo `netlify.toml`. Para configurar:

1. Crie uma conta no [Netlify](https://netlify.com)
2. Conecte seu repositório GitHub
3. O Netlify usará o `netlify.toml` para configurar:
   - Build command
   - Publish directory
   - Environment variables

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=https://hublocal-backend.onrender.com
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 