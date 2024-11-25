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
  Pause,
  RotateCcw
} from 'lucide-react-native';
import Chessboard from 'react-native-chessboard';
import { Chess } from 'chess.js';

const CONTAINER_PADDING = 16;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOARD_SIZE = Math.min(
  SCREEN_WIDTH - (CONTAINER_PADDING * 2),
  SCREEN_HEIGHT * 0.45
);

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const AUTO_PLAY_DELAY = 2000;

export const PgnViewer = ({
  pgn,
  darkSquareColor = '#769656',
  lightSquareColor = '#eeeed2',
  onPositionChange,
  onMovesUpdate
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [positions, setPositions] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentFen, setCurrentFen] = useState(INITIAL_FEN);
  const [boardKey, setBoardKey] = useState(0);

  useEffect(() => {
    const initializeGame = () => {
      setIsLoading(true);
      setError(null);

      try {
        game.reset();
        if (!pgn) {
          console.log('No PGN provided, resetting to initial position');
          setMoveHistory([]);
          setPositions([INITIAL_FEN]);
          setCurrentMoveIndex(-1);
          setCurrentFen(INITIAL_FEN);
          setBoardKey(prev => prev + 1);
          return;
        }

        game.loadPgn(pgn.trim());
        const moves = game.history();
        setMoveHistory(moves);

        game.reset();
        const newPositions = [game.fen()];

        for (const move of moves) {
          game.move(move);
          newPositions.push(game.fen());
        }

        setPositions(newPositions);
        setCurrentMoveIndex(-1);
        setCurrentFen(newPositions[0]);
        setBoardKey(prev => prev + 1);

      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to load chess game. Please check the PGN format.');
        game.reset();
        setCurrentFen(INITIAL_FEN);
        setMoveHistory([]);
        setPositions([INITIAL_FEN]);
        setCurrentMoveIndex(-1);
        setBoardKey(prev => prev + 1);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [pgn]);

  useEffect(() => {
    if (currentFen && onPositionChange) {
      onPositionChange(currentFen);
    }
  }, [currentFen, onPositionChange]);

  useEffect(() => {
    const position = positions[currentMoveIndex + 1];
    if (position) {
      game.load(position);
      setCurrentFen(position);
      setBoardKey(prev => prev + 1);
    }
  }, [currentMoveIndex, positions]);

  useEffect(() => {
    let interval;

    if (isAutoPlaying) {
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

  useEffect(() => {
    if (moveHistory && onMovesUpdate) {
      onMovesUpdate(moveHistory);
    }
  }, [moveHistory, onMovesUpdate]);

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
      <View style={styles.boardWrapper}>
        <View style={styles.boardContainer}>
          <Chessboard
            key={boardKey}
            fen={currentFen}
            boardSize={BOARD_SIZE}
            darkSquareColor={darkSquareColor}
            lightSquareColor={lightSquareColor}
            gestureEnabled={false}
          />
        </View>
      </View>

      <View style={styles.positionInfoContainer}>
        <Text style={styles.positionInfoText}>
          Move: {currentMoveIndex + 1} / {moveHistory.length}
        </Text>
        <Text style={styles.positionInfoText}>
          Turn: {currentFen.split(' ')[1] === 'w' ? 'White' : 'Black'}
        </Text>
        {game.inCheck() && (
          <Text style={styles.checkText}>CHECK!</Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => handleControlClick('start')}
          style={[styles.button, currentMoveIndex === -1 && styles.buttonDisabled]}
          accessible={true}
          accessibilityLabel="Go to start of the game"
        >
          <RotateCcw size={24} color={currentMoveIndex === -1 ? '#ccc' : '#333'} />
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
          style={[styles.button, isAutoPlaying && styles.buttonActive]}
          accessible={true}
          accessibilityLabel={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ?
            <Pause size={24} color="#fff" /> :
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

      <ScrollView style={styles.moveListContainer}>
        <View style={styles.moveListContent}>
          {renderMoveList()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  boardWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  boardContainer: {
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
    maxHeight: 150,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 16,
  },
  moveListContent: {
    padding: 12,
  },
  movePair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveNumber: {
    width: 32,
    fontSize: 14,
    color: '#666',
  },
  move: {
    flex: 1,
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
  },
  positionInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  positionInfoText: {
    fontSize: 14,
    color: '#333',
  },
  checkText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: 'bold',
  }
});

export default PgnViewer;