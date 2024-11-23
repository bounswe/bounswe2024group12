import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://buchessocial.online/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/accounts/login/', {
        mail: email,
        password: password,
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export { api };