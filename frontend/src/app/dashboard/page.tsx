'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CompanyCard } from '@/components/companies/CompanyCard';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Company {
  id: number;
  name: string;
  cnpj: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mock data - replace with API calls
  useEffect(() => {
    setCompanies([
      { id: 1, name: 'Empresa A', cnpj: '12.345.678/0001-90' },
      { id: 2, name: 'Empresa B', cnpj: '98.765.432/0001-10' },
    ]);

    setLocations([
      { id: 1, name: 'Filial Centro', address: 'Rua Principal, 123' },
      { id: 2, name: 'Filial Norte', address: 'Av. Secundária, 456' },
    ]);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <BusinessIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">{companies.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Empresas
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <LocationIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">{locations.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Filiais
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">25</Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuários
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Companies List */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Empresas</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/companies/new')}
                  >
                    Nova Empresa
                  </Button>
                </Box>
                <List>
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Locations List */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Filiais</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/locations/new')}
                  >
                    Nova Filial
                  </Button>
                </Box>
                <List>
                  {locations.map((location) => (
                    <div key={location.id}>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={location.name}
                          secondary={location.address}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}