import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const GameInfo = ({ pgn }) => {
  const navigation = useNavigation();
  
  const getGameDetails = (pgn) => ({
    event: pgn.match(/\[Event "(.*?)"\]/)?.[1] || 'Unknown Event',
    site: pgn.match(/\[Site "(.*?)"\]/)?.[1] || 'Unknown Site',
    date: pgn.match(/\[Date "(.*?)"\]/)?.[1] || 'Unknown Date',
    white: pgn.match(/\[White "(.*?)"\]/)?.[1] || 'Unknown White',
    black: pgn.match(/\[Black "(.*?)"\]/)?.[1] || 'Unknown Black',
    result: pgn.match(/\[Result "(.*?)"\]/)?.[1] || 'Unknown Result',
    eco: pgn.match(/\[ECO "(.*?)"\]/)?.[1] || '-'
  });

  const details = getGameDetails(pgn);

  const handleEcoPress = () => {
    navigation.navigate('ECOCode', { ecoCode: details.eco });
  };

  const handlePlayerPress = (playerName) => {
    const surname = playerName.split(',')[0].trim();
    navigation.navigate('Archive', {
        initialMode: 'filter',
        initialFilters: {
            player: surname,
            year: '',
            site: '',
            event: '',
            result: ''
        }
    });
};

const handleEventPress = () => {
    navigation.navigate('Archive', {
        initialMode: 'filter',
        initialFilters: {
            event: details.event,
            year: '',
            player: '',
            site: '',
            result: ''
        }
    });
};

const handleSitePress = () => {
    navigation.navigate('Archive', {
        initialMode: 'filter',
        initialFilters: {
            site: details.site,
            year: '',
            player: '',
            event: '',
            result: ''
        }
    });
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleEventPress}>
            <Text style={[styles.eventTitle, styles.interactive]}>
              {details.event}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSitePress}>
            <Text style={[styles.siteText, styles.interactive]}>
              {details.site}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.dateText}>{details.date}</Text>
          <TouchableOpacity 
            style={styles.ecoBadge}
            onPress={handleEcoPress}
            disabled={details.eco === '-'}
          >
            <Text style={styles.ecoText}>ECO: {details.eco}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.playersContainer}>
        <TouchableOpacity 
          style={styles.playerRow}
          onPress={() => handlePlayerPress(details.white)}
        >
          <View style={styles.playerInfo}>
            <View style={styles.whiteCircle} />
            <Text style={[styles.playerName, styles.interactive]}>
              {details.white}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playerRow}
          onPress={() => handlePlayerPress(details.black)}
        >
          <View style={styles.playerInfo}>
            <View style={styles.blackCircle} />
            <Text style={[styles.playerName, styles.interactive]}>
              {details.black}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{details.result}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  siteText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ecoBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ecoText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  playersContainer: {
    marginTop: 12,
    gap: 8,
  },
  playerRow: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  blackCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  interactive: {
    textDecorationLine: 'underline',
    textDecorationColor: '#007AFF',
    color: '#007AFF',
  },
});

export default GameInfo;