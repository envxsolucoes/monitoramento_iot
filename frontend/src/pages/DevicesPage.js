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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import { 
    DevicesOther as DevicesIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const DevicesPage = () => {
    // Dados simulados de dispositivos IoT
    const [devices, setDevices] = useState([
        { 
            id: 1, 
            name: 'Sensor de Temperatura 1', 
            type: 'temperature', 
            location: 'Sala de Servidores', 
            status: 'online',
            lastReading: '24.5°C',
            lastUpdate: '2023-03-10 14:32:45'
        },
        { 
            id: 2, 
            name: 'Sensor de Umidade 1', 
            type: 'humidity', 
            location: 'Sala de Servidores', 
            status: 'online',
            lastReading: '45%',
            lastUpdate: '2023-03-10 14:32:45'
        },
        { 
            id: 3, 
            name: 'Sensor de Movimento 1', 
            type: 'motion', 
            location: 'Entrada Principal', 
            status: 'offline',
            lastReading: 'Sem movimento',
            lastUpdate: '2023-03-10 10:15:22'
        },
        { 
            id: 4, 
            name: 'Sensor de Temperatura 2', 
            type: 'temperature', 
            location: 'Área de Produção', 
            status: 'online',
            lastReading: '22.1°C',
            lastUpdate: '2023-03-10 14:30:12'
        },
        { 
            id: 5, 
            name: 'Sensor de Qualidade do Ar', 
            type: 'air_quality', 
            location: 'Área de Produção', 
            status: 'online',
            lastReading: 'Bom (AQI: 42)',
            lastUpdate: '2023-03-10 14:28:55'
        },
    ]);

    // Função simulada para atualizar os dispositivos
    const handleRefresh = () => {
        alert('Atualizando lista de dispositivos...');
        // Em um cenário real, aqui faríamos uma chamada à API
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Dispositivos IoT
                    </Typography>
                    <Typography variant="body1">
                        Gerencie e monitore os dispositivos IoT conectados ao sistema.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                >
                    Atualizar
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 4, overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="dispositivos IoT">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Localização</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Última Leitura</TableCell>
                                <TableCell>Última Atualização</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {devices.map((device) => (
                                <TableRow hover key={device.id}>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DevicesIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            {device.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{device.type}</TableCell>
                                    <TableCell>{device.location}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={device.status === 'online' ? 'Online' : 'Offline'} 
                                            color={device.status === 'online' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{device.lastReading}</TableCell>
                                    <TableCell>{device.lastUpdate}</TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" color="primary" title="Configurar">
                                            <SettingsIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" title="Remover">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Resumo por Tipo de Dispositivo
            </Typography>
            <Grid container spacing={3}>
                {[
                    { type: 'Temperatura', count: 2, color: '#f44336' },
                    { type: 'Umidade', count: 1, color: '#2196f3' },
                    { type: 'Movimento', count: 1, color: '#ff9800' },
                    { type: 'Qualidade do Ar', count: 1, color: '#4caf50' }
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card 
                            sx={{ 
                                borderTop: `4px solid ${item.color}`,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {item.type}
                                </Typography>
                                <Typography variant="h3" color="text.secondary">
                                    {item.count}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    dispositivos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DevicesPage; 