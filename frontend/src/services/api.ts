import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

export const companyService = {
  getAll: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  create: async (data: {
    name: string;
    cnpj: string;
    website?: string;
    logoUrl?: string;
  }) => {
    const response = await api.post('/companies', data);
    return response.data;
  },
  update: async (id: number, data: {
    name?: string;
    cnpj?: string;
    website?: string;
    logoUrl?: string;
  }) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/companies/${id}`);
  },
};

export const locationService = {
  getAll: async (companyId: number) => {
    const response = await api.get(`/companies/${companyId}/locations`);
    return response.data;
  },
  getById: async (companyId: number, id: number) => {
    const response = await api.get(`/companies/${companyId}/locations/${id}`);
    return response.data;
  },
  create: async (companyId: number, data: {
    name: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => {
    const response = await api.post(`/companies/${companyId}/locations`, data);
    return response.data;
  },
  update: async (companyId: number, id: number, data: {
    name?: string;
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  }) => {
    const response = await api.put(`/companies/${companyId}/locations/${id}`, data);
    return response.data;
  },
  delete: async (companyId: number, id: number) => {
    await api.delete(`/companies/${companyId}/locations/${id}`);
  },
};

export default api; 