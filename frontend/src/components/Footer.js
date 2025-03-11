import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Visão EnvX
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de visão computacional para monitoramento ambiental.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Links Úteis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="https://github.com/envxsolucoes/Vision_ENVX" color="inherit">
                GitHub
              </Link>
              {' | '}
              <Link href="/about" color="inherit">
                Sobre
              </Link>
              {' | '}
              <Link href="https://envxsolucoes.com" color="inherit">
                EnvX Soluções
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://envxsolucoes.com">
              EnvX Soluções
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 