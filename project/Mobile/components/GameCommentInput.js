import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { api } from '../services/AuthService';

const GameCommentInput = ({ gameId, currentFen, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentFen) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/games/${gameId}/add_comment/`, {
        position_fen: currentFen,
        comment_text: newComment.trim()
      });

      if (response.status === 201) {
        setNewComment('');
        if (onCommentAdded) {
          onCommentAdded(response.data);
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to post comment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add your analysis..."
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!newComment.trim() || isSubmitting) && styles.disabledButton
        ]}
        onPress={handleSubmitComment}
        disabled={!newComment.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Feather name="send" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default GameCommentInput;