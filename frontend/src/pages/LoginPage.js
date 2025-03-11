import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Link,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirecionar para a página de onde o usuário veio, ou para a página inicial
    const from = location.state?.from?.pathname || '/';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('E-mail inválido')
                .required('E-mail é obrigatório'),
            password: Yup.string()
                .required('Senha é obrigatória')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);

            try {
                await login(values.email, values.password);
                navigate(from, { replace: true });
            } catch (err) {
                console.error('Erro de login:', err);
                setError('Credenciais inválidas. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                backgroundImage: 'linear-gradient(135deg, #00796b 0%, #4db6ac 100%)',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2
                    }}
                >
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    mr: 1,
                                    color: 'primary.main'
                                }}
                            >
                                Visão
                            </Box>
                            <Box component="span" sx={{ fontSize: '1.8rem', color: 'text.primary' }}>
                                EnvX
                            </Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Sistema de Monitoramento IoT
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Entrar'}
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Use admin@admin.com / admin para entrar
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage; 