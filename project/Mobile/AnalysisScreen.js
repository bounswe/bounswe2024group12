import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Chessboard from 'react-native-chessboard';

const AnalysisScreen = () => {
  const chessboardRef = useRef(null);

  return (
    <View style={styles.container}>
      <Chessboard
        ref={chessboardRef}
        boardSize={300}
        gestureEnabled={true}
        onMove={({ state }) => {
          if (state.in_checkmate) {
            console.log('Checkmate!');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default AnalysisScreen;