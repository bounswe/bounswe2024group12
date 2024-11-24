import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PgnViewer } from './components/PgnViewer';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 16;

// Default PGN showing the "Immortal Game" - Anderssen vs Kieseritzky, 1851
const DEFAULT_PGN = `[Event "London"]
[Site "London ENG"]
[Date "1851.06.21"]
[Round "?"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "1-0"]
[ECO "C33"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "45"]

1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5
9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6
16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8
22.Qf6+ Nxf6 23.Be7# 1-0`;

const AnalysisScreen = ({ route, navigation }) => {
  // Use the provided PGN from navigation or fall back to default PGN
  const pgn = route?.params?.pgn || DEFAULT_PGN;

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Game Analysis',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
      },
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.analysisContainer}>
        <View style={styles.content}>
          <PgnViewer 
            pgn={pgn}
            darkSquareColor="#769656"
            lightSquareColor="#eeeed2"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  analysisContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: CONTAINER_PADDING,
    paddingBottom: CONTAINER_PADDING * 2,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  }
});

export default AnalysisScreen;