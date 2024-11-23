
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Chessboard from 'react-native-chessboard';
import { LikeButton } from '@/components/LikeButton';
import { useAuth } from '@/contexts/AuthContext';

const Comment = ({ comment }) => (
    <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{comment.user}</Text>
            <Text style={styles.commentTime}>
                {new Date(comment.created_at).toLocaleDateString()}
            </Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
    </View>
);

const ThreadScreen = ({ route, navigation }) => {
    const { post } = route.params;
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

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

    // Dummy comments data
    const [comments] = useState([
        {
            id: 1,
            user: 'GrandMaster42',
            text: 'Interesting position! Have you considered Nf3 instead?',
            created_at: new Date(2024, 10, 15),
        },
        {
            id: 2,
            user: 'ChessLover99',
            text: 'The queenside weakness could be exploited with a timely b5 break.',
            created_at: new Date(2024, 10, 16),
        },
        {
            id: 3,
            user: 'TacticalWizard',
            text: 'I played a similar position last week. The key is to maintain tension in the center.',
            created_at: new Date(2024, 10, 17),
        },
    ]);

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

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setNewComment('');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView style={styles.content}>
                    {/* Original Post */}
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
                            isLiked={false}
                            likeCount={post.likes_count || 0}
                            onPress={() => { }}
                            disabled={false}
                        />
                    </View>

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsHeader}>
                            Comments ({comments.length})
                        </Text>
                        {comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </View>
                </ScrollView>

                {/* Comment Input */}
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
});

export default ThreadScreen;