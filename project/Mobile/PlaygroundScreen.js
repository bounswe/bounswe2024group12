import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Chessboard from 'react-native-chessboard';
import { Chess } from 'chess.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth - 32;
const STORAGE_KEY = 'chess_game_state';
const SHOW_SELECTION_KEY = 'chess_show_selection';

const PlaygroundScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [gameScreen, setGameScreen] = useState('selection');
  const [fenInput, setFenInput] = useState('');
  const [position, setPosition] = useState('start');
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState([]);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const gameRef = useRef(new Chess());

  const formatMoveHistory = (history) => {
    const formattedMoves = [];
    for (let i = 0; i < history.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      formattedMoves.push({
        moveNumber,
        white: history[i],
        black: history[i + 1] || ''
      });
    }
    return formattedMoves;
  };

  const updateGameState = () => {
    const moves = gameRef.current.history();
    const formattedHistory = formatMoveHistory(moves);
    setMoveHistory(formattedHistory);
    setPosition(gameRef.current.fen());
    setIsWhiteTurn(gameRef.current.turn() === 'w');
  };

  useEffect(() => {
    const loadInitialState = async () => {
      if (!hasLoadedState) {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        const showSelection = await AsyncStorage.getItem(SHOW_SELECTION_KEY);
        
        if (savedState) {
          const { fen, history, isWhiteTurn: savedTurn } = JSON.parse(savedState);
          if (fen) {
            gameRef.current = new Chess(fen);
            setPosition(fen);
            setMoveHistory(history || []);
            setIsWhiteTurn(savedTurn);
            setHasSavedGame(true);
          }
        }
        
        if (showSelection === 'false') {
          setGameScreen('game');
        }
        
        setHasLoadedState(true);
      }
    };

    if (isFocused) {
      loadInitialState();
    }
  }, [isFocused, hasLoadedState]);

  const saveGameState = async () => {
    try {
      const gameState = {
        fen: gameRef.current.fen(),
        history: moveHistory || [],
        isWhiteTurn: isWhiteTurn
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      await AsyncStorage.setItem(SHOW_SELECTION_KEY, 'false');
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  };

  const handleStartNormalGame = () => {
    gameRef.current = new Chess();
    updateGameState();
    setGameScreen('game');
    saveGameState();
  };

  const handleContinueGame = () => {
    setGameScreen('game');
    saveGameState();
  };

  const handleStartFromPosition = () => {
    try {
      const newGame = new Chess(fenInput);
      gameRef.current = newGame;
      updateGameState();
      setGameScreen('game');
      saveGameState();
    } catch (e) {
      Alert.alert(
        'Invalid Position',
        'The provided position is invalid. Please check the FEN notation.',
        [{ text: 'OK' }]
      );
    }
  };

  const onMove = useCallback(
    ({ from, to }) => {
      try {
        const move = gameRef.current.move({
          from,
          to,
          promotion: 'q'
        });

        if (move) {
          updateGameState();
          saveGameState();

          if (gameRef.current.isGameOver()) {
            let message = 'Game Over! ';
            if (gameRef.current.isCheckmate()) {
              message += `Checkmate! ${!isWhiteTurn ? 'White' : 'Black'} wins!`;
            } else if (gameRef.current.isDraw()) {
              message += 'Draw!';
            } else if (gameRef.current.isStalemate()) {
              message += 'Stalemate!';
            }
            Alert.alert('Game Over', message);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setMoveFrom('');
      setMoveTo('');
    },
    [isWhiteTurn]
  );

  const onTouchSquare = useCallback(
    (square) => {
      if (!moveFrom) {
        const piece = gameRef.current.get(square);
        if (piece && ((piece.color === 'w' && isWhiteTurn) || (piece.color === 'b' && !isWhiteTurn))) {
          setMoveFrom(square);
        }
      } else {
        setMoveTo(square);
        onMove({ from: moveFrom, to: square });
      }
    },
    [moveFrom, onMove, isWhiteTurn]
  );

  const undoMove = () => {
    if (moveHistory && moveHistory.length > 0) {
      gameRef.current.undo();
      updateGameState();
      saveGameState();
    }
  };

  const resetGame = async () => {
    gameRef.current.reset();
    updateGameState();
    setMoveFrom('');
    setMoveTo('');
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const startNewGame = async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, SHOW_SELECTION_KEY]);
    setGameScreen('selection');
    setFenInput('');
    setMoveHistory([]);
    setHasSavedGame(false);
  };

  if (gameScreen === 'selection') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.startGameContainer}>
          <Text style={styles.title}>How would you like to start?</Text>
          
          {hasSavedGame && (
            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={handleContinueGame}
            >
              <Text style={styles.buttonText}>Continue Saved Game</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartNormalGame}
          >
            <Text style={styles.buttonText}>Start from Scratch</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>- OR -</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setGameScreen('fen')}
          >
            <Text style={styles.buttonText}>Upload FEN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (gameScreen === 'fen') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setGameScreen('selection')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.startGameContainer}>
          <Text style={styles.title}>Enter FEN Position</Text>
          
          <TextInput
            style={styles.fenInput}
            value={fenInput}
            onChangeText={setFenInput}
            placeholder="Enter FEN notation..."
            multiline
          />
          
          <TouchableOpacity
            style={[styles.button, !fenInput.trim() && styles.buttonDisabled]}
            onPress={handleStartFromPosition}
            disabled={!fenInput.trim()}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={startNewGame}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.turnIndicator}>
          {isWhiteTurn ? "White's Turn" : "Black's Turn"}
        </Text>
        <TouchableOpacity 
          style={styles.newGameButton}
          onPress={startNewGame}
        >
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.boardContainer}>
        <Chessboard
          position={position}
          boardSize={boardSize}
          onTouchSquare={onTouchSquare}
          selectedSquare={moveFrom}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, (!moveHistory || moveHistory.length === 0) && styles.buttonDisabled]} 
          onPress={undoMove}
          disabled={!moveHistory || moveHistory.length === 0}
        >
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, (!moveHistory || moveHistory.length === 0) && styles.buttonDisabled]} 
          onPress={resetGame}
          disabled={!moveHistory || moveHistory.length === 0}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moveListContainer}>
        <Text style={styles.moveListTitle}>Move History</Text>
        <ScrollView style={styles.moveList}>
          {moveHistory.map((move) => (
            <View key={move.moveNumber} style={styles.moveRow}>
              <Text style={styles.moveNumber}>{move.moveNumber}.</Text>
              <View style={styles.moveTextsContainer}>
                <Text style={styles.moveText}>{move.white}</Text>
                {move.black && (
                  <Text style={styles.moveText}>{move.black}</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  startGameContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  turnIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  newGameButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  newGameText: {
    color: 'white',
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#666',
  },
  fenInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginVertical: 8,
  },
  continueButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#99c9ff',
  },
  boardContainer: {
    padding: 16,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  moveListContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  moveListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  moveList: {
    flex: 1,
  },
  moveRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  moveNumber: {
    width: 40,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginRight: 8,
  },
  moveTextsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  moveText: {
    fontSize: 14,
    color: '#333',
    minWidth: 50,
    fontFamily: 'monospace',
  },
});

export default PlaygroundScreen;