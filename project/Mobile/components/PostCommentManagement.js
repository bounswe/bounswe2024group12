import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '@/services/AuthService';
import { Ionicons } from '@expo/vector-icons';

const PostCommentManagement = ({ comment, postId, currentUser, onCommentUpdated, onCommentDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isLoading, setIsLoading] = useState(false);

  const canModifyComment = currentUser?.username === comment.user;

  const handleUpdateComment = async () => {
    if (!editedText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.put(`/posts/comment/${postId}/${comment.id}/`, {
        text: editedText.trim()
      });

      if (response.status === 200) {
        onCommentUpdated({ 
          ...comment,
          text: editedText.trim()
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update comment error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update comment'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await api.delete(`/posts/comment/${postId}/${comment.id}/`);

              if (response.status === 204) {
                onCommentDeleted(comment.id);
              }
            } catch (error) {
              console.error('Delete comment error:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete comment'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}>
        <ActivityIndicator size="small" color="#0088cc" />
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 8 }}>
      {isEditing ? (
        <View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12
            }}
            value={editedText}
            onChangeText={setEditedText}
            multiline
            maxLength={500}
            placeholder="Edit your comment..."
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <TouchableOpacity 
              onPress={() => {
                setEditedText(comment.text);
                setIsEditing(false);
              }}
              style={{
                backgroundColor: '#f5f5f5',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#666666' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleUpdateComment}
              style={{
                backgroundColor: '#0088cc',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                opacity: editedText.trim() ? 1 : 0.5
              }}
              disabled={!editedText.trim()}
            >
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#0088cc', fontWeight: '500', marginRight: 8 }}>
                  @{comment.user}
                </Text>
                {canModifyComment && (
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity 
                      onPress={() => setIsEditing(true)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        backgroundColor: '#e6f3fa',
                        padding: 6,
                        borderRadius: 4
                      }}
                    >
                      <Ionicons name="pencil" size={14} color="#0088cc" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={handleDeleteComment}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        backgroundColor: '#fee2e2',
                        padding: 6,
                        borderRadius: 4
                      }}
                    >
                      <Ionicons name="trash" size={14} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={{ color: '#1a1a1a', marginTop: 4 }}>{comment.text}</Text>
            </View>
          </View>
          <Text style={{ color: '#666666', fontSize: 12, marginTop: 4 }}>
            {new Date(comment.created_at).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PostCommentManagement;