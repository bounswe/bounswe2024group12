import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const ChessBoardComponent = ({ fen, onMove }) => {
  const rows = fen.split(' ')[0].split('/');

  const renderSquare = (piece, row, col) => {
    const isLight = (row + col) % 2 === 0;
    return (
      <TouchableOpacity
        style={[
          styles.square,
          isLight ? styles.lightSquare : styles.darkSquare
        ]}
        onPress={() => onMove({ from: `${String.fromCharCode(97 + col)}${8 - row}` })}
      >
        <Text style={styles.piece}>{getPieceSymbol(piece)}</Text>
      </TouchableOpacity>
    );
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    };
    return symbols[piece] || '';
  };

  return (
    <View style={styles.board}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.split('').map((char, colIndex) => {
            if (isNaN(char)) {
              return renderSquare(char, rowIndex, colIndex);
            } else {
              return Array(parseInt(char)).fill().map((_, i) => (
                renderSquare('', rowIndex, colIndex + i)
              ));
            }
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 320,
    height: 320,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightSquare: {
    backgroundColor: '#f0d9b5',
  },
  darkSquare: {
    backgroundColor: '#b58863',
  },
  piece: {
    fontSize: 28,
  },
});

export default ChessBoardComponent;