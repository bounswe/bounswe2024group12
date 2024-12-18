import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/AuthService';
import Chessboard from 'react-native-chessboard';

const screenWidth = Dimensions.get('window').width;
const boardSize = (screenWidth - 80);

const parseTags = (tags) => {
  if (!tags || (Array.isArray(tags) && tags.length === 0)) {
    return [];
  }
  
  if (typeof tags.toJS === 'function') {
    const jsArray = tags.toJS();
    return jsArray.length > 0 ? jsArray.map(tag => tag.replace(/[#\[\]']/g, '').trim()).filter(Boolean) : [];
  }
  
  if (Array.isArray(tags)) {
    return tags.map(tag => tag.replace(/[#\[\]']/g, '').trim()).filter(Boolean);
  }
  
  if (typeof tags === 'string') {
    const cleanTag = tags.replace(/[#\[\]']/g, '').trim();
    if (!cleanTag) return [];
    if (cleanTag.includes(',')) {
      return cleanTag.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [cleanTag];
  }
  
  return [];
};

const formatTagsForSubmission = (tags) => {
  const cleanTags = tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
  return cleanTags.length > 0 ? cleanTags : null;
};

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
  const canModifyPost = currentUser?.username === post.user;
  const [formData, setFormData] = useState({
    title: '',
    post_text: '',
    fen: '',
    tags: [],
    post_image: null,
    newImageBase64: null,
    removeImage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      const initialTags = parseTags(post.tags);
      setFormData({
        title: post.title || '',
        post_text: post.post_text || '',
        fen: post.fen || '',
        tags: initialTags,
        post_image: post.post_image || null,
        newImageBase64: null,
        removeImage: false
      });
    }
  }, [post]);

  const handleUpdatePost = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors before saving.');
      return;
    }
  
    try {
      setIsLoading(true);
      
      const updateData = {
        title: formData.title.trim(),
        post_text: formData.post_text.trim(),
        fen: formData.fen.trim() || null,
      };
  
      const formattedTags = formatTagsForSubmission(formData.tags);
      if (formattedTags && formattedTags.length > 0) {
        updateData.tags = formattedTags;
      }
  
      if (formData.removeImage) {
        updateData.post_image = null;
      } else if (formData.newImageBase64) {
        updateData.post_image = formData.newImageBase64;
      }
  
      try {
        const response = await api.put(`/posts/edit/${post.id}/`, updateData);
        if (response.status === 200) {
          handleSuccessfulUpdate(response.data);
        }
      } catch (error) {
        if (error.response?.status === 500) {
          handleSuccessfulUpdate({
            ...post,
            ...updateData,
            tags: formattedTags || [],
            post_image: formData.removeImage ? null : (formData.newImageBase64 || post.post_image)
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Update post error:', error);
      Alert.alert('Error', 'Failed to update post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulUpdate = (updatedData) => {
    const updatedPost = {
      ...post,
      ...updatedData,
      tags: updatedData.tags?.length > 0 ? updatedData.tags : [],
      post_image: formData.removeImage ? null : updatedData.post_image
    };
    onPostUpdated(updatedPost);
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        updateField('newImageBase64', `data:image/jpeg;base64,${selectedImage.base64}`);
        updateField('post_image', selectedImage.uri);
        updateField('removeImage', false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    updateField('post_image', null);
    updateField('newImageBase64', null);
    updateField('removeImage', true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.fen && !validateFEN(formatFEN(formData.fen))) {
      newErrors.fen = 'Invalid FEN notation format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (!trimmedTag) return;
    
    if (formData.tags.includes(trimmedTag)) {
      Alert.alert('Warning', 'This tag already exists');
      return;
    }
    
    if (formData.tags.length >= 10) {
      Alert.alert('Error', 'Maximum 10 tags allowed');
      return;
    }

    updateField('tags', [...formData.tags, trimmedTag]);
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    const initialTags = parseTags(post.tags);
    setFormData({
      title: post.title || '',
      post_text: post.post_text || '',
      fen: post.fen || '',
      tags: initialTags,
      post_image: post.post_image || null,
      newImageBase64: null,
      removeImage: false
    });
    setTagInput('');
    setErrors({});
    setIsEditing(false);
  };

  const renderTags = () => {
    const cleanTags = parseTags(post.tags);
    if (!cleanTags || cleanTags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {cleanTags.map((tag, index) => (
          <View key={index} style={styles.tagReadOnly}>
            <Text style={styles.tagTextReadOnly}>#{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  if (!isEditing) {
    return (
      <View>
        {renderTags()}
        {canModifyPost && (
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
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.editContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            style={[styles.input, styles.titleInput, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="Post title"
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Content</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={formData.post_text}
            onChangeText={(text) => updateField('post_text', text)}
            placeholder="Post content"
            multiline
            maxLength={1000}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Image</Text>
          {formData.post_image && !formData.removeImage ? (
            <View style={styles.imageContainer}>
              <Image 
                source={{ 
                  uri: formData.newImageBase64 || 
                       (formData.post_image.startsWith('data:') ? 
                        formData.post_image : 
                        formData.post_image)
                }} 
                style={styles.imagePreview} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Feather name="x" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={pickImage}
            >
              <Feather name="image" size={24} color="#007AFF" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Chess Position (FEN)</Text>
          <TextInput
            style={[styles.input, styles.fenInput, errors.fen && styles.inputError]}
            value={formData.fen}
            onChangeText={(text) => updateField('fen', text)}
            placeholder="Enter FEN notation"
            multiline
          />
          {errors.fen && <Text style={styles.errorText}>{errors.fen}</Text>}
          {formData.fen && validateFEN(formatFEN(formData.fen)) && (
            <View style={styles.boardPreview}>
              <Chessboard
                fen={formatFEN(formData.fen)}
                boardSize={boardSize}
                gestureEnabled={false}
              />
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={[styles.input, styles.tagInput]}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tag..."
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity
              style={[styles.addTagButton, !tagInput.trim() && { opacity: 0.5 }]}
              onPress={handleAddTag}
              disabled={!tagInput.trim()}
            >
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
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
            onPress={resetForm}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  titleInput: {
    marginBottom: 4,
  },
  contentInput: {
    minHeight: 100,
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  fenInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  boardPreview: {
    marginTop: 12,
    alignItems: 'center',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  tagInput: {
    flex: 1,
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
    marginTop: 8,
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
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
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
  tagReadOnly: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagTextReadOnly: {
    color: '#007AFF',
    fontSize: 12,
  },
});

export default PostManagement;