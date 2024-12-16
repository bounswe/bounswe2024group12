import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Modal,
    Clipboard,
    Platform,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LikeButton } from '@/components/LikeButton';
import { likeService } from '@/services/LikeService';
import { useNavigation } from '@react-navigation/native';
import Chessboard from 'react-native-chessboard';

const normalizeFen = (fen) => {
    if (!fen) return null;
    const isPositionOnly = fen.split(' ').length === 1;
    return isPositionOnly ? `${fen} w KQkq - 0 1` : fen;
};

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

const PostCard = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showFenModal, setShowFenModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        loadLikeSummary();
        likeService.addLikeChangeListener(loadLikeSummary);
        return () => {
            likeService.removeLikeChangeListener(loadLikeSummary);
        };
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

    const handleCopyFen = async () => {
        try {
            await Clipboard.setString(post.fen);
            setShowFenModal(false);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy FEN:', error);
            Alert.alert('Error', 'Failed to copy FEN notation');
        }
    };

    const Toast = () => (
        showToast && (
            <View style={styles.toastContainer}>
                <View style={styles.toast}>
                    <Feather name="check" size={16} color="white" />
                    <Text style={styles.toastText}>Copied!</Text>
                </View>
            </View>
        )
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

                    <TouchableOpacity
                        style={styles.fenContainer}
                        onPress={handleCopyFen}
                    >
                        <Text style={styles.fenText}>{post.fen}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.copyButton}
                        onPress={handleCopyFen}
                    >
                        <Feather name="copy" size={20} color="white" />
                        <Text style={styles.copyButtonText}>Copy FEN</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderTags = () => {
        const cleanTags = parseTags(post.tags);
        if (!cleanTags || cleanTags.length === 0) return null;

        return (
            <View style={styles.tagsContainer}>
                {cleanTags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                ))}
            </View>
        );
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

            {renderTags()}

            <View style={styles.footer}>
                <View style={styles.userInfo}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile', {
                            username: post.user,
                            isOtherUser: true
                        })}
                    >
                        <Text style={[styles.byText, styles.clickableText]}>by {post.user}</Text>
                    </TouchableOpacity>
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

            <FenModal />
            <Toast />
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
    chessSection: {
        marginVertical: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    chessboardContainer: {
        alignItems: 'center',
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '85%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    fenContainer: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    fenText: {
        fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace'
        }),
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    copyButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    copyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    toastContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 70,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    toast: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    clickableText: {
        color: '#007AFF',
        textDecorationLine: 'underline',
      },
});

export default PostCard;