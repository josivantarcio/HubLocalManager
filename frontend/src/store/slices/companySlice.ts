import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: number;
  name: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: number;
  name: string;
  cnpj: string;
  website?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  locations?: Location[];
}

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedCompany: (state, action: PayloadAction<Company>) => {
      state.selectedCompany = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
    deleteCompany: (state, action: PayloadAction<number>) => {
      state.companies = state.companies.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setCompanies,
  setSelectedCompany,
  setLoading,
  setError,
  addCompany,
  updateCompany,
  deleteCompany,
} = companySlice.actions;

export default companySlice.reducer; 