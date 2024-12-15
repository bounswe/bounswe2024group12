import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GameCard = ({ game, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(game)}
      disabled={disabled}
    >
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameEvent} numberOfLines={1}>{game.event}</Text>
          <Text style={styles.gameDate}>
            {`${game.year}${game.month ? '.' + game.month : ''}${game.day ? '.' + game.day : ''}`}
          </Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, game.result === '1-0' && styles.whiteWin]}>
            {game.white}
          </Text>
          <Text style={styles.vs}>vs</Text>
          <Text style={[styles.playerName, game.result === '0-1' && styles.blackWin]}>
            {game.black}
          </Text>
        </View>
        <View style={styles.gameFooter}>
          <Text style={styles.gameSite} numberOfLines={1}>{game.site}</Text>
          <Text style={[
            styles.gameResult,
            game.result === '1-0' && styles.whiteWin,
            game.result === '0-1' && styles.blackWin,
            game.result === '1/2-1/2' && styles.draw
          ]}>
            {game.result}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default GameCard;