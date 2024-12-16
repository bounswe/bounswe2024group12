import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { api } from '../services/AuthService';
import Chessboard from 'react-native-chessboard';

const screenWidth = Dimensions.get('window').width;
const boardSize = (screenWidth - 80);

const validateFEN = (fen) => {
  if (!fen) return true;
  const trimmedFen = fen.trim();

  const parts = trimmedFen.split(" ");
  const position = parts[0];

  const ranks = position.split("/");
  if (ranks.length !== 8) return false;

  for (const rank of ranks) {
    let squares = 0;
    for (let i = 0; i < rank.length; i++) {
      const char = rank[i];
      if ("12345678".includes(char)) {
        squares += parseInt(char);
      } else if ("prnbqkPRNBQK".includes(char)) {
        squares += 1;
      } else {
        return false;
      }
    }
    if (squares !== 8) return false;
  }

  if (parts.length === 1) return true;

  if (parts.length === 6) {
    const [_, turn, castling, enPassant, halfmove, fullmove] = parts;
    return (
      /^[wb]$/.test(turn) &&
      /^(-|K?Q?k?q?)$/.test(castling) &&
      /^(-|[a-h][36])$/.test(enPassant) &&
      /^\d+$/.test(halfmove) &&
      /^\d+$/.test(fullmove)
    );
  }

  return false;
};

const formatFEN = (fen) => {
  if (!fen) return "";
  let cleanFen = fen.trim();
  if (cleanFen.includes(" ")) return cleanFen;
  return `${cleanFen} w KQkq - 0 1`;
};

const PostManagement = ({ post, currentUser, onPostUpdated, onPostDeleted, navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedText, setEditedText] = useState(post.post_text || '');
  const [editedTags, setEditedTags] = useState(() => {
    if (Array.isArray(post.tags)) {
      return post.tags;
    }
    if (typeof post.tags === 'string') {
      try {
        if (post.tags.startsWith('[') && post.tags.endsWith(']')) {
          return JSON.parse(post.tags);
        }
        return post.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [editedFen, setEditedFen] = useState(post.fen || '');
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const canModifyPost = currentUser?.username === post.user;

  const handleUpdatePost = async () => {
    if (!editedTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
  
    if (editedFen && !validateFEN(formatFEN(editedFen))) {
      Alert.alert('Error', 'Invalid FEN notation format');
      return;
    }
  
    try {
      setIsLoading(true);
      
      const processedTags = editedTags.map(tag => String(tag).trim()).filter(Boolean);
      
      const updateData = {
        title: editedTitle.trim(),
        post_text: editedText.trim(),
        tags: processedTags,
        fen: editedFen.trim()
      };
  
      if (post.post_image) {
        updateData.post_image = post.post_image;
      }
  
      console.log('Sending update request with data:', updateData);
  
      const response = await api.put(`/posts/edit/${post.id}/`, updateData);
  
      console.log('Update response:', response.data);
  
      if (response.status === 200) {
        const updatedPost = {
          ...post,
          title: editedTitle.trim(),
          post_text: editedText.trim(),
          tags: processedTags,
          fen: editedFen.trim()
        };
        
        onPostUpdated(updatedPost);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update post error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: error.config?.data
      });
      
      let errorMessage = 'Failed to update post. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response?.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response?.data) {
        const errors = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('\n');
        errorMessage = errors;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await api.delete(`/posts/delete/${post.id}/`);

              if (response.status === 200) {
                onPostDeleted(post.id);
                navigation.goBack();
              }
            } catch (error) {
              console.error('Delete post error:', error);
              const errorMessage = error.response?.data?.message || 'Failed to delete post';
              Alert.alert('Error', errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !editedTags.includes(trimmedTag) && editedTags.length < 10) {
      setEditedTags([...editedTags, trimmedTag]);
      setTagInput('');
    } else if (editedTags.length >= 10) {
      Alert.alert('Error', 'Maximum 10 tags allowed');
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  if (!canModifyPost) return null;

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.titleInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Post title"
            maxLength={100}
          />
          
          <TextInput
            style={styles.contentInput}
            value={editedText}
            onChangeText={setEditedText}
            placeholder="Post content"
            multiline
            maxLength={1000}
          />

          <View style={styles.fenSection}>
            <Text style={styles.sectionLabel}>Chess Position (FEN)</Text>
            <TextInput
              style={[
                styles.fenInput,
                editedFen && !validateFEN(formatFEN(editedFen)) && styles.inputError
              ]}
              value={editedFen}
              onChangeText={setEditedFen}
              placeholder="Enter FEN notation"
              multiline
            />
            {editedFen && !validateFEN(formatFEN(editedFen)) && (
              <Text style={styles.errorText}>Invalid FEN format</Text>
            )}
            {editedFen && validateFEN(formatFEN(editedFen)) && (
              <View style={styles.boardPreview}>
                <Chessboard
                  fen={formatFEN(editedFen)}
                  boardSize={boardSize}
                  gestureEnabled={false}
                />
              </View>
            )}
          </View>

          <View style={styles.tagSection}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Add tags..."
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {editedTags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(tag)}
                    style={styles.removeTagButton}
                  >
                    <Feather name="x" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setEditedTitle(post.title);
                setEditedText(post.post_text || '');
                setEditedTags(post.tags || []);
                setEditedFen(post.fen || '');
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdatePost}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => setIsEditing(true)}
            style={styles.actionButton}
          >
            <Feather name="edit-2" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDeletePost}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Feather name="trash-2" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  editContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlignVertical: 'top',
  },
  fenSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  fenInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  boardPreview: {
    marginTop: 12,
    alignItems: 'center',
  },
  tagSection: {
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addTagButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    color: '#007AFF',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
});

export default PostManagement;