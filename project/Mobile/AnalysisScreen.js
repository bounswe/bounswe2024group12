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
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PgnViewer } from './components/PgnViewer';
import { api } from './services/AuthService';
import { GameInfo } from './components/GameInfo';

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

const AnalysisScreen = ({ route, navigation }) => {
  const [currentFen, setCurrentFen] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [evalData, setEvalData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(null);
  const scrollViewRef = useRef(null);

  const pgn = route?.params?.pgn || DEFAULT_PGN;
  const gameId = route?.params?.gameId;

  useEffect(() => {
    const keyboardWillShow = (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
    };

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      keyboardWillShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      keyboardWillHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Game Analysis',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (gameId) {
      fetchComments();
    }
  }, [gameId]);

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

  const handleEvaluate = async () => {
    if (!currentFen) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(currentFen)}`);

      if (!response.ok) {
        throw new Error('Evaluation not available');
      }

      const data = await response.json();
      setEvalData(data);
    } catch (err) {
      setEvalError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getPieceType = (from, fen) => {
    // Parse FEN to get piece positions
    const position = fen.split(' ')[0];
    const rows = position.split('/');

    // Convert file and rank to array indices
    const file = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(from[1]);

    // Find the piece at the given square
    let currentRow = rows[rank];
    let currentFile = 0;

    for (let i = 0; i < currentRow.length; i++) {
      if (isNaN(currentRow[i])) {
        if (currentFile === file) {
          // Map piece to notation
          const pieceMap = {
            'R': 'R', 'N': 'N', 'B': 'B', 'Q': 'Q', 'K': 'K',
            'r': 'R', 'n': 'N', 'b': 'B', 'q': 'Q', 'k': 'K'
          };
          return pieceMap[currentRow[i]] || '';
        }
        currentFile++;
      } else {
        currentFile += parseInt(currentRow[i]);
      }
    }
    return ''; // Return empty for pawns
  };

  const convertToSAN = (move, fen) => {
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    const pieceType = getPieceType(from, fen);

    return pieceType + to;
  };

  const getSuggestedMove = (eval_data, fen) => {
    if (!eval_data?.pvs?.[0]?.moves) return '';
    const moves = eval_data.pvs[0].moves.split(' ');
    const firstMove = moves[0];
    return convertToSAN(firstMove, fen);
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
            <View style={styles.boardSection}>
              <PgnViewer
                pgn={pgn}
                darkSquareColor="#769656"
                lightSquareColor="#eeeed2"
                onPositionChange={handlePositionUpdate}
              />
            </View>

            <GameInfo pgn={pgn} />

            <View style={styles.evaluationSection}>
              <View style={styles.evaluationHeader}>
                <Text style={styles.sectionTitle}>Position Evaluation</Text>
                <TouchableOpacity
                  style={[
                    styles.evaluateButton,
                    isEvaluating && styles.evaluateButtonDisabled
                  ]}
                  onPress={handleEvaluate}
                  disabled={isEvaluating}
                >
                  {isEvaluating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Feather name="cloud" size={16} style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Evaluate</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {evalData && (
                <View style={styles.evaluationResult}>
                  <Text style={styles.evaluationLine}>
                    Suggested move: {getSuggestedMove(evalData, currentFen)}
                  </Text>
                </View>
              )}

              {evalError && (
                <Text style={styles.errorText}>{evalError}</Text>
              )}
            </View>

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
          </View>
        </ScrollView>

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
  boardSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    padding: 8,
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
  gameInfoSection: {
    margin: 8,
    marginTop: 16,
  },
  evaluationSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  evaluateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  evaluateButtonDisabled: {
    backgroundColor: '#999',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  evaluationResult: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  evaluationText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ff3b30',
  },
  evaluationResult: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 8,
  },
  evaluationStats: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  evaluationLine: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AnalysisScreen;