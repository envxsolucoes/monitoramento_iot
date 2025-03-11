import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Settings as SettingsIcon,
  Assessment as AnalysisIcon,
} from '@mui/icons-material';
import { uploadImage, analyzeImage, pollForResults } from '../services/api';

const steps = ['Selecionar Imagem', 'Escolher Análise', 'Processar'];

const analysisTypes = [
  {
    value: 'color_analysis',
    label: 'Análise de Cores',
    description: 'Analisa as cores predominantes na imagem.',
  },
  {
    value: 'object_detection',
    label: 'Detecção de Objetos',
    description: 'Detecta e classifica objetos na imagem.',
  },
  {
    value: 'vegetation_index',
    label: 'Índice de Vegetação',
    description: 'Calcula índices de vegetação para avaliar a saúde das plantas.',
  },
];

function UploadPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisType, setAnalysisType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      // Reset states
      setError('');
      setUploadedImage(null);
      
      // Move to next step
      setActiveStep(1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const handleAnalysisTypeChange = (event) => {
    setAnalysisType(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione uma imagem.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await uploadImage(file);
      setUploadedImage(result);
      setSuccess('Imagem enviada com sucesso!');
      setActiveStep(2);
    } catch (err) {
      setError('Erro ao enviar a imagem. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setError('Por favor, envie uma imagem primeiro.');
      return;
    }

    if (!analysisType) {
      setError('Por favor, selecione um tipo de análise.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await analyzeImage(uploadedImage.filename, analysisType);
      setSuccess('Análise iniciada com sucesso!');
      
      // Poll for results
      const analysisResult = await pollForResults(result.analysis_id);
      
      // Navigate to results page
      navigate(`/results/${result.analysis_id}`);
    } catch (err) {
      setError('Erro ao analisar a imagem. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      handleUpload();
    } else if (activeStep === 2) {
      handleAnalyze();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setFile(null);
    setPreview('');
    setUploadedImage(null);
    setAnalysisType('');
    setError('');
    setSuccess('');
    setActiveStep(0);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Análise de Imagem
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mt: 2, mb: 4 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Selecione uma imagem para análise
              </Typography>
              <Box
                {...getRootProps()}
                className="dropzone"
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.400',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 3,
                  backgroundColor: isDragActive ? 'rgba(0, 121, 107, 0.1)' : 'transparent',
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                {isDragActive ? (
                  <Typography>Solte a imagem aqui...</Typography>
                ) : (
                  <Typography>
                    Arraste e solte uma imagem aqui, ou clique para selecionar
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Formatos suportados: JPG, PNG, GIF, BMP, TIFF (máx. 10MB)
                </Typography>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Escolha o tipo de análise
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {preview && (
                    <Card sx={{ mb: 3 }}>
                      <CardMedia
                        component="img"
                        image={preview}
                        alt="Preview da imagem"
                        sx={{ maxHeight: 300, objectFit: 'contain' }}
                      />
                    </Card>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="analysis-type-label">Tipo de Análise</InputLabel>
                    <Select
                      labelId="analysis-type-label"
                      id="analysis-type"
                      value={analysisType}
                      label="Tipo de Análise"
                      onChange={handleAnalysisTypeChange}
                    >
                      {analysisTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {analysisType && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {analysisTypes.find((t) => t.value === analysisType)?.description}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Processando Análise
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography>Processando sua imagem...</Typography>
                </Box>
              ) : (
                <Box sx={{ my: 4 }}>
                  <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" color="success.main">
                    Imagem enviada com sucesso!
                  </Typography>
                  <Typography>
                    Clique em "Analisar" para iniciar o processamento.
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de análise: {analysisTypes.find((t) => t.value === analysisType)?.label}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            disabled={loading}
          >
            Reiniciar
          </Button>
          
          <Box>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Voltar
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !file) ||
                (activeStep === 1 && !analysisType) ||
                loading
              }
              startIcon={
                activeStep === 0 ? <UploadIcon /> :
                activeStep === 1 ? <SettingsIcon /> :
                <AnalysisIcon />
              }
            >
              {activeStep === 0 ? 'Continuar' :
               activeStep === 1 ? 'Enviar' :
               'Analisar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default UploadPage; 