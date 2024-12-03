import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export const ECOCodeScreen = ({ route, navigation }) => {
  const { ecoCode } = route.params;
  const [showAllCodes, setShowAllCodes] = useState(false);

  // Dummy data for the specific ECO code
  const ecoInfo = {
    code: ecoCode,
    name: "King's Pawn Game",
    description: "The King's pawn opening is one of the most popular chess openings, created by moving the king's pawn two squares forward. This classic opening directly fights for the center and can lead to both tactical and positional play.",
    mainLines: [
      {
        moves: "1. e4 e5",
        name: "Open Game",
        description: "Black responds symmetrically, also claiming central space"
      },
      {
        moves: "1. e4 e6",
        name: "French Defense",
        description: "Black prepares to challenge White's center with ...d5"
      },
      {
        moves: "1. e4 c5",
        name: "Sicilian Defense",
        description: "Black immediately fights for the d4 square"
      }
    ],
    features: [
      "Controls central squares d5 and e5",
      "Opens lines for both queen and king's bishop",
      "Provides good attacking chances",
      "Can transpose into many different opening systems"
    ]
  };

  // Dummy data for general ECO codes
  const generalEcoCodes = [
    {
      category: "A Series (1.any except 1.e4, 1.d4)",
      codes: [
        "A00-A39: Irregular Openings and Flank Openings",
        "A40-A79: Queen's Pawn, Indian Defences",
        "A80-A99: Dutch Defense"
      ]
    },
    {
      category: "B Series (1.e4)",
      codes: [
        "B00-B19: Open Games without 1...e5",
        "B20-B59: Sicilian Defence",
        "B60-B99: Sicilian Defence, Variations"
      ]
    },
    {
      category: "C Series (1.e4 e5)",
      codes: [
        "C00-C19: French Defense",
        "C20-C59: Open Games",
        "C60-C99: Ruy Lopez"
      ]
    }
  ];

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "ECO Codes",
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.codeIndicator}>
            <Text style={styles.currentCode}>ECO {ecoCode}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{ecoInfo.name}</Text>
            <Text style={styles.description}>{ecoInfo.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {ecoInfo.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Lines</Text>
            {ecoInfo.mainLines.map((line, index) => (
              <View key={index} style={styles.lineItem}>
                <Text style={styles.movesText}>{line.moves}</Text>
                <Text style={styles.lineName}>{line.name}</Text>
                <Text style={styles.lineDescription}>{line.description}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => setShowAllCodes(!showAllCodes)}
          >
            <Text style={styles.learnMoreText}>
              Learn more: <Text style={styles.learnMoreLink}>ECO Codes</Text>
            </Text>
            <Feather 
              name={showAllCodes ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#007AFF" 
            />
          </TouchableOpacity>

          {showAllCodes && (
            <View style={styles.allCodesSection}>
              {generalEcoCodes.map((category, index) => (
                <View key={index} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  {category.codes.map((code, codeIndex) => (
                    <Text key={codeIndex} style={styles.codeText}>
                      • {code}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  codeIndicator: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentCode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  lineItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  movesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  lineName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  lineDescription: {
    fontSize: 14,
    color: '#666',
  },
  learnMoreButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  learnMoreText: {
    fontSize: 16,
    color: '#333',
  },
  learnMoreLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
  allCodesSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
  },
});