import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';
import { AuthContext } from '../../contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockAuthContext = {
    login: mockLogin,
    error: '',
    loading: false,
  };

  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('validates email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginScreen />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Email');
    const loginButton = getByText('Log In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('validates password length', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginScreen />
      </AuthContext.Provider>
    );

    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Log In');

    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters long')).toBeTruthy();
    });
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce(true);

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginScreen />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Log In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});

