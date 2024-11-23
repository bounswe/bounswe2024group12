import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    ActivityIndicator,
    TextInput,
    Alert,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from './services/AuthService';

const { width, height } = Dimensions.get('window');

const FilterButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const ArchiveScreen = () => {
    const navigation = useNavigation();
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('filter'); // 'filter', 'explore', or 'master'
    const [masterGameError, setMasterGameError] = useState('');

    // Filter mode state
    const [filters, setFilters] = useState({
        year: '',
        player: '',
        site: '',
        event: '',
        result: '',
    });

    // Explore mode state
    const [exploreParams, setExploreParams] = useState({
        fen: '',
        play: '',
        since: '',
        until: '',
    });

    // Master game mode state
    const [masterGameId, setMasterGameId] = useState('');
    const [selectedGamePGN, setSelectedGamePGN] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Chess Games',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const validateGameId = (id) => {
        return /^[a-zA-Z0-9]{8}$/.test(id);
    };

    const fetchGames = async () => {
        try {
            setIsLoading(true);
            setMasterGameError('');
            let response;

            if (mode === 'master') {
                if (!masterGameId) {
                    setMasterGameError('Please enter a game ID');
                    return;
                }

                if (!validateGameId(masterGameId)) {
                    setMasterGameError('Game ID must be exactly 8 characters');
                    return;
                }

                try {
                    response = await api.get(`/games/master_game/${masterGameId}`);
                    if (response.data?.pgn) {
                        setSelectedGamePGN(response.data.pgn);
                        setGames([]); // Clear any previous games
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setMasterGameError('Game not found');
                    } else {
                        setMasterGameError('Failed to load game. Please try again.');
                    }
                    return;
                }
            } else if (mode === 'filter') {
                const params = new URLSearchParams();
                if (filters.year) params.append('year', parseInt(filters.year));
                if (filters.player) params.append('player', filters.player);
                if (filters.site) params.append('site', filters.site);
                if (filters.event) params.append('event', filters.event);
                if (filters.result) params.append('result', filters.result);

                response = await api.get(`/games/filter/?${params.toString()}`);
                if (response.data?.games) {
                    setSelectedGamePGN(null);
                    setGames(response.data.games);
                }
            } else if (mode === 'explore') {
                const params = new URLSearchParams();
                if (exploreParams.fen) params.append('fen', exploreParams.fen);
                if (exploreParams.play) params.append('play', exploreParams.play);
                if (exploreParams.since) params.append('since', parseInt(exploreParams.since));
                if (exploreParams.until) params.append('until', parseInt(exploreParams.until));

                response = await api.get(`/games/explore/?${params.toString()}`);
                if (response.data?.data) {
                    setSelectedGamePGN(null);
                    setGames(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            Alert.alert('Error', 'Failed to load games. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGamePress = async (gameId) => {
        try {
            setIsLoading(true);
            const response = await api.get(`/games/master_game/${gameId}`);
            if (response.data?.pgn) {
                setSelectedGamePGN(response.data.pgn);
                setIsModalVisible(true);
            }
        } catch (error) {
            console.error('Error fetching master game:', error);
            Alert.alert(
                'Error',
                error.response?.status === 404
                    ? 'Game not found'
                    : 'Failed to load game details'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const renderFilterInputs = () => (
        <View style={styles.filterInputsContainer}>
            <TextInput
                style={styles.input}
                placeholder="Player surname"
                placeholderTextColor="#666"
                value={filters.player}
                onChangeText={(text) => setFilters(prev => ({ ...prev, player: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Year"
                placeholderTextColor="#666"
                value={filters.year}
                onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setFilters(prev => ({ ...prev, year: numericText }));
                }}
                keyboardType="numeric"
                maxLength={4}
            />
            <TextInput
                style={styles.input}
                placeholder="Event"
                placeholderTextColor="#666"
                value={filters.event}
                onChangeText={(text) => setFilters(prev => ({ ...prev, event: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Site"
                placeholderTextColor="#666"
                value={filters.site}
                onChangeText={(text) => setFilters(prev => ({ ...prev, site: text }))}
            />
            <View style={styles.resultButtons}>
                <FilterButton
                    title="1-0"
                    isActive={filters.result === '1-0'}
                    onPress={() => setFilters(prev => ({ ...prev, result: '1-0' }))}
                />
                <FilterButton
                    title="0-1"
                    isActive={filters.result === '0-1'}
                    onPress={() => setFilters(prev => ({ ...prev, result: '0-1' }))}
                />
                <FilterButton
                    title="½-½"
                    isActive={filters.result === '1/2-1/2'}
                    onPress={() => setFilters(prev => ({ ...prev, result: '1/2-1/2' }))}
                />
            </View>
        </View>
    );

    const renderExploreInputs = () => (
        <View style={styles.filterInputsContainer}>
            <TextInput
                style={styles.input}
                placeholder="FEN (optional)"
                placeholderTextColor="#666"
                value={exploreParams.fen}
                onChangeText={(text) => setExploreParams(prev => ({ ...prev, fen: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Moves in UCI notation (optional)"
                placeholderTextColor="#666"
                value={exploreParams.play}
                onChangeText={(text) => setExploreParams(prev => ({ ...prev, play: text }))}
            />
            <View style={styles.yearRange}>
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Since year"
                    placeholderTextColor="#666"
                    value={exploreParams.since}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setExploreParams(prev => ({ ...prev, since: numericText }));
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                />
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Until year"
                    placeholderTextColor="#666"
                    value={exploreParams.until}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setExploreParams(prev => ({ ...prev, until: numericText }));
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                />
            </View>
        </View>
    );

    const renderMasterGameInput = () => (
        <View style={styles.filterInputsContainer}>
            <TextInput
                style={[
                    styles.input,
                    masterGameError ? styles.inputError : null
                ]}
                placeholder="Enter 8-character Game ID"
                placeholderTextColor="#666"
                value={masterGameId}
                onChangeText={(text) => {
                    setMasterGameId(text.trim());
                    setMasterGameError('');
                }}
                maxLength={8}
                autoCapitalize="none"
            />
            {masterGameError ? (
                <Text style={styles.errorText}>{masterGameError}</Text>
            ) : (
                <Text style={styles.helperText}>
                    Enter the 8-character ID of a master game to view its PGN notation
                </Text>
            )}
        </View>
    );

    const renderGameList = () => {
        if (mode === 'master' && selectedGamePGN) {
            return (
                <View style={styles.pgnOuterContainer}>
                    <ScrollView 
                        style={styles.pgnScrollContainer}
                        contentContainerStyle={styles.pgnContentContainer}
                    >
                        <Text style={styles.pgnText}>{selectedGamePGN}</Text>
                    </ScrollView>
                    <TouchableOpacity 
                        style={[styles.searchButton, styles.analyzeButton]}
                        onPress={() => navigation.navigate('Analysis', { pgn: selectedGamePGN })}
                    >
                        <Text style={styles.searchButtonText}>Analyze Game</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={games}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleGamePress(item.id)}>
                        <View style={styles.gameCard}>
                            <View style={styles.gameHeader}>
                                <Text style={styles.gameEvent} numberOfLines={1}>{item.event}</Text>
                                <Text style={styles.gameDate}>
                                    {`${item.year}${item.month ? '.' + item.month : ''}${item.day ? '.' + item.day : ''}`}
                                </Text>
                            </View>
                            <View style={styles.playerInfo}>
                                <Text style={[styles.playerName, item.result === '1-0' && styles.whiteWin]}>
                                    {item.white}
                                </Text>
                                <Text style={styles.vs}>vs</Text>
                                <Text style={[styles.playerName, item.result === '0-1' && styles.blackWin]}>
                                    {item.black}
                                </Text>
                            </View>
                            <View style={styles.gameFooter}>
                                <Text style={styles.gameSite} numberOfLines={1}>{item.site}</Text>
                                <Text style={[
                                    styles.gameResult,
                                    item.result === '1-0' && styles.whiteWin,
                                    item.result === '0-1' && styles.blackWin,
                                    item.result === '1/2-1/2' && styles.draw
                                ]}>
                                    {item.result}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `${item.event}-${item.white}-${item.black}-${index}`}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No games found</Text>
                    </View>
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modeSelector}>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'filter' && styles.modeButtonActive]}
                    onPress={() => {
                        setMode('filter');
                        setGames([]);
                        setSelectedGamePGN(null);
                        setMasterGameError('');
                    }}
                >
                    <Text style={[styles.modeButtonText, mode === 'filter' && styles.modeButtonTextActive]}>
                        Filter
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'explore' && styles.modeButtonActive]}
                    onPress={() => {
                        setMode('explore');
                        setGames([]);
                        setSelectedGamePGN(null);
                        setMasterGameError('');
                    }}
                >
                    <Text style={[styles.modeButtonText, mode === 'explore' && styles.modeButtonTextActive]}>
                        Explore
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'master' && styles.modeButtonActive]}
                    onPress={() => {
                        setMode('master');
                        setGames([]);
                        setSelectedGamePGN(null);
                        setMasterGameError('');
                    }}
                >
                    <Text style={[styles.modeButtonText, mode === 'master' && styles.modeButtonTextActive]}>
                        Master Game
                    </Text>
                </TouchableOpacity>
            </View>

            {mode === 'filter' && renderFilterInputs()}
            {mode === 'explore' && renderExploreInputs()}
            {mode === 'master' && renderMasterGameInput()}

            <TouchableOpacity
                style={styles.searchButton}
                onPress={fetchGames}
            >
                <Text style={styles.searchButtonText}>
                    {mode === 'master' ? 'Load Game' : 'Search Games'}
                </Text>
            </TouchableOpacity>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                renderGameList()
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    modeSelector: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modeButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 4,
        backgroundColor: '#f0f0f0',
    },
    modeButtonActive: {
        backgroundColor: '#007AFF',
    },
    modeButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    modeButtonTextActive: {
        color: 'white',
    },
    filterInputsContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 12,
        color: '#333',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 8,
    },
    yearRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    resultButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#007AFF',
        backgroundColor: 'white',
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: 'white',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    analyzeButton: {
        marginTop: 16,
        marginHorizontal: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 8,
    },
    gameCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    gameEvent: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
        color: '#333',
    },
    gameDate: {
        color: '#666',
        fontSize: 14,
    },
    playerInfo: {
        marginVertical: 8,
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
    },
    playerName: {
        fontSize: 15,
        marginBottom: 4,
        fontWeight: '500',
        color: '#333',
    },
    vs: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 4,
        fontSize: 12,
    },
    gameFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    gameSite: {
        color: '#666',
        fontSize: 13,
        flex: 1,
        marginRight: 8,
    },
    gameResult: {
        fontWeight: '600',
        fontSize: 14,
    },
    whiteWin: {
        color: '#4CAF50',
    },
    blackWin: {
        color: '#f44436',
    },
    draw: {
        color: '#2196F3',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    helperText: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    pgnContainer: {
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        maxHeight: height * 0.6,
    },
    pgnOuterContainer: {
        flex: 1,
        margin: 16,
    },
    pgnScrollContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        maxHeight: height * 0.6,
    },
    pgnContentContainer: {
        padding: 16,
    },
    pgnText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    analyzeButton: {
        marginTop: 16,
        marginHorizontal: 0,
    },
});

export default ArchiveScreen;