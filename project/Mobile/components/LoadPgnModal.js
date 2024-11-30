import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const LoadPgnModal = ({ onLoadPgn }) => {
  const [pgnText, setPgnText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!pgnText.trim()) {
      setError('Please enter a PGN');
      return;
    }

    try {
      if (!pgnText.includes('1.')) {
        throw new Error('Invalid PGN format');
      }
      
      setIsSubmitting(true);
      onLoadPgn(pgnText.trim());
      setPgnText('');
      setError('');
    } catch (err) {
      setError('Invalid PGN format. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Load Game PGN</Text>
      
      <TextInput
        value={pgnText}
        onChangeText={setPgnText}
        placeholder="Paste your PGN here..."
        style={styles.input}
        multiline
        numberOfLines={6}
      />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setPgnText('');
            setError('');
          }}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Load</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFE5E5',
    borderRadius: 6,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadPgnModal;