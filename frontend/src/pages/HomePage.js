import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Assessment as ResultsIcon,
  Nature as NatureIcon,
  Visibility as VisionIcon,
  Eco as EcoIcon,
} from '@mui/icons-material';

const features = [
  {
    title: 'Análise de Vegetação',
    description: 'Calcule índices de vegetação e monitore a saúde das plantas.',
    icon: <NatureIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Detecção de Objetos',
    description: 'Identifique e classifique objetos em imagens ambientais.',
    icon: <VisionIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Monitoramento Ambiental',
    description: 'Acompanhe mudanças ambientais ao longo do tempo.',
    icon: <EcoIcon fontSize="large" color="primary" />,
  },
];

function HomePage() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?nature,forest)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Visão EnvX
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Sistema de visão computacional para monitoramento ambiental
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/upload"
                  startIcon={<UploadIcon />}
                >
                  Iniciar Análise
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/results"
                  startIcon={<ResultsIcon />}
                >
                  Ver Resultados
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Recursos
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  pt: 3,
                }}
              >
                {feature.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  {feature.title}
                </Typography>
                <Typography align="center">{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: 2,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom>
            Comece a analisar suas imagens agora
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Faça upload de imagens ambientais e obtenha análises detalhadas usando
            algoritmos de visão computacional.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/upload"
            startIcon={<UploadIcon />}
            sx={{ mt: 2 }}
          >
            Iniciar Análise
          </Button>
        </Container>
      </Box>
    </Container>
  );
}

export default HomePage; 