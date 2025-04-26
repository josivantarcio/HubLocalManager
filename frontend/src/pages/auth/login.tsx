import React from 'react';
import { Box, Typography } from '@mui/material';

const Login: React.FC = () => {
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        HubLocal Manager
      </Typography>
      <Typography component="p" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Feito com ❤️ por Josevan Oliveira
      </Typography>
    </Box>
  );
};

export default Login; 