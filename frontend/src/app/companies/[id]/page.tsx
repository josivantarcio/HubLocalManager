'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { companyService } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'react-toastify';

interface Company {
  id: number;
  name: string;
  cnpj: string;
  website?: string;
  logoUrl?: string;
}

export default function CompanyEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [company, setCompany] = useState<Company>({
    id: 0,
    name: '',
    cnpj: '',
    website: '',
    logoUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.id !== 'new') {
      fetchCompany();
    }
  }, [params.id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const data = await companyService.getById(parseInt(params.id));
      setCompany(data);
    } catch (error) {
      toast.error('Erro ao carregar empresa');
      router.push('/companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (params.id === 'new') {
        await companyService.create(company);
        toast.success('Empresa criada com sucesso');
      } else {
        await companyService.update(company.id, company);
        toast.success('Empresa atualizada com sucesso');
      }
      router.push('/companies');
    } catch (error) {
      toast.error('Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          {params.id === 'new' ? 'Nova Empresa' : 'Editar Empresa'}
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="CNPJ"
                value={company.cnpj}
                onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Website"
                value={company.website}
                onChange={(e) =>
                  setCompany({ ...company, website: e.target.value })
                }
                disabled={loading}
              />
              <TextField
                margin="normal"
                fullWidth
                label="URL do Logo"
                value={company.logoUrl}
                onChange={(e) =>
                  setCompany({ ...company, logoUrl: e.target.value })
                }
                disabled={loading}
              />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push('/companies')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
} 