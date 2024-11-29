import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/AuthService';

jest.mock('../../services/AuthService');

const TestComponent = () => {
  const auth = useAuth();
  return (
    <>
      <text testID="loading">{auth.loading.toString()}</text>
      <text testID="user">{JSON.stringify(auth.user)}</text>
      <text testID="error">{auth.error}</text>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides authentication state to children', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('loading').props.children).toBe('true');
    expect(getByTestId('user').props.children).toBe('null');
    expect(getByTestId('error').props.children).toBe('');
  });

  it('handles successful login', async () => {
    const mockUser = { username: 'testuser', email: 'test@example.com' };
    authService.login.mockResolvedValueOnce(mockUser);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      const auth = useAuth();
      await auth.login('test@example.com', 'password123');
    });

    expect(getByTestId('loading').props.children).toBe('false');
    expect(JSON.parse(getByTestId('user').props.children)).toEqual(mockUser);
    expect(getByTestId('error').props.children).toBe('');
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    authService.login.mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      const auth = useAuth();
      await auth.login('test@example.com', 'wrongpassword');
    });

    expect(getByTestId('loading').props.children).toBe('false');
    expect(getByTestId('user').props.children).toBe('null');
    expect(getByTestId('error').props.children).toBe(errorMessage);
  });
});