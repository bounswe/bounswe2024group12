import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export function LikeButton({ isLiked, likeCount, onPress, disabled }) {
  return (
    <TouchableOpacity 
      style={[styles.likeContainer, disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <FontAwesome 
        name={isLiked ? "heart" : "heart-o"}
        size={24} 
        color={isLiked ? "#FF3B30" : "#666"}
        style={styles.icon}
      />
      <Text style={styles.likeCount}>{likeCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 4,
  },
  icon: {
    marginRight: 8,
  },
  likeCount: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});