import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const LoadPgnModal = ({ onLoadPgn, onClose }) => {
  const [pgnText, setPgnText] = useState('');

  const handleSubmit = () => {
    if (pgnText.trim()) {
      onLoadPgn(pgnText.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Load PGN</Text>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          value={pgnText}
          onChangeText={setPgnText}
          placeholder="Paste PGN here..."
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.loadButton, !pgnText.trim() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!pgnText.trim()}
          >
            <Text style={styles.loadButtonText}>Load</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    marginBottom: Platform.OS === 'ios' ? 100 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
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
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  loadButton: {
    backgroundColor: '#007AFF',
  },
  loadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default LoadPgnModal;