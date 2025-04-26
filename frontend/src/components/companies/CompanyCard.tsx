import { Card, CardContent, Typography, Box } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

interface Company {
  id: number;
  name: string;
  cnpj: string;
}

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BusinessIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {company.name}
          </Typography>
        </Box>
        <Typography color="text.secondary">
          CNPJ: {company.cnpj}
        </Typography>
      </CardContent>
    </Card>
  );
} 