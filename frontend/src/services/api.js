import axios from 'axios';

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o erro for 401 (Unauthorized), redireciona para a página de login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de API para autenticação
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, remove os dados locais
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Funções de API para análise de imagens
export const analysisService = {
  uploadImage: async (formData) => {
    try {
      const response = await api.post('/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getResults: async () => {
    try {
      const response = await api.get('/analysis/results');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getResultById: async (id) => {
    try {
      const response = await api.get(`/analysis/results/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Funções de API para câmeras
export const cameraService = {
  getCameras: async () => {
    try {
      const response = await api.get('/cameras');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCameraById: async (id) => {
    try {
      const response = await api.get(`/cameras/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createCamera: async (cameraData) => {
    try {
      const response = await api.post('/cameras', cameraData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateCamera: async (id, cameraData) => {
    try {
      const response = await api.put(`/cameras/${id}`, cameraData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteCamera: async (id) => {
    try {
      const response = await api.delete(`/cameras/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Funções de API para dispositivos IoT
export const deviceService = {
  getDevices: async () => {
    try {
      const response = await api.get('/devices');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDeviceById: async (id) => {
    try {
      const response = await api.get(`/devices/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createDevice: async (deviceData) => {
    try {
      const response = await api.post('/devices', deviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateDevice: async (id, deviceData) => {
    try {
      const response = await api.put(`/devices/${id}`, deviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteDevice: async (id) => {
    try {
      const response = await api.delete(`/devices/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 