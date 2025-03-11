import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import { getAllResults } from '../services/api';

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Erro ao carregar os resultados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Concluído" color="success" size="small" />;
      case 'processing':
        return <Chip icon={<HourglassIcon />} label="Processando" color="warning" size="small" />;
      case 'failed':
        return <Chip icon={<ErrorIcon />} label="Falhou" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resultados de Análises
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
        ) : results.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum resultado encontrado
            </Typography>
            <Button
              component={RouterLink}
              to="/upload"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Realizar Nova Análise
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo de Análise</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((result) => (
                      <TableRow hover key={result.id}>
                        <TableCell>{result.id}</TableCell>
                        <TableCell>{formatDate(result.timestamp)}</TableCell>
                        <TableCell>
                          {result.results && result.results.analysis_type
                            ? getAnalysisTypeLabel(result.results.analysis_type)
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{getStatusChip(result.status)}</TableCell>
                        <TableCell align="right">
                          <Button
                            component={RouterLink}
                            to={`/results/${result.id}`}
                            startIcon={<VisibilityIcon />}
                            size="small"
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={results.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ResultsPage; 