import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Alert,
  Modal,
  Clipboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Chessboard from "react-native-chessboard";
import { LikeButton } from "@/components/LikeButton";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/AuthService";
import { likeService } from "@/services/LikeService";
import PostCommentManagement from "@/components/PostCommentManagement";
import { bookmarkService } from "./services/BookmarkService";
import PostManagement from './components/PostManagement';

const normalizeFen = (fen) => {
  if (!fen) return null;
  const isPositionOnly = fen.split(" ").length === 1;
  return isPositionOnly ? `${fen} w KQkq - 0 1` : fen;
};

const ThreadScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showFenModal, setShowFenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { user } = useAuth();

  const loadLikeSummary = async () => {
    try {
      const summary = await likeService.getLikesSummary([post.id]);
      const postSummary = summary.find((s) => s.post_id === post.id);
      if (postSummary && !postSummary.error) {
        setIsLiked(postSummary.liked_by_requester);
        setLikeCount(postSummary.like_count);
      }
    } catch (error) {
      console.error("Failed to load like summary:", error);
    }
  };

  const handleLike = async () => {
    try {
      setIsLikeLoading(true);
      await likeService.toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Like operation failed:", error.message);
      Alert.alert("Error", "Unable to process your like request.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await api.get("/accounts/me/");
      if (response.data?.post_bookmarks) {
        const isCurrentPostBookmarked = response.data.post_bookmarks.some(
          (bookmark) => bookmark.post__id === post.id
        );
        setIsBookmarked(isCurrentPostBookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarkLoading(true);
      const response = await api.post(`/posts/bookmark/${post.id}/`);
      await checkBookmarkStatus();
      bookmarkService.notifyBookmarkChange();
    } catch (error) {
      console.error("Bookmark operation failed:", error.message);
      Alert.alert("Error", "Unable to process your bookmark request.");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await api.get(`/posts/comments/${post.id}/`);

      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      Alert.alert("Error", "Failed to load comments. Please try again later.");
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const response = await api.post(`/posts/comment/${post.id}/`, {
        text: newComment.trim(),
      });

      if (response.status === 201) {
        setNewComment("");
        await fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
        "Failed to post comment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleCopyFen = async () => {
    try {
      await Clipboard.setString(post.fen);
      setShowFenModal(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy FEN:", error);
      Alert.alert("Error", "Failed to copy FEN notation");
    }
  };

  useEffect(() => {
    fetchComments();
    loadLikeSummary();
  }, [post.id]);

  useEffect(() => {
    checkBookmarkStatus();
  }, [post.id]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: post.title,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "600",
      },
      headerTitleContainerStyle: {
        width: "70%",
      },
      headerTitleAlign: "center",
    });
  }, [navigation, post.title]);

  const getImageSource = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith("data:image")) {
      return { uri: imageData };
    } else if (imageData.startsWith("http")) {
      return { uri: imageData };
    } else {
      return { uri: `data:image/jpeg;base64,${imageData}` };
    }
  };

  const Toast = () =>
    showToast && (
      <View style={styles.toastContainer}>
        <View style={styles.toast}>
          <Feather name="check" size={16} color="white" />
          <Text style={styles.toastText}>Copied!</Text>
        </View>
      </View>
    );

  const FenModal = () => (
    <Modal
      visible={showFenModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFenModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFenModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>FEN Notation</Text>
            <TouchableOpacity
              onPress={() => setShowFenModal(false)}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fenContainer} onPress={handleCopyFen}>
            <Text style={styles.fenText}>{post.fen}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.copyButton} onPress={handleCopyFen}>
            <Feather name="copy" size={20} color="white" />
            <Text style={styles.copyButtonText}>Copy FEN</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Text style={styles.postAuthor}>{post.user}</Text>
              <Text style={styles.postTime}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>

            <PostManagement
              post={post}
              currentUser={user}
              onPostUpdated={(updatedPost) => {
                navigation.setParams({ post: updatedPost });
              }}
              onPostDeleted={() => {
                navigation.goBack();
              }}
              navigation={navigation}
            />

            {post.post_image && (
              <View style={styles.imageContainer}>
                <Image
                  source={getImageSource(post.post_image)}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <Text style={styles.postContent}>{post.post_text}</Text>

            {post.fen && (
              <TouchableOpacity
                style={styles.chessSection}
                onPress={() => setShowFenModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.chessboardContainer}>
                  <Chessboard
                    fen={normalizeFen(post.fen)}
                    boardSize={250}
                    gestureEnabled={false}
                  />
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.actionButtonsContainer}>
              <LikeButton
                isLiked={isLiked}
                likeCount={likeCount}
                onPress={handleLike}
                disabled={isLikeLoading}
              />
              <TouchableOpacity
                style={[
                  styles.bookmarkButton,
                  isBookmarkLoading && styles.disabledButton,
                ]}
                onPress={handleBookmark}
                disabled={isBookmarkLoading}
              >
                {isBookmarkLoading ? (
                  <ActivityIndicator color="#666" size="small" />
                ) : (
                  <Ionicons
                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={isBookmarked ? "#007AFF" : "#666"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>
              Comments ({comments.length})
            </Text>
            {isLoadingComments ? (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={styles.loadingIndicator}
              />
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <PostCommentManagement
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  currentUser={user}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))
            ) : (
              <Text style={styles.noCommentsText}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            multiline
            maxLength={500}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!newComment.trim() || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Feather name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <FenModal />
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  headerButton: {
    padding: 12,
  },
  content: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postTime: {
    color: "#666",
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  imageContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  chessSection: {
    marginVertical: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chessboardContainer: {
    alignItems: "center",
  },
  commentsSection: {
    backgroundColor: "white",
    padding: 16,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loadingIndicator: {
    padding: 20,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  fenContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  fenText: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
    }),
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  copyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  copyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toastContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "none",
  },
  toast: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    marginRight: 8,
    minHeight: 36,
  },
  likeButtonContainer: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    margin: 4,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ThreadScreen;
