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
} from '@mui/material';
import { companyService, locationService } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';

interface DashboardStats {
  totalCompanies: number;
  totalLocations: number;
  recentCompanies: any[];
  recentLocations: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalLocations: 0,
    recentCompanies: [],
    recentLocations: [],
  });

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

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Empresas
                </Typography>
                <Typography variant="h4">{stats.totalCompanies}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Unidades
                </Typography>
                <Typography variant="h4">{stats.totalLocations}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
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
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
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
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
} 