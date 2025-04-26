'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { companyService, locationService } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'react-toastify';

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
}

interface Company {
  id: number;
  name: string;
}

export default function LocationEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [location, setLocation] = useState<Location>({
    id: 0,
    name: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    companyId: 0,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
    if (params.id !== 'new') {
      fetchLocation();
    }
  }, [params.id]);

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error('Erro ao carregar empresas');
    }
  };

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const companies = await companyService.getAll();
      let locationData = null;
      for (const company of companies) {
        try {
          const data = await locationService.getById(company.id, parseInt(params.id));
          locationData = { ...data, companyId: company.id };
          break;
        } catch (error) {
          continue;
        }
      }
      if (locationData) {
        setLocation(locationData);
      } else {
        toast.error('Unidade não encontrada');
        router.push('/locations');
      }
    } catch (error) {
      toast.error('Erro ao carregar unidade');
      router.push('/locations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (params.id === 'new') {
        await locationService.create(location.companyId, location);
        toast.success('Unidade criada com sucesso');
      } else {
        await locationService.update(location.companyId, location.id, location);
        toast.success('Unidade atualizada com sucesso');
      }
      router.push('/locations');
    } catch (error) {
      toast.error('Erro ao salvar unidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          {params.id === 'new' ? 'Nova Unidade' : 'Editar Unidade'}
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={location.companyId}
                  onChange={(e) =>
                    setLocation({ ...location, companyId: e.target.value as number })
                  }
                  disabled={loading || params.id !== 'new'}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome"
                value={location.name}
                onChange={(e) => setLocation({ ...location, name: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="CEP"
                value={location.cep}
                onChange={(e) => setLocation({ ...location, cep: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Rua"
                value={location.street}
                onChange={(e) => setLocation({ ...location, street: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Número"
                value={location.number}
                onChange={(e) => setLocation({ ...location, number: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Bairro"
                value={location.neighborhood}
                onChange={(e) =>
                  setLocation({ ...location, neighborhood: e.target.value })
                }
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Cidade"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Estado"
                value={location.state}
                onChange={(e) => setLocation({ ...location, state: e.target.value })}
                disabled={loading}
              />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => router.push('/locations')}
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