import React from 'react';
import { 
    Box, 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Card, 
    CardContent, 
    CardHeader,
    Button,
    Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
    DevicesOther as DevicesIcon,
    CameraAlt as CameraIcon,
    Assessment as AssessmentIcon,
    CloudUpload as UploadIcon
} from '@mui/icons-material';

const DashboardPage = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Análise de Imagens',
            description: 'Faça upload de imagens para análise e visualize os resultados.',
            icon: <UploadIcon fontSize="large" color="primary" />,
            link: '/upload',
            buttonText: 'Ir para Upload'
        },
        {
            title: 'Resultados',
            description: 'Visualize os resultados das análises anteriores.',
            icon: <AssessmentIcon fontSize="large" color="primary" />,
            link: '/results',
            buttonText: 'Ver Resultados'
        },
        {
            title: 'Câmeras',
            description: 'Gerencie e visualize as câmeras conectadas ao sistema.',
            icon: <CameraIcon fontSize="large" color="primary" />,
            link: '/cameras',
            buttonText: 'Gerenciar Câmeras'
        },
        {
            title: 'Dispositivos IoT',
            description: 'Visualize e gerencie os dispositivos IoT conectados.',
            icon: <DevicesIcon fontSize="large" color="primary" />,
            link: '/devices',
            buttonText: 'Ver Dispositivos'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Cabeçalho de boas-vindas */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #00796b 30%, #4db6ac 90%)',
                            color: 'white'
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Bem-vindo, {user?.name || 'Usuário'}!
                        </Typography>
                        <Typography variant="body1">
                            Este é o painel de controle do sistema Visão EnvX. Aqui você pode gerenciar câmeras, 
                            dispositivos IoT, fazer upload de imagens para análise e visualizar resultados.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Cards de funcionalidades */}
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <CardHeader
                                title={card.title}
                                titleTypographyProps={{ variant: 'h6' }}
                                sx={{ pb: 0 }}
                            />
                            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        mb: 2 
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <Box sx={{ p: 2 }}>
                                <Button 
                                    component={Link} 
                                    to={card.link} 
                                    variant="contained" 
                                    fullWidth
                                >
                                    {card.buttonText}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DashboardPage; 