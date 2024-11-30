import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import profilePicPlaceholder from '@/assets/images/react-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LikeButton } from '@/components/LikeButton';
import { likeService } from '@/services/LikeService';
import { api } from './services/AuthService';
import Chessboard from 'react-native-chessboard';
import PostCard from '@/components/PostCard';

const PROFILE_PIC_SIZE = 50;
const ZOOMED_PIC_SIZE = Dimensions.get('window').width * 0.8;
const screenWidth = Dimensions.get('window').width;
const boardSize = (screenWidth - 40) * 0.75;

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" />
  </View>
);

const PostListItem = ({ item, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await api.get(`/posts/comments/${item.id}/`);
        setCommentCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        console.error('Failed to fetch comment count:', error);
        setCommentCount(0);
      }
    };

    fetchCommentCount();
  }, [item.id]);

  const loadLikeSummary = async () => {
    try {
      const summary = await likeService.getLikesSummary([item.id]);
      const postSummary = summary.find(s => s.post_id === item.id);
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
      setIsLoading(true);
      await likeService.toggleLike(item.id);
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Like operation failed:', error.message);
      Alert.alert('Error', 'Unable to process your like request.');
    } finally {
      setIsLoading(false);
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

  const renderImage = () => {
    if (!item.post_image || imageError) return null;

    return (
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource(item.post_image)}
          style={styles.postImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate('Thread', { post: item })}
      activeOpacity={0.7}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      {renderImage()}
      <Text style={styles.postContent}>{item.post_text}</Text>
      {item.fen && (
        <View style={styles.chessboardContainer}>
          <Chessboard
            fen={item.fen}
            boardSize={boardSize}
            gestureEnabled={false}
          />
        </View>
      )}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.postAuthor}>by {item.user}</Text>
      <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleDateString()}</Text>

      {/* Wrap LikeButton in a View to prevent touch event propagation */}
      <View onStartShouldSetResponder={() => true}>
        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          onPress={handleLike}
          disabled={isLoading}
        />
      </View>
    </TouchableOpacity>
  );
};

const SearchBar = ({ onSearch }) => {
  const [postId, setPostId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!postId.trim()) {
      Alert.alert('Error', 'Please enter a post ID');
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/posts/${postId}/`);
      onSearch(response.data);
      setPostId('');
    } catch (error) {
      if (error.response?.status === 404) {
        Alert.alert('Not Found', 'No post found with this ID');
      } else {
        Alert.alert('Error', 'Failed to search for post');
      }
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter Post ID..."
        value={postId}
        onChangeText={setPostId}
        keyboardType="numeric"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={isSearching}
      >
        {isSearching ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Feather name="search" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const MainScreen = ({ navigation }) => {
  const { user, loading, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileZoomed, setIsProfileZoomed] = useState(false);
  const sidebarPosition = useRef(new Animated.Value(-250)).current;
  const zoomAnimation = useRef(new Animated.Value(0)).current;
  const [nextPage, setNextPage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearchResult = (searchResult) => {
    if (searchResult) {
      setPosts([searchResult]);
      setNextPage(null);
    }
  };

  const fetchPosts = async (refresh = false) => {
    try {
      setIsLoading(!refresh);
      setRefreshing(refresh);

      const response = await api.get('/posts/list_posts/');
      if (response.data?.results) {
        setPosts(response.data.results);
        setNextPage(response.data.next);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (!nextPage || isLoading) return;

    try {
      const response = await api.get(nextPage);
      if (response.data?.results) {
        setPosts(prevPosts => [...prevPosts, ...response.data.results]);
        setNextPage(response.data.next);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    }
  };

  const handleRefresh = () => fetchPosts(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <LoadingScreen />;

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -250 : 0;
    Animated.timing(sidebarPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileZoom = () => {
    setIsProfileZoomed(!isProfileZoomed);
    Animated.timing(zoomAnimation, {
      toValue: isProfileZoomed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderSidebar = () => (
    <>
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: sidebarPosition.interpolate({
                inputRange: [-250, 0],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sidebar, { left: sidebarPosition }]}>
        <View style={styles.sidebarContent}>
          <View style={styles.userProfileContainer}>
            <TouchableOpacity onPress={toggleProfileZoom}>
              <Image source={profilePicPlaceholder} style={styles.profilePicture} />
            </TouchableOpacity>
            <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          </View>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate('Analysis', { pgn: null });
            }}
          >
            <Text style={styles.sidebarText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => {
            toggleSidebar();
            navigation.navigate('Puzzles');
          }}>
            <Text style={styles.sidebarText}>Puzzles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => console.log('Community')}>
            <Text style={styles.sidebarText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate('Archive');
            }}
          >
            <Text style={styles.sidebarText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sidebarItem, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chess Forum</Text>
        <SearchBar onSearch={handleSearchResult} />
      </View>

      {isSidebarOpen && renderSidebar()}

      <Modal
        transparent={true}
        visible={isProfileZoomed}
        onRequestClose={toggleProfileZoom}
      >
        <BlurView intensity={100} style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback onPress={toggleProfileZoom}>
            <View style={styles.zoomedProfileContainer}>
              <Animated.Image
                source={profilePicPlaceholder}
                style={[
                  styles.zoomedProfilePicture,
                  {
                    width: zoomAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [PROFILE_PIC_SIZE, ZOOMED_PIC_SIZE],
                    }),
                    height: zoomAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [PROFILE_PIC_SIZE, ZOOMED_PIC_SIZE],
                    }),
                  },
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </Modal>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            nextPage && <ActivityIndicator style={{ padding: 16 }} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Feather name="edit-2" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  menuButton: {
    padding: 8,
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postItem: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    marginVertical: 8,
  },
  postAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chessboardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 2,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 16,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePicture: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2,
  },
  username: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sidebarText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  zoomedProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedProfilePicture: {
    borderRadius: ZOOMED_PIC_SIZE / 2,
  },
  createPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    width: 120,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  imageContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
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
});

export default MainScreen;