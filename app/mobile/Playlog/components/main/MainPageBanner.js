import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import SmallRatings from '../commons/SmallRatings';
import { useNavigation } from '@react-navigation/native';

const exampleGame = {
  id: "exampleGameId",
  title: "The Witcher 3: Wild Hunt",
  logo: "https://wallpaperaccess.com/full/204728.jpg",
  banner: "https://wallpaperaccess.com/full/204728.jpg",
  shortDescription: "The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by Polish developer CD Projekt Red and is based on The Witcher series of fantasy novels by Andrzej Sapkowski. It is the sequel to the 2011 game The Witcher 2: Assassins of Kings.",
  longDescription: "",
  images: [
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
  ],
  developer: "CD Projekt Red",
  publisher: "CD Projekt",
  publicationDate: new Date("2015-05-19"),
  platforms: ["PC", "PlayStation", "Xbox"],
  genres: ["Action", "RPG"],
  directors: [
    "Konrad Tomaszkiewicz",
    "Mateusz Kanik",
  ],
  producers: [
    "Piotr Krzywonosiuk",
    "Jędrzej Mróz",
  ],
  screenWriters: [
    "Jakub Szamałek",
    "Karolina Stachyra",
  ],
  composers: [
    "Marcin Przybyłowicz",
    "Mikołaj Stroiński",
  ],
  countryOfOrigin: "Poland",
  storeUrls: {
    steam: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    gog: "https://www.gog.com/game/the_witcher_3_wild_hunt",
    epic: "https://www.epicgames.com/store/en-US/p/the-witcher-3-wild-hunt",
  },
  criticScores: {
    metacritic: 93,
    opencritic: 92,
    ign: 9.3,
  },
  canYouRunItUrl: "https://www.systemrequirementslab.com/cyri/requirements/the-witcher-3-wild-hunt/12404",
  likes: 0,
  characters: [

  ],
  averageRating: () => 4.5,
};

export default MainPageBanner = ({ game }) => {
    const navigation = useNavigation();

    if (!game) {
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Game of The Day</Text>
            <Text>Loading...</Text>
          </View>
        );
      }

    const onPress = () => {
        console.log("Navigating to game:", game.game_slug);
        navigation.navigate('Game', { gameId: game.game_slug });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.header}>Game of The Day</Text>
        {/* <Image
            source={{ uri: game.image }} // Replace with your image path
            style={styles.gameBanner}
        /> */}
        <View style={styles.bottomContainer}>
            <Image
            source={{ uri: game.image }} // Replace with your image path
            style={styles.gameLogo}
            />
            <View style={styles.gameDetailsContainer}>
            <Text style={styles.gameTitle}>{game.gameLabel}</Text>
            <Text style={styles.gameDeveloper}>{game.publisherLabel}</Text>
            {/* <SmallRatings rating={game.averageRating()} /> */}
            </View>
        </View>
        </TouchableOpacity>
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
    borderRadius: 10,
  },
  bottomContainer: {
    // flex: 1,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  gameLogo: {
    flex: 1,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: '100%',
    margin: 10,
  },
  gameDetailsContainer: {
    flex: 2,
    marginLeft: 10,
  },
  gameTitle: {
    color: 'white',
    fontSize: 18,
  },
  gameDeveloper: {
    color: 'grey',
    fontSize: 14,
  },
});
