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

export default function Companies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await companyService.delete(id);
        toast.success('Empresa excluída com sucesso');
        fetchCompanies();
      } catch (error) {
        toast.error('Erro ao excluir empresa');
      }
    }
  };

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Empresas</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/companies/new')}
          >
            Nova Empresa
          </Button>
        </Box>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>CNPJ</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.cnpj}</TableCell>
                      <TableCell>{company.website || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => router.push(`/companies/${company.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(company.id)}>
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