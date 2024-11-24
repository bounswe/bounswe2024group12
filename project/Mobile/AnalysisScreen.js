import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  Dimensions,
  ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PgnViewer } from './components/PgnViewer';

const { width, height } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const MAX_BOARD_WIDTH = Math.min(width - (CONTAINER_PADDING * 2), 400);

const AnalysisScreen = ({ route, navigation }) => {
  const { pgn } = route.params;

  useEffect(() => {
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

  if (!pgn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#666" />
          <Text style={styles.errorText}>No game data available</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.analysisContainer}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <PgnViewer 
              pgn={pgn}
              darkSquareColor="#769656"
              lightSquareColor="#eeeed2"
            />
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: CONTAINER_PADDING,
    paddingBottom: CONTAINER_PADDING * 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default AnalysisScreen;