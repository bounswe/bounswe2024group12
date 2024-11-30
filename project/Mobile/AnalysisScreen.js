import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PgnViewer } from './components/PgnViewer';
import { api } from './services/AuthService';
import LoadPgnModal from './components/LoadPgnModal';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const CommentView = ({ comment }) => (
  <View style={styles.commentContainer}>
    <View style={styles.commentHeader}>
      <Text style={styles.commentUser}>@{comment.user}</Text>
      <Text style={styles.commentTime}>
        {new Date(comment.created_at).toLocaleDateString()}
      </Text>
    </View>
    <Text style={styles.commentText}>{comment.comment_text}</Text>
  </View>
);

const PositionStats = ({ data }) => {
  if (!data) return null;

  const total = data.white + data.draws + data.black;
  const whitePercentage = ((data.white / total) * 100).toFixed(1);
  const drawsPercentage = ((data.draws / total) * 100).toFixed(1);
  const blackPercentage = ((data.black / total) * 100).toFixed(1);
  
  return (
    <View style={styles.statsSection}>
      <Text style={styles.statsHeader}>Position Statistics</Text>
      <View style={styles.resultsContainer}>
        <View style={styles.resultItem}>
          <Text style={styles.resultPercentage}>{whitePercentage}%</Text>
          <Text style={styles.resultLabel}>White</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultPercentage}>{drawsPercentage}%</Text>
          <Text style={styles.resultLabel}>Draws</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultPercentage}>{blackPercentage}%</Text>
          <Text style={styles.resultLabel}>Black</Text>
        </View>
      </View>

      <Text style={styles.movesHeader}>Popular Moves</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movesScroll}>
        {data.moves?.slice(0, 5).map((move, index) => (
          <View key={move.san} style={styles.moveCard}>
            <Text style={styles.moveSan}>{move.san}</Text>
            <Text style={styles.moveGames}>
              {((move.white + move.draws + move.black) / total * 100).toFixed(1)}% games
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const AnalysisScreen = ({ route, navigation }) => {
  const [currentFen, setCurrentFen] = useState(INITIAL_FEN);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [positionStats, setPositionStats] = useState(null);
  const [isLoadPgnModalVisible, setIsLoadPgnModalVisible] = useState(false);
  const exploredPositions = useRef(new Map());
  const scrollViewRef = useRef(null);

  const pgn = route?.params?.pgn;
  const gameId = route?.params?.gameId;

  useEffect(() => {
    const keyboardWillShow = (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const keyboardWillHide = () => setKeyboardHeight(0);

    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: pgn ? 'Game Analysis' : 'Analysis Board',
      headerLeft: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => setIsLoadPgnModalVisible(true)}>
          <Feather name="upload" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, pgn]);

  useEffect(() => {
    if (gameId) fetchComments();
  }, [gameId]);

  useEffect(() => {
    if (currentFen) {
      const savedStats = exploredPositions.current.get(currentFen);
      setPositionStats(savedStats || null);
    } else {
      setPositionStats(null);
    }
  }, [currentFen]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/games/${gameId}/comments/`);
      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

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
        fetchComments();
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositionUpdate = (fen) => {
    setCurrentFen(fen);
  };

  const handleExploreGames = async () => {
    if (!currentFen) {
      Alert.alert('Error', 'No position selected');
      return;
    }

    try {
      setIsLoadingSimilar(true);
      const response = await api.get('/games/explore/', {
        params: {
          fen: currentFen,
          since: 2000
        }
      });

      if (response.data) {
        exploredPositions.current.set(currentFen, response.data);
        setPositionStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching position data:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load position data');
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  const positionComments = comments.filter(
    comment => comment.position_fen === currentFen
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView style={styles.mainScroll} bounces={false} ref={scrollViewRef}>
          <View style={styles.mainContent}>
            <PgnViewer
              pgn={pgn || '1. '}
              darkSquareColor="#769656"
              lightSquareColor="#eeeed2"
              onPositionChange={handlePositionUpdate}
              initialFen={INITIAL_FEN}
            />

            {positionStats && <PositionStats data={positionStats} />}

            <TouchableOpacity
              style={[
                styles.exploreButton,
                (!currentFen || isLoadingSimilar || exploredPositions.current.has(currentFen)) && 
                styles.disabledButton
              ]}
              onPress={handleExploreGames}
              disabled={!currentFen || isLoadingSimilar || exploredPositions.current.has(currentFen)}
            >
              {isLoadingSimilar ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Feather name="compass" size={20} color="white" style={styles.exploreIcon} />
                  <Text style={styles.exploreButtonText}>
                    {exploredPositions.current.has(currentFen) 
                      ? 'Position explored'
                      : 'Explore this position'
                    }
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {gameId && (
              <View style={styles.commentsSection}>
                <Text style={styles.commentsHeader}>
                  Position Comments ({positionComments?.length || 0})
                </Text>

                {isLoading ? (
                  <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                ) : (
                  <View style={styles.commentsList}>
                    {positionComments?.length > 0 ? (
                      positionComments.map((comment) => (
                        <CommentView key={comment.id} comment={comment} />
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>
                        No comments for this position
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {gameId && (
          <View style={styles.inputContainer}>
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
          </View>
        )}

        {isLoadPgnModalVisible && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isLoadPgnModalVisible}
            onRequestClose={() => setIsLoadPgnModalVisible(false)}
          >
            <BlurView intensity={100} style={StyleSheet.absoluteFill}>
              <View style={styles.modalContainer}>
                <LoadPgnModal
                  onLoadPgn={(newPgn) => {
                    navigation.setParams({ pgn: newPgn });
                    setIsLoadPgnModalVisible(false);
                  }}
                />
              </View>
            </BlurView>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
  },
  commentsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    marginTop: 16,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentsList: {
    paddingBottom: 16,
  },
  commentContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: '600',
    color: '#007AFF',
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
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
  exploreButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exploreIcon: {
    marginRight: 8,
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    padding: 16,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultPercentage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  movesHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  movesScroll: {
    flexGrow: 0,
  },
  moveCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  moveSan: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moveGames: {
    fontSize: 12,
    color: '#666',
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exploreIcon: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default AnalysisScreen;