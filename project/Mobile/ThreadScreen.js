import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Chessboard from 'react-native-chessboard';
import { LikeButton } from '@/components/LikeButton';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/AuthService';
import { likeService } from '@/services/LikeService';

const Comment = ({ comment }) => {
    return (
        <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>@{comment.user}</Text>
                <Text style={styles.commentTime}>
                    {new Date(comment.created_at).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
        </View>
    );
};

const ThreadScreen = ({ route, navigation }) => {
    const { post } = route.params;
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const { user } = useAuth();

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

    const fetchComments = async () => {
        try {
            setIsLoadingComments(true);
            const response = await api.get(`/posts/comments/${post.id}/`);
            
            if (Array.isArray(response.data)) {
                setComments(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            Alert.alert(
                'Error',
                'Failed to load comments. Please try again later.'
            );
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
                text: newComment.trim()
            });

            if (response.status === 201) {
                setNewComment('');
                await fetchComments();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to post comment. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
        loadLikeSummary();
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
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
            },
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: '600',
            },
            headerTitleContainerStyle: {
                width: '70%',
            },
            headerTitleAlign: 'center',
        });
    }, [navigation, post.title]);

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView style={styles.content}>
                    <View style={styles.postContainer}>
                        <View style={styles.postHeader}>
                            <Text style={styles.postAuthor}>{post.user}</Text>
                            <Text style={styles.postTime}>
                                {new Date(post.created_at).toLocaleDateString()}
                            </Text>
                        </View>

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

                        <LikeButton
                            isLiked={isLiked}
                            likeCount={likeCount}
                            onPress={handleLike}
                            disabled={isLikeLoading}
                        />
                    </View>

                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsHeader}>
                            Comments ({comments.length})
                        </Text>
                        {isLoadingComments ? (
                            <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    postContainer: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 8,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    postAuthor: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postTime: {
        color: '#666',
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
    commentsSection: {
        backgroundColor: 'white',
        padding: 16,
    },
    commentsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    commentContainer: {
        marginBottom: 16,
        borderLeftWidth: 2,
        borderLeftColor: '#007AFF',
        paddingLeft: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    commentAuthor: {
        fontWeight: '600',
    },
    commentTime: {
        color: '#666',
        fontSize: 12,
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
    },
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
        paddingRight: 40,
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
    loadingIndicator: {
        padding: 20,
    },
    noCommentsText: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
});

export default ThreadScreen;