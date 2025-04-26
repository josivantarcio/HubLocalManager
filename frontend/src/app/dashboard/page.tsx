'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { companyService, locationService } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { styled } from '@mui/material/styles';

interface DashboardStats {
  totalCompanies: number;
  totalLocations: number;
  recentCompanies: any[];
  recentLocations: any[];
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalLocations: 0,
    recentCompanies: [],
    recentLocations: [],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const companies = await companyService.getAll();
        const locations = await Promise.all(
          companies.map((company: any) => locationService.getAll(company.id))
        );

        setStats({
          totalCompanies: companies.length,
          totalLocations: locations.reduce((acc, curr) => acc + curr.length, 0),
          recentCompanies: companies.slice(0, 5),
          recentLocations: locations.flat().slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid component={Paper} item xs={12} md={6} lg={4}>
            <Item>
              <Typography variant="h6">Total de Empresas</Typography>
              <Typography variant="h4">{stats.totalCompanies}</Typography>
            </Item>
          </Grid>
          <Grid component={Paper} item xs={12} md={6} lg={4}>
            <Item>
              <Typography variant="h6">Total de Unidades</Typography>
              <Typography variant="h4">{stats.totalLocations}</Typography>
            </Item>
          </Grid>
          <Grid component={Paper} item xs={12} md={6} lg={4}>
            <Item>
              <Typography variant="h6">Faturamento</Typography>
              <Typography variant="h4">R$ 0,00</Typography>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid component={Card} item xs={12} md={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Empresas Recentes
              </Typography>
              <List>
                {stats.recentCompanies.map((company) => (
                  <div key={company.id}>
                    <ListItem>
                      <ListItemText
                        primary={company.name}
                        secondary={`CNPJ: ${company.cnpj}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </CardContent>
          </Grid>
          <Grid component={Card} item xs={12} md={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Unidades Recentes
              </Typography>
              <List>
                {stats.recentLocations.map((location) => (
                  <div key={location.id}>
                    <ListItem>
                      <ListItemText
                        primary={location.name}
                        secondary={`${location.city} - ${location.state}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
} 