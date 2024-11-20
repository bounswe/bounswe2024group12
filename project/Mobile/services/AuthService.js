import axios from 'axios';

const api = axios.create({
  baseURL: __DEV__ ? 'https://buchessocial.online/api/v1' : 'https://buchessocial.online/api/v1',
  timeout: 10000,
});

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/accounts/login/', {
        mail: email,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async signup(email, username, password) {
    try {
      const response = await api.post('/accounts/signup/', {
        mail: email,
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  logout() {
    return Promise.resolve();
  }
};