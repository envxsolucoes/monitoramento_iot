import React, { useState } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions,
    Button,
    Tabs,
    Tab,
    Paper,
    Divider
} from '@mui/material';
import { 
    Videocam as VideocamIcon,
    Map as MapIcon
} from '@mui/icons-material';

// Componente de painel para as abas
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`camera-tabpanel-${index}`}
            aria-labelledby={`camera-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const CamerasPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Dados simulados de câmeras
    const cameras = [
        { id: 1, name: 'Câmera 1', location: 'Entrada Principal', status: 'online' },
        { id: 2, name: 'Câmera 2', location: 'Estacionamento', status: 'online' },
        { id: 3, name: 'Câmera 3', location: 'Área de Produção', status: 'offline' },
        { id: 4, name: 'Câmera 4', location: 'Depósito', status: 'online' },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Gerenciamento de Câmeras
            </Typography>
            <Typography variant="body1" paragraph>
                Visualize e gerencie as câmeras conectadas ao sistema.
            </Typography>

            <Paper sx={{ width: '100%', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab icon={<VideocamIcon />} label="Lista de Câmeras" />
                    <Tab icon={<MapIcon />} label="Mapa de Câmeras" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        {cameras.map((camera) => (
                            <Grid item xs={12} sm={6} md={4} key={camera.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                mb: 2 
                                            }}
                                        >
                                            <VideocamIcon 
                                                color={camera.status === 'online' ? 'primary' : 'disabled'} 
                                                sx={{ mr: 1 }} 
                                            />
                                            <Typography variant="h6">
                                                {camera.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Localização:</strong> {camera.location}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color={camera.status === 'online' ? 'success.main' : 'error.main'}
                                            sx={{ mt: 1 }}
                                        >
                                            <strong>Status:</strong> {camera.status === 'online' ? 'Online' : 'Offline'}
                                        </Typography>
                                    </CardContent>
                                    <Divider />
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Visualizar
                                        </Button>
                                        <Button size="small" color="secondary">
                                            Configurar
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box 
                        sx={{ 
                            height: 400, 
                            bgcolor: 'background.paper', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            border: '1px dashed grey',
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Mapa de câmeras será implementado em breve
                        </Typography>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default CamerasPage; 