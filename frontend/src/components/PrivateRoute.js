import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log('PrivateRoute - User:', user);
    console.log('PrivateRoute - Loading:', loading);

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Carregando...
                </Typography>
            </Box>
        );
    }

    if (!user) {
        // Redirecionar para a página de login, mas salvar a localização atual
        // para que possamos redirecionar de volta após o login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute; 