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
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

const parseErrorMessage = (error) => {
  if (error.message && error.message.includes('IntegrityError')) {
    if (error.message.includes('Duplicate entry') && error.message.includes('username')) {
      return 'This username is already taken. Please choose a different one.';
    }
    if (error.message.includes('Duplicate entry') && error.message.includes('mail')) {
      return 'An account with this email already exists.';
    }
    return 'There was a problem creating your account. Please try again with different information.';
  }

  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }

    const errorMessages = [];
    Object.entries(error.response.data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        errorMessages.push(`${key}: ${value.join(', ')}`);
      } else if (typeof value === 'string') {
        errorMessages.push(`${key}: ${value}`);
      }
    });

    if (errorMessages.length > 0) {
      return errorMessages.join('\n');
    }
  }

  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
};

export const authService = {
  async login(mail, password) {
    try {
      const response = await api.post('/accounts/login/', {
        mail: mail,
        password: password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          username: response.data.username,
          mail: mail
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(parseErrorMessage(error));
    }
  },

  async signup(mail, username, password) {
    try {
      console.log('Attempting signup with:', { mail, username });
      const response = await api.post('/accounts/signup/', {
        mail: mail,
        username: username,
        password: password,
      });

      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(parseErrorMessage(error));
    }
  },

  async logout() {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  },

  async isLoggedIn() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
};

export { api };