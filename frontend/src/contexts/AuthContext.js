import React, { createContext, useContext, useState, useEffect } from 'react';

// Definição do contexto
const AuthContext = createContext(null);

// Hook para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar se o usuário está autenticado ao carregar a página
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Verificação de autenticação
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Função de login
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Simulando uma chamada de API
            console.log('Tentando login com:', email, password);

            // Para fins de demonstração, aceitamos qualquer login
            // Em um ambiente real, isso seria uma chamada de API
            if (email === 'admin@admin.com' && password === 'admin') {
                const userData = {
                    id: '1',
                    email: email,
                    name: 'Administrador',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    role: 'admin'
                };

                // Gerar um token simulado
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE2MzA1MjQ3OTUsImV4cCI6MTk0NjExMjc5NX0.simulated_token';

                // Armazenar o token e o usuário
                localStorage.setItem('token', token);
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('Login bem-sucedido:', userData);
                return;
            }

            throw new Error('Credenciais inválidas');
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Função de logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Remover o token também
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 