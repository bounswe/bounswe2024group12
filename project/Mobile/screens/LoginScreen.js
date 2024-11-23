import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateInputs = () => {
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      const success = await login(email.trim(), password);
      
      if (success) {
        setEmail('');
        setPassword('');
        setValidationError('');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const navigateToSignup = () => {
    setEmail('');
    setPassword('');
    setValidationError('');
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.header}>Chess Forum</Text>
        
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setValidationError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => this.passwordInput && this.passwordInput.focus()}
        />
        
        {/* Password Input */}
        <TextInput
          ref={(input) => { this.passwordInput = input; }}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setValidationError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {/* Error Messages */}
        {(validationError || authError) && (
          <Text style={styles.errorText}>
            {validationError || authError}
          </Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Signup Navigation Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  form: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  }
});