import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Chessboard from 'react-native-chessboard';
import { Chess } from 'chess.js';
import { Ionicons } from '@expo/vector-icons';

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
  const [evalData, setEvalData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(null);
  const [comments, setComments] = useState([]);
  const [evaluationCache, setEvaluationCache] = useState({});

  const parseComments = (pgn) => {
    if (!pgn) return [];
    
    const comments = [];
    let moveIndex = -1;
    let insideComment = false;
    let currentComment = '';
    
    const tokens = pgn.split(/\s+/);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.startsWith('{') && token.endsWith('}')) {
        comments.push({
          moveIndex,
          comment: token.slice(1, -1).trim()
        });
        continue;
      }
      
      if (token.startsWith('{')) {
        insideComment = true;
        currentComment = token.slice(1);
        continue;
      }
      
      if (token.endsWith('}')) {
        insideComment = false;
        currentComment += ' ' + token.slice(0, -1);
        comments.push({
          moveIndex,
          comment: currentComment.trim()
        });
        currentComment = '';
        continue;
      }
      
      if (insideComment) {
        currentComment += ' ' + token;
        continue;
      }
      
      if (token.match(/^\d+\.$/)) continue;
      
      if (token.match(/^[RNBQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[RNBQ])?[+#]?$/) || 
          token === 'O-O' || token === 'O-O-O') {
        moveIndex++;
      }
    }
    
    return comments;
  };
  
  const renderCurrentComments = () => {
    if (!pgn || comments.length === 0) return null;
  
    const currentComments = comments.filter(
      comment => comment.moveIndex === currentMoveIndex
    );
  
    if (currentComments.length === 0) return null;
  
    return (
      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>PGN Comments</Text>
        <View style={styles.commentsList}>
          {currentComments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const parsedComments = parseComments(pgn);
    setComments(parsedComments);
  }, [pgn]);

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

  useEffect(() => {
    if (currentFen) {
      if (evaluationCache[currentFen]) {
        setEvalData(evaluationCache[currentFen]);
      } else {
        setEvalData(null);
      }
    }
  }, [currentFen, evaluationCache]);

  const handleEvaluate = async () => {
    if (!currentFen) return;

    if (evaluationCache[currentFen]) {
      setEvalData(evaluationCache[currentFen]);
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(currentFen)}`);

      if (!response.ok) {
        throw new Error('Evaluation not available');
      }

      const data = await response.json();
      setEvaluationCache(prev => ({
        ...prev,
        [currentFen]: data
      }));
      setEvalData(data);
    } catch (err) {
      setEvalError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getPieceType = (from, fen) => {
    const position = fen.split(' ')[0];
    const rows = position.split('/');
    const file = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(from[1]);
    let currentRow = rows[rank];
    let currentFile = 0;

    for (let i = 0; i < currentRow.length; i++) {
      if (isNaN(currentRow[i])) {
        if (currentFile === file) {
          const pieceMap = {
            'R': 'R', 'N': 'N', 'B': 'B', 'Q': 'Q', 'K': 'K',
            'r': 'R', 'n': 'N', 'b': 'B', 'q': 'Q', 'k': 'K'
          };
          return pieceMap[currentRow[i]] || '';
        }
        currentFile++;
      } else {
        currentFile += parseInt(currentRow[i]);
      }
    }
    return '';
  };

  const convertToSAN = (move, fen) => {
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    const pieceType = getPieceType(from, fen);
    return pieceType + to;
  };

  const getSuggestedMove = (eval_data, fen) => {
    if (!eval_data?.pvs?.[0]?.moves) return '';
    const moves = eval_data.pvs[0].moves.split(' ');
    const firstMove = moves[0];
    return convertToSAN(firstMove, fen);
  };

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

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => handleControlClick('start')}
          style={[styles.button, currentMoveIndex === -1 && styles.buttonDisabled]}
        >
          <Ionicons name="refresh" size={24} color={currentMoveIndex === -1 ? '#ccc' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleControlClick('prev')}
          style={[styles.button, currentMoveIndex === -1 && styles.buttonDisabled]}
        >
          <Ionicons name="chevron-back" size={24} color={currentMoveIndex === -1 ? '#ccc' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleControlClick('play')}
          style={[styles.button, isAutoPlaying && styles.buttonActive]}
        >
          {isAutoPlaying ?
            <Ionicons name="pause" size={24} color="#fff" /> :
            <Ionicons name="play" size={24} color="#333" />
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleControlClick('next')}
          style={[styles.button, currentMoveIndex === moveHistory.length - 1 && styles.buttonDisabled]}
        >
          <Ionicons name="chevron-forward" size={24} color={currentMoveIndex === moveHistory.length - 1 ? '#ccc' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleControlClick('end')}
          style={[styles.button, currentMoveIndex === moveHistory.length - 1 && styles.buttonDisabled]}
        >
          <Ionicons name="play-skip-forward" size={24} color={currentMoveIndex === moveHistory.length - 1 ? '#ccc' : '#333'} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Move: {currentMoveIndex + 1} / {moveHistory.length}
          </Text>
          <Text style={styles.infoText}>
Turn: {currentFen.split(' ')[1] === 'w' ? 'White' : 'Black'}
          </Text>
          <TouchableOpacity
            style={[styles.evalIconButton, isEvaluating && styles.evalButtonDisabled]}
            onPress={handleEvaluate}
            disabled={isEvaluating}
          >
            {isEvaluating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="cloud" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView style={styles.moveListContainer}>
          <View style={styles.moveListContent}>
            {renderMoveList()}
          </View>
        </ScrollView>

        <View style={styles.evaluationContainer}>
          {evalData && (
            <View style={styles.evaluationResult}>
              <Text style={styles.evaluationText}>
                Suggested: {getSuggestedMove(evalData, currentFen)}
              </Text>
              {evalData.pvs?.[0]?.cp !== undefined && (
                <Text style={styles.evaluationText}>
                  Score: {(evalData.pvs[0].cp / 100).toFixed(2)}
                </Text>
              )}
            </View>
          )}
          {evalError && (
            <Text style={styles.errorText}>{evalError}</Text>
          )}
        </View>
      </View>
      {renderCurrentComments()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  moveListContainer: {
    maxHeight: 150,
    flex: 4,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  moveListContent: {
    padding: 8,
  },
  evaluationContainer: {
    flex: 1,
    padding: 8,
  },
  infoContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  evalIconButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evalButtonDisabled: {
    backgroundColor: '#999',
  },
  buttonIcon: {
    marginRight: 6,
  },
  movePair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  moveNumberContainer: {
    width: 40,
    marginRight: 8,
  },
  moveNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'right',
  },
  moveContainer: {
    width: 60,
    marginRight: 8,
  },
  move: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 4,
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
  evaluationResult: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 8,
  },
  evaluationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  commentsSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  commentsList: {
    maxHeight: 120,
  },
  commentContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  }
});

export default PgnViewer;