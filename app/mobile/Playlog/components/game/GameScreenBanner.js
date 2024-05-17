import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default GamePageBanner = ({ game }) => {
    return (
        <View>
            <View style={styles.bottomContainer}>
                <Image
                    source={{ uri: game.image }}
                    style={styles.gameLogo}
                />
                <View style={styles.gameDetailsContainer}>
                    <Text style={[styles.gameTitle, styles.gameDetailsContainerItem]}>{game.gameLabel}</Text>
                    <Text style={[styles.gameDeveloper, styles.gameDetailsContainerItem]}>{game.publisherLabel}</Text>
                    <Text style={[styles.gameRelease, styles.gameDetailsContainerItem]}>{game.publication_date?.substring(0, 4)}</Text>
                    <Text style={styles.gameDetailsContainerItem}>{game.genreLabel}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#14171C',
    padding: 20,
    margin: 10,
    flexDirection: 'column',
    // height: 400,
    // flex: 1,
  },
  header: {
    color: 'white',
    fontSize: 36,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gameBanner: {
    height: 200,
  },
  bottomContainer: {
    // flex: 1,
    height: 150,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
  },
  gameLogo: {
    flex: 1,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: '100%',
    marginRight: 10,
    marginLeft: 10,
},
  gameDetailsContainer: {
    flex: 2,
    marginLeft: 10,
  },
  gameDetailsContainerItem: {
    flex: 1,
  },
  gameDetailsContainerCategoryLogos: {
    flex: 1,
    flexDirection: 'row',
  },
  gameTitle: {
    color: 'white',
    fontSize: 18,
  },
  gameDeveloper: {
    color: 'grey',
    fontSize: 14,
  },
  gameRelease: {
    color: 'grey',
    fontSize: 14,
  },
  gameCategoryLogo: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
});
