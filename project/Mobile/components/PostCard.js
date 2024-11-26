import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LikeButton } from '@/components/LikeButton';
import { likeService } from '@/services/LikeService';
import { useNavigation } from '@react-navigation/native';
import Chessboard from 'react-native-chessboard';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadLikeSummary();
  }, [post.id]);

  const loadLikeSummary = async () => {
    try {
      const summary = await likeService.getLikesSummary([post.id]);
      const postSummary = summary.find(s => s.post_id === post.id);
      if (postSummary && !postSummary.error) {
        setIsLiked(postSummary.liked_by_requester);
        setLikeCount(postSummary.like_count);
      }
    } catch (error) {
      console.error('Failed to load like summary:', error);
    }
  };

  const handleLike = async () => {
    try {
      setIsLikeLoading(true);
      await likeService.toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Like operation failed:', error.message);
      Alert.alert('Error', 'Unable to process your like request.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const getImageSource = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith('data:image')) {
      return { uri: imageData };
    } else if (imageData.startsWith('http')) {
      return { uri: imageData };
    } else {
      return { uri: `data:image/jpeg;base64,${imageData}` };
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('Thread', { post })}
    >
      <Text style={styles.title}>{post.title}</Text>
      
      {post.post_image && (
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(post.post_image)}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      )}

      {post.post_text && (
        <Text style={styles.content} numberOfLines={3}>
          {post.post_text}
        </Text>
      )}

      {post.fen && (
        <View style={styles.chessboardContainer}>
          <Chessboard
            fen={post.fen}
            boardSize={250}
            gestureEnabled={false}
          />
        </View>
      )}

      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Text style={styles.byText}>by {post.user}</Text>
          <Text style={styles.date}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View onStartShouldSetResponder={() => true}>
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            onPress={handleLike}
            disabled={isLikeLoading}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  imageContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  chessboardContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  userInfo: {
    flex: 1,
  },
  byText: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  }
});

export default PostCard;