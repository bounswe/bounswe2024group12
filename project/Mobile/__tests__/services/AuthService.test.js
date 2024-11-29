import { authService } from '../../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('successfully logs in user and stores token', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          username: 'testuser',
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);
      AsyncStorage.setItem.mockResolvedValueOnce();

      const result = await authService.login('test@email.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith('/accounts/login/', {
        mail: 'test@email.com',
        password: 'password123',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'test-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles login failure', async () => {
      const errorMessage = 'Invalid credentials';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(authService.login('test@email.com', 'wrong-password'))
        .rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('successfully logs out user and removes token', async () => {
      AsyncStorage.multiRemove.mockResolvedValueOnce();

      await authService.logout();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['userToken', 'userData']);
    });
  });
});