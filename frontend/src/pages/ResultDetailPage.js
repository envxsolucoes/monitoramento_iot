import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
  Photo as PhotoIcon,
  ColorLens as ColorLensIcon,
  Nature as NatureIcon,
  Visibility as VisionIcon,
} from '@mui/icons-material';
import { getAnalysisResults, pollForResults } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function ResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getAnalysisResults(id);
      setResult(data);
      
      // Se o resultado ainda estiver processando, iniciar polling
      if (data.status === 'processing' && !polling) {
        setPolling(true);
        pollForResults(id, 1000, 30)
          .then(updatedResult => {
            setResult(updatedResult);
            setPolling(false);
          })
          .catch(err => {
            console.error('Error polling for results:', err);
            setError('Erro ao aguardar o processamento. Por favor, tente novamente mais tarde.');
            setPolling(false);
          });
      }
    } catch (err) {
      console.error('Error fetching result details:', err);
      setError('Erro ao carregar os detalhes do resultado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Concluído" color="success" />;
      case 'processing':
        return <Chip icon={<HourglassIcon />} label="Processando" color="warning" />;
      case 'failed':
        return <Chip icon={<ErrorIcon />} label="Falhou" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getAnalysisTypeLabel = (analysisType) => {
    const types = {
      'color_analysis': 'Análise de Cores',
      'object_detection': 'Detecção de Objetos',
      'vegetation_index': 'Índice de Vegetação',
    };
    return types[analysisType] || analysisType;
  };

  const getAnalysisTypeIcon = (analysisType) => {
    switch (analysisType) {
      case 'color_analysis':
        return <ColorLensIcon />;
      case 'object_detection':
        return <VisionIcon />;
      case 'vegetation_index':
        return <NatureIcon />;
      default:
        return <PhotoIcon />;
    }
  };

  const renderColorAnalysisResults = (results) => {
    if (!results || !results.average_color) return null;
    
    const { average_color, dominant_color } = results;
    const avgColorStyle = {
      backgroundColor: `rgb(${average_color.r}, ${average_color.g}, ${average_color.b})`,
      width: '100px',
      height: '100px',
      borderRadius: '8px',
      margin: '0 auto',
      border: '1px solid #ddd',
    };
    
    // Dados para o gráfico de pizza
    const pieData = {
      labels: ['Vermelho', 'Verde', 'Azul'],
      datasets: [
        {
          data: [average_color.r, average_color.g, average_color.b],
          backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    };
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cor Média
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={avgColorStyle} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  RGB: ({Math.round(average_color.r)}, {Math.round(average_color.g)}, {Math.round(average_color.b)})
                </Typography>
                <Typography variant="body1">
                  Cor dominante: {dominant_color === 'red' ? 'Vermelho' : dominant_color === 'green' ? 'Verde' : 'Azul'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição de Cores
              </Typography>
              <Box sx={{ height: 250 }}>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderObjectDetectionResults = (results) => {
    if (!results || !results.objects_detected) return null;
    
    const { objects_detected, count } = results;
    
    // Contar ocorrências de cada classe
    const classCounts = {};
    objects_detected.forEach(obj => {
      classCounts[obj.class] = (classCounts[obj.class] || 0) + 1;
    });
    
    // Dados para o gráfico de barras
    const barData = {
      labels: Object.keys(classCounts),
      datasets: [
        {
          label: 'Quantidade',
          data: Object.values(classCounts),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Objetos Detectados
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total: {count} objeto(s)
              </Typography>
              <List>
                {objects_detected.map((obj, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <VisionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={obj.class.charAt(0).toUpperCase() + obj.class.slice(1)}
                      secondary={`Confiança: ${Math.round(obj.confidence * 100)}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição de Classes
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderVegetationIndexResults = (results) => {
    if (!results || !results.ndvi_average === undefined) return null;
    
    const { ndvi_average, vegetation_health, coverage_percentage } = results;
    
    // Determinar cor com base na saúde da vegetação
    let healthColor;
    switch (vegetation_health) {
      case 'healthy':
        healthColor = 'success.main';
        break;
      case 'moderate':
        healthColor = 'warning.main';
        break;
      case 'poor':
        healthColor = 'error.main';
        break;
      default:
        healthColor = 'text.primary';
    }
    
    // Traduzir status de saúde
    const healthTranslation = {
      'healthy': 'Saudável',
      'moderate': 'Moderada',
      'poor': 'Ruim',
    };
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Índice de Vegetação (NDVI)
              </Typography>
              <Typography variant="body1" gutterBottom>
                Valor médio: {ndvi_average.toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Saúde da vegetação: <span style={{ color: healthColor }}>{healthTranslation[vegetation_health] || vegetation_health}</span>
              </Typography>
              <Typography variant="body1">
                Cobertura: {coverage_percentage.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderResultContent = () => {
    if (!result || !result.results) return null;
    
    const analysisType = result.results.analysis_type || 
                         (result.results.average_color ? 'color_analysis' : 
                          result.results.objects_detected ? 'object_detection' : 
                          result.results.ndvi_average !== undefined ? 'vegetation_index' : null);
    
    if (!analysisType) {
      return (
        <Alert severity="info">
          Tipo de análise não reconhecido ou resultados incompletos.
        </Alert>
      );
    }
    
    switch (analysisType) {
      case 'color_analysis':
        return renderColorAnalysisResults(result.results);
      case 'object_detection':
        return renderObjectDetectionResults(result.results);
      case 'vegetation_index':
        return renderVegetationIndexResults(result.results);
      default:
        return (
          <Alert severity="info">
            Tipo de análise não suportado para visualização: {analysisType}
          </Alert>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/results')}
          sx={{ mb: 3 }}
        >
          Voltar para Resultados
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Detalhes da Análise
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : !result ? (
          <Alert severity="error">
            Resultado não encontrado.
          </Alert>
        ) : (
          <>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informações Gerais
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="ID" secondary={result.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Data" secondary={formatDate(result.timestamp)} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tipo de Análise"
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            {getAnalysisTypeIcon(result.results?.analysis_type)}
                            <Box sx={{ ml: 1 }}>
                              {getAnalysisTypeLabel(result.results?.analysis_type)}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={getStatusChip(result.status)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  {result.image_path && (
                    <Card>
                      <CardMedia
                        component="img"
                        image={`/static/${result.image_path.split('/').pop()}`}
                        alt="Imagem analisada"
                        sx={{ maxHeight: 300, objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+não+disponível';
                        }}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Imagem analisada
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Paper>
            
            {result.status === 'processing' ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Processando análise...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Isso pode levar alguns instantes.
                </Typography>
              </Box>
            ) : result.status === 'failed' ? (
              <Alert severity="error" sx={{ my: 3 }}>
                <Typography variant="h6">
                  Erro no processamento
                </Typography>
                <Typography variant="body1">
                  {result.error || 'Ocorreu um erro durante o processamento da análise.'}
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Resultados
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {renderResultContent()}
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default ResultDetailPage; 