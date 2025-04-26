'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
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
  company: {
    id: number;
    name: string;
  };
}

export default function Locations() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const companies = await companyService.getAll();
      const locations = await Promise.all(
        companies.map((company: any) => locationService.getAll(company.id))
      );
      setLocations(locations.flat());
    } catch (error) {
      toast.error('Erro ao carregar unidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId: number, id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        await locationService.delete(companyId, id);
        toast.success('Unidade excluída com sucesso');
        fetchLocations();
      } catch (error) {
        toast.error('Erro ao excluir unidade');
      }
    }
  };

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Unidades</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/locations/new')}
          >
            Nova Unidade
          </Button>
        </Box>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Endereço</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{location.company.name}</TableCell>
                      <TableCell>
                        {location.street}, {location.number} - {location.neighborhood},{' '}
                        {location.city} - {location.state}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => router.push(`/locations/${location.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDelete(location.company.id, location.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
} 