import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react-native';
import Chessboard from 'react-native-chessboard';
import { Chess } from 'chess.js';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(Dimensions.get('window').width - 32, Dimensions.get('window').height / 2);
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const AUTO_PLAY_DELAY = 2000;

export const PgnViewer = ({ pgn, darkSquareColor = '#769656', lightSquareColor = '#eeeed2' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [positions, setPositions] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentFen, setCurrentFen] = useState(INITIAL_FEN);

  useEffect(() => {
    const initializeGame = () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!pgn) {
          game.reset();
          setMoveHistory([]);
          setPositions([INITIAL_FEN]);
          setCurrentMoveIndex(-1);
          setCurrentFen(INITIAL_FEN);
          return;
        }

        game.reset();
        game.loadPgn(pgn.trim());

        const moves = game.history();
        setMoveHistory(moves);

        game.reset();
        const positions = [game.fen()];

        for (const move of moves) {
          game.move(move);
          positions.push(game.fen());
        }

        setPositions(positions);
        setCurrentMoveIndex(-1);
        setCurrentFen(positions[0]);
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to load chess game. Please check the PGN format.');
        game.reset();
        setCurrentFen(INITIAL_FEN);
        setMoveHistory([]);
        setPositions([INITIAL_FEN]);
        setCurrentMoveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [pgn]);

  useEffect(() => {
    const position = positions[currentMoveIndex + 1];
    if (position) {
      setCurrentFen(position);
    }
  }, [currentMoveIndex, positions]);

  useEffect(() => {
    let interval;

    if (isAutoPlaying && moveHistory.length > 0) {
      interval = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev >= moveHistory.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, AUTO_PLAY_DELAY);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, moveHistory.length]);

  const handleMoveClick = useCallback((index) => {
    setCurrentMoveIndex(index);
    setIsAutoPlaying(false);
  }, []);

  const handleControlClick = useCallback((action) => {
    if (action === 'play') {
      setIsAutoPlaying(prev => !prev);
      return;
    }

    setIsAutoPlaying(false);
    switch (action) {
      case 'start':
        setCurrentMoveIndex(-1);
        break;
      case 'prev':
        setCurrentMoveIndex(prev => Math.max(-1, prev - 1));
        break;
      case 'next':
        setCurrentMoveIndex(prev => Math.min(moveHistory.length - 1, prev + 1));
        break;
      case 'end':
        setCurrentMoveIndex(moveHistory.length - 1);
        break;
      default:
        break;
    }
  }, [moveHistory.length]);

  const renderMoveList = () => {
    const moves = [];

    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = moveHistory[i + 1];

      moves.push(
        <View key={i} style={styles.movePair}>
          <Text style={styles.moveNumber}>{moveNumber}.</Text>
          <TouchableOpacity
            style={[styles.move, currentMoveIndex === i && styles.selectedMove]}
            onPress={() => handleMoveClick(i)}
          >
            <Text style={[
              styles.moveText,
              currentMoveIndex === i && styles.selectedMoveText
            ]}>
              {whiteMove}
            </Text>
          </TouchableOpacity>
          {blackMove && (
            <TouchableOpacity
              style={[styles.move, currentMoveIndex === i + 1 && styles.selectedMove]}
              onPress={() => handleMoveClick(i + 1)}
            >
              <Text style={[
                styles.moveText,
                currentMoveIndex === i + 1 && styles.selectedMoveText
              ]}>
                {blackMove}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return moves;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <Chessboard
          fen={currentFen}
          boardSize={BOARD_SIZE}
          darkSquareColor={darkSquareColor}
          lightSquareColor={lightSquareColor}
          gestureEnabled={false}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => handleControlClick('play')}
          style={[styles.button, isAutoPlaying && styles.buttonActive]}
          accessible={true}
          accessibilityLabel={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? (
            <Pause size={24} color="#fff" />
          ) : (
            <Play size={24} color="#333" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleControlClick('prev')}
          disabled={currentMoveIndex === -1}
          style={[styles.button, currentMoveIndex === -1 && styles.buttonDisabled]}
          accessible={true}
          accessibilityLabel="Go to previous move"
        >
          <ChevronLeft size={24} color={currentMoveIndex === -1 ? '#ccc' : '#333'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleControlClick('play')}
          style={styles.button}
          accessible={true}
          accessibilityLabel={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ?
            <Pause size={24} color="#007AFF" /> :
            <Play size={24} color="#333" />
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleControlClick('next')}
          disabled={currentMoveIndex === moveHistory.length - 1}
          style={[styles.button,
          currentMoveIndex === moveHistory.length - 1 && styles.buttonDisabled]}
          accessible={true}
          accessibilityLabel="Go to next move"
        >
          <ChevronRight
            size={24}
            color={currentMoveIndex === moveHistory.length - 1 ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleControlClick('end')}
          disabled={currentMoveIndex === moveHistory.length - 1}
          style={[styles.button,
          currentMoveIndex === moveHistory.length - 1 && styles.buttonDisabled]}
          accessible={true}
          accessibilityLabel="Skip to end of the game"
        >
          <SkipForward
            size={24}
            color={currentMoveIndex === moveHistory.length - 1 ? '#ccc' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.moveListContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.moveListContent}>
          {renderMoveList()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    fontSize: 16,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  moveListContainer: {
    maxHeight: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  moveListContent: {
    padding: 12,
  },
  movePair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  moveNumber: {
    width: 32,
    fontSize: 14,
    color: '#666',
  },
  move: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  moveText: {
    fontSize: 14,
    color: '#333',
  },
  selectedMove: {
    backgroundColor: '#007AFF20',
  },
  selectedMoveText: {
    color: '#007AFF',
    fontWeight: 'bold',
  }
});

export default PgnViewer;