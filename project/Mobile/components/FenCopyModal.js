import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FenCopyModal = ({ isVisible, onClose, fen, onCopyFen }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>FEN Notation</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.fenContainer}
            onPress={onCopyFen}
          >
            <Text style={styles.fenText}>{fen}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={onCopyFen}
          >
            <Feather name="copy" size={20} color="white" />
            <Text style={styles.copyButtonText}>
              Copy FEN
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  fenContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fenText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace'
    }),
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FenCopyModal;