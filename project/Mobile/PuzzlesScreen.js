import React, { useState, useEffect } from 'react';
import {
    Modal,
    Clipboard,
    Alert,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Chessboard from 'react-native-chessboard';
import { Dimensions } from 'react-native';
import { Chess } from 'chess.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "./services/AuthService";

const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth - 40;

const PuzzlesScreen = ({ navigation }) => {
    const [puzzle, setPuzzle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [puzzlePosition, setPuzzlePosition] = useState(null);
    const [showFenModal, setShowFenModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Daily Puzzle',
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

    const handleCopyFen = async () => {
        try {
            await Clipboard.setString(puzzlePosition);
            setShowFenModal(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Failed to copy FEN:', error);
            Alert.alert('Error', 'Failed to copy position');
        }
    };

    const getPuzzlePosition = (pgn, plyCount) => {
        const chess = new Chess();
        chess.loadPgn(pgn);
        const moves = chess.history();
        chess.reset();
        for (let i = 0; i <= plyCount; i++) {
            chess.move(moves[i]);
        }
        return chess.fen();
    };

    const savePuzzle = async (puzzleData, position) => {
        try {
            await AsyncStorage.setItem('lastPuzzle', JSON.stringify({
                puzzle: puzzleData,
                position: position,
                timestamp: new Date().toISOString(),
            }));
        } catch (error) {
            console.error('Failed to save puzzle:', error);
        }
    };

    const loadSavedPuzzle = async () => {
        try {
            const savedData = await AsyncStorage.getItem('lastPuzzle');
            if (savedData) {
                const { puzzle: savedPuzzle, position, timestamp } = JSON.parse(savedData);
                
                const savedDate = new Date(timestamp).toDateString();
                const currentDate = new Date().toDateString();
                if (savedDate !== currentDate) {
                    return false;
                }
                
                setPuzzle(savedPuzzle);
                setPuzzlePosition(position);
                setLoading(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load saved puzzle:', error);
            return false;
        }
    };

    const fetchPuzzle = async (endpoint, params = {}) => {
        setLoading(true);
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;
            
            const response = await api.get(url);
            const data = response.data;
            
            if (!data.game?.pgn || !data.puzzle?.initialPly) {
                throw new Error('Invalid puzzle data structure');
            }
            
            setPuzzle(data.puzzle);
            const position = getPuzzlePosition(data.game.pgn, data.puzzle.initialPly);
            setPuzzlePosition(position);
            savePuzzle(data.puzzle, position);
        } catch (error) {
            console.error('Failed to fetch puzzle:', error);
            Alert.alert(
                'Error',
                'Failed to load puzzle. Please try again later.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializePuzzle = async () => {
            const hasSavedPuzzle = await loadSavedPuzzle();
            if (!hasSavedPuzzle) {
                fetchPuzzle('/puzzle/daily/');
            }
        };
        initializePuzzle();
    }, []);

    const getNextPuzzle = () => {
        fetchPuzzle('/puzzle/random/');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const colorToMove = puzzlePosition?.split(' ')[1] === 'w' ? 'White' : 'Black';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} bounces={false}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.rating}>Rating: {puzzle?.rating || 'N/A'}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.boardContainer}
                        onPress={() => setShowFenModal(true)}
                    >
                        <Chessboard
                            fen={puzzlePosition}
                            boardSize={boardSize}
                            gestureEnabled={false}
                        />
                    </TouchableOpacity>

                    <View style={styles.infoCard}>
                        <View style={styles.turnIndicator}>
                            <View style={[styles.colorDot, { backgroundColor: colorToMove === 'White' ? '#fff' : '#000' }]} />
                            <Text style={styles.turnText}>{colorToMove} to move</Text>
                        </View>

                        <View style={styles.themesContainer}>
                            <Text style={styles.themesTitle}>THEMES</Text>
                            <View style={styles.themesList}>
                                {puzzle?.themes?.map((theme, index) => (
                                    <View key={index} style={styles.themeTag}>
                                        <Text style={styles.themeText}>
                                            {theme.split(/(?=[A-Z])/).join(' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={getNextPuzzle}
                    >
                        <Text style={styles.nextButtonText}>Get New Puzzle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
                            <Text style={styles.modalTitle}>Position (FEN)</Text>
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
                            <Text style={styles.fenText}>{puzzlePosition}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={handleCopyFen}
                        >
                            <Feather name="copy" size={20} color="white" />
                            <Text style={styles.copyButtonText}>Copy Position</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {showToast && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>Position copied to clipboard</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rating: {
        fontSize: 18,
        color: '#666',
    },
    boardContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    turnIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    turnText: {
        fontSize: 16,
        fontWeight: '600',
    },
    themesContainer: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
    },
    themesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    themesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    themeTag: {
        backgroundColor: '#007AFF20',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    themeText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
        width: '90%',
        maxWidth: 400,
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
    },
    closeButton: {
        padding: 4,
    },
    fenContainer: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    fenText: {
        fontSize: 14,
        color: '#333',
    },
    copyButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    copyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    toast: {
        position: 'absolute',
        bottom: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
    },
    toastText: {
        color: 'white',
        fontSize: 14,
    },
    headerButton: {
        padding: 12,
    }
});

export default PuzzlesScreen;