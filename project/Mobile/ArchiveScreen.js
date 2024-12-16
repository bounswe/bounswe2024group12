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
    Dimensions,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { api } from './services/AuthService';
import { useAuth } from './contexts/AuthContext';
import GameCard from './components/GameCard';

const screenWidth = Dimensions.get('window').width;

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

const GameSummary = ({ pgn, onAnalyze }) => {
    const getGameDetails = (pgn) => ({
        event: pgn.match(/\[Event "(.*?)"\]/)?.[1] || 'Unknown Event',
        site: pgn.match(/\[Site "(.*?)"\]/)?.[1] || 'Unknown Site',
        date: pgn.match(/\[Date "(.*?)"\]/)?.[1] || 'Unknown Date',
        white: pgn.match(/\[White "(.*?)"\]/)?.[1] || 'Unknown White',
        black: pgn.match(/\[Black "(.*?)"\]/)?.[1] || 'Unknown Black',
        result: pgn.match(/\[Result "(.*?)"\]/)?.[1] || 'Unknown Result',
    });

    const details = getGameDetails(pgn);

    return (
        <View style={styles.gameSummaryContainer}>
            <View style={styles.gameSummaryHeader}>
                <Text style={styles.gameSummaryTitle}>Game Found!</Text>
                <Text style={styles.eventText}>{details.event}</Text>
                <Text style={styles.siteText}>{details.site}</Text>
            </View>

            <View style={styles.playersContainer}>
                <Text style={styles.playerText}>{details.white}</Text>
                <Text style={styles.vsText}>vs</Text>
                <Text style={styles.playerText}>{details.black}</Text>
            </View>

            <View style={styles.detailsRow}>
                <Text style={styles.dateText}>{details.date}</Text>
                <Text style={styles.resultText}>{details.result}</Text>
            </View>

            <TouchableOpacity
                style={styles.analyzeButton}
                onPress={() => onAnalyze(pgn)}
            >
                <Text style={styles.analyzeButtonText}>Analyze Game</Text>
            </TouchableOpacity>
        </View>
    );
};

const ArchiveScreen = ({ route, navigation }) => {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(route?.params?.initialMode || 'filter');
    const [masterGameError, setMasterGameError] = useState('');
    const [selectedGamePGN, setSelectedGamePGN] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState({
        year: '',
        player: '',
        site: '',
        event: '',
        result: '',
    });
    const [masterGameId, setMasterGameId] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Chess Games',
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
        if (route?.params?.initialFilters) {
            setMode('filter');
            setFilters(prevFilters => ({
                year: '',
                player: '',
                site: '',
                event: '',
                result: '',
                ...route.params.initialFilters
            }));
        }
    }, [route?.params?.initialFilters]);

    useEffect(() => {
        if (mode === 'filter' && hasSearched) {
            fetchGames();
        }
    }, [filters]);

    const handleGamePress = (game) => {
        navigation.navigate('Analysis', {
            pgn: game.pgn,
            gameId: game.id
        });
    };

    const validateGameId = (id) => {
        return /^[a-zA-Z0-9]{8}$/.test(id);
    };

    const handleAnalyze = (pgn) => {
        navigation.navigate('Analysis', { pgn });
    };

    const fetchGames = async () => {
        if (!user) {
            Alert.alert('Error', 'Please log in to search games');
            return;
        }

        try {
            setIsLoading(true);
            setMasterGameError('');
            setHasSearched(true);
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
                        setGames([]);
                    }
                } catch (error) {
                    setMasterGameError(error.response?.status === 404 ? 'Game not found' : 'Failed to load game. Please try again.');
                    return;
                }
            } else if (mode === 'filter') {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });
                response = await api.get(`/games/filter/?${params.toString()}`);
                if (response.data?.games) {
                    setSelectedGamePGN(null);
                    setGames(response.data.games);
                }
            }
        } catch (error) {
            console.error('Failed to fetch games:', error);
            if (error?.response?.status === 401) {
                Alert.alert('Error', 'Please login to search games');
            } else {
                Alert.alert('Error', 'Failed to load games. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setGames([]);
        setSelectedGamePGN(null);
        setMasterGameError('');
        setHasSearched(false);
    }, [mode]);

    const renderFilterInputs = () => (
        <View style={styles.filterInputsContainer}>
            <TextInput
                style={styles.input}
                placeholder="Player surname"
                value={filters.player}
                onChangeText={(text) => setFilters(prev => ({ ...prev, player: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Year"
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
                value={filters.event}
                onChangeText={(text) => setFilters(prev => ({ ...prev, event: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Site"
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

    const renderMasterGameInput = () => (
        <View style={styles.masterGameContainer}>
            <TextInput
                style={[styles.input, masterGameError && styles.inputError]}
                placeholder="Enter 8-character Game ID"
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

    const renderGameContent = () => {
        if (mode === 'master' && selectedGamePGN) {
          return (
            <View style={styles.masterGameContent}>
              <GameSummary
                pgn={selectedGamePGN}
                onAnalyze={handleAnalyze}
              />
            </View>
          );
        }

        return (
          <View style={styles.gamesListContainer}>
            {games.map((game, index) => (
              <GameCard
                key={`${game.event}-${game.white}-${game.black}-${index}`}
                game={game}
                onPress={handleGamePress}
                disabled={isLoading}
              />
            ))}
            {hasSearched && games.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No games found</Text>
              </View>
            )}
          </View>
        );
      };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.modeSelector}>
                    {['filter', 'master'].map((modeOption) => (
                        <TouchableOpacity
                            key={modeOption}
                            style={[styles.modeButton, mode === modeOption && styles.modeButtonActive]}
                            onPress={() => {
                                setMode(modeOption);
                                setGames([]);
                                setSelectedGamePGN(null);
                                setMasterGameError('');
                                setHasSearched(false);
                            }}
                        >
                            <Text style={[styles.modeButtonText, mode === modeOption && styles.modeButtonTextActive]}>
                                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                                {modeOption === 'master' ? ' Game' : ''}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {mode === 'filter' && renderFilterInputs()}
                {mode === 'master' && renderMasterGameInput()}

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                        setHasSearched(true);
                        fetchGames();
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.searchButtonText}>
                            {mode === 'master' ? 'Load Game' : 'Search Games'}
                        </Text>
                    )}
                </TouchableOpacity>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : (
                    renderGameContent()
                )}
            </ScrollView>
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
    masterGameContainer: {
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
        textAlign: 'center',
    },
    helperText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    filterInputsContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameCard: {
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
    resultButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    gameSummaryContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gameSummaryHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    gameSummaryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    eventText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    siteText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    playersContainer: {
        marginVertical: 16,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    playerText: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginVertical: 4,
    },
    vsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    resultText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    analyzeButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    analyzeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    masterGameScroll: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    masterGameScrollContent: {
        padding: 16,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    gamesListContainer: {
        paddingBottom: 16,
    },
    masterGameContent: {
        paddingBottom: 16,
    }
});

export default ArchiveScreen;