import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Clipboard,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Chessboard from 'react-native-chessboard';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth - 32;
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const Header = ({ onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Feather name="arrow-left" size={24} color="#000" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Playground</Text>
    <View style={styles.placeholder} />
  </View>
);

const PlaygroundScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [screen, setScreen] = useState('selection');
  const [customFen, setCustomFen] = useState('');
  const boardRef = useRef(null);

  const handleCopyPosition = useCallback(() => {
    if (boardRef.current) {
      const currentFen = boardRef.current.getState().fen;
      Clipboard.setString(currentFen);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Position copied to clipboard', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Position copied to clipboard');
      }
    }
  }, []);

  const handleMove = useCallback(({ state }) => {
    if (state.game_over) {
      Alert.alert('Game Over');
    }
    return true;
  }, []);

  const handleUndo = useCallback(() => {
    if (boardRef.current) {
      boardRef.current.undo();
    }
  }, []);

  const handleReset = useCallback(() => {
    if (boardRef.current) {
      boardRef.current.resetBoard(customFen || INITIAL_FEN);
    }
  }, [customFen]);

  const handleStartCustomGame = () => {
    if (!customFen) return;
    setScreen('game');
  };

  React.useEffect(() => {
    if (!isFocused) {
      setScreen('selection');
      setCustomFen('');
      if (boardRef.current) {
        boardRef.current.resetBoard(INITIAL_FEN);
      }
    }
  }, [isFocused]);

  const handleStartNormalGame = () => {
    setScreen('game');
  };

  if (screen === 'selection') {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.title}>How would you like to start?</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartNormalGame}>
            <Text style={styles.buttonText}>Start Normal Game</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>- OR -</Text>
          <TouchableOpacity style={styles.button} onPress={() => setScreen('fen')}>
            <Text style={styles.buttonText}>Custom Position</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'fen') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <Header onBack={() => setScreen('selection')} />
          <View style={styles.content}>
            <Text style={styles.title}>Enter FEN Position</Text>
            <TextInput
              style={styles.input}
              value={customFen}
              onChangeText={setCustomFen}
              placeholder="Enter FEN notation..."
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.button, !customFen && styles.buttonDisabled]}
              onPress={handleStartCustomGame}
              disabled={!customFen}
            >
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gameContainer}>
          <View style={styles.boardContainer}>
            <Chessboard
              ref={boardRef}
              boardSize={boardSize}
              onMove={handleMove}
              fen={customFen || INITIAL_FEN}
            />
            <TouchableOpacity 
              style={[styles.button, styles.copyButton]} 
              onPress={handleCopyPosition}
            >
              <Text style={styles.buttonText}>Copy Position</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={handleUndo}>
              <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flex: {
    flex: 1,
  },
  content: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  backButton: {
    padding: 8,
  },
  input: {
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#99c9ff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  boardContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  copyButton: {
    marginTop: 16,
  },
});

export default PlaygroundScreen;