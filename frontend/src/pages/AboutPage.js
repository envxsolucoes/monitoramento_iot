import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  Visibility as VisionIcon,
  CloudUpload as CloudIcon,
  Settings as SettingsIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

function AboutPage() {
  const technologies = [
    {
      name: 'Frontend',
      description: 'Interface de usuário construída com React e Material-UI',
      icon: <CodeIcon color="primary" />,
      items: ['React', 'Material-UI', 'Chart.js', 'Axios', 'React Router'],
    },
    {
      name: 'Backend',
      description: 'API RESTful construída com FastAPI',
      icon: <StorageIcon color="primary" />,
      items: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Pydantic', 'Uvicorn'],
    },
    {
      name: 'Visão Computacional',
      description: 'Algoritmos de processamento de imagem e visão computacional',
      icon: <VisionIcon color="primary" />,
      items: ['OpenCV', 'TensorFlow', 'NumPy', 'scikit-learn', 'Pillow'],
    },
    {
      name: 'Infraestrutura',
      description: 'Implantação e hospedagem',
      icon: <CloudIcon color="primary" />,
      items: ['Raspberry Pi', 'Nginx', 'Systemd', 'Docker (opcional)'],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sobre o Projeto
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Visão EnvX
          </Typography>
          <Typography variant="body1" paragraph>
            O Visão EnvX é um sistema de visão computacional para monitoramento ambiental, 
            desenvolvido para auxiliar na análise de imagens ambientais, detecção de objetos 
            e cálculo de índices de vegetação.
          </Typography>
          <Typography variant="body1" paragraph>
            Este projeto foi desenvolvido pela EnvX Soluções, com o objetivo de fornecer 
            ferramentas acessíveis para monitoramento ambiental utilizando tecnologias de 
            visão computacional e aprendizado de máquina.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <GitHubIcon sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Repositório: <a href="https://github.com/envxsolucoes/Vision_ENVX" target="_blank" rel="noopener noreferrer">github.com/envxsolucoes/Vision_ENVX</a>
            </Typography>
          </Box>
        </Paper>
        
        <Typography variant="h5" gutterBottom>
          Tecnologias Utilizadas
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {tech.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {tech.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tech.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    {tech.items.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="h5" gutterBottom>
          Funcionalidades
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <VisionIcon color="primary" sx={{ fontSize: 48 }} />
                <Typography variant="h6" gutterBottom>
                  Análise de Cores
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Identifica cores predominantes em imagens e calcula distribuições de cores.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <VisionIcon color="primary" sx={{ fontSize: 48 }} />
                <Typography variant="h6" gutterBottom>
                  Detecção de Objetos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detecta e classifica objetos em imagens ambientais, como árvores, plantas e corpos d'água.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <VisionIcon color="primary" sx={{ fontSize: 48 }} />
                <Typography variant="h6" gutterBottom>
                  Índices de Vegetação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calcula índices de vegetação para avaliar a saúde e cobertura vegetal.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Typography variant="h5" gutterBottom>
          Equipe
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            O Visão EnvX é desenvolvido e mantido pela equipe da EnvX Soluções, 
            especializada em soluções tecnológicas para monitoramento ambiental.
          </Typography>
          <Typography variant="body1">
            Para mais informações, entre em contato através do email: 
            <a href="mailto:contato@envxsolucoes.com"> contato@envxsolucoes.com</a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default AboutPage; 