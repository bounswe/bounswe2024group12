import { StyleSheet, Text, Image, ScrollView, View, Touchable, TouchableOpacity } from "react-native";
import textStyles from "../../styles/textStyles";
import GameScreenBanner from "./GameScreenBanner";
import { useState } from "react";
import SmallRatings from "../commons/SmallRatings";
import GameTab from "./GameTab";
import Characters from "./Characters";
import Credits from "./Credits";
import GameReviewListCard from "./Reviews"
import ReviewGamePopup from "./ReviewGamePopup";

const exampleGame = {
  id: "exampleGameId",
  title: "The Witcher 3: Wild Hunt",
  logo: "https://wallpaperaccess.com/full/204728.jpg",
  banner: "https://wallpaperaccess.com/full/204728.jpg",
  shortDescription: "The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by Polish developer CD Projekt Red and is based on The Witcher series of fantasy novels by Andrzej Sapkowski. It is the sequel to the 2011 game The Witcher 2: Assassins of Kings.",
  longDescription: "The Witcher 3: Wild Hunt is the third and final installment in the series of games developed by CD PROJEKT RED featuring the witcher Geralt of Rivia. The game was originally scheduled for release in late 2014, then pushed back to 24 February 2015, and finally released on 19 May 2015.[3] During the first two weeks since release it had sold more than 4 million copies worldwide,[4] more than doubling the total sales of its predecessor, The Witcher 2: Assassins of Kings.[5]",
  images: [
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
    "https://wallpaperaccess.com/full/204728.jpg",
  ],
  categoryLogos: [
      "https://as1.ftcdn.net/v2/jpg/02/10/79/02/1000_F_210790238_Wrrb5TzIaWz9ErUXYWtwjqqFeaUEi8D5.jpg",
      "https://as1.ftcdn.net/v2/jpg/02/10/79/02/1000_F_210790238_Wrrb5TzIaWz9ErUXYWtwjqqFeaUEi8D5.jpg",
      "https://as1.ftcdn.net/v2/jpg/02/10/79/02/1000_F_210790238_Wrrb5TzIaWz9ErUXYWtwjqqFeaUEi8D5.jpg",
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
  gameReleaseDate: new Date("2015-05-19"),
};

export default GameScreenComponents = ({ game }) => {
    const [selectedText, setSelectedText] = useState('Game');
    const [modalVisible, setModalVisible] = useState(false);

    const handleTextPress = (text) => {
        setSelectedText(text);
    };

    const reviewGame = () => {
        setModalVisible(true);
    }

    return (
        <ScrollView>
            <GameScreenBanner game={game} />
            <Text style={[textStyles.default, styles.description]}>{game.gameDescription}</Text>
            <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                    {/* <Text style={[textStyles.default, styles.rating]}>{game.averageRating()}</Text> */}
                    <Text style={[textStyles.default, styles.rating]}>{4}</Text>
                    {/* <SmallRatings rating={game.averageRating()} /> */}
                    <SmallRatings rating={4} />
                </View>
                <TouchableOpacity style={styles.review} onPress={reviewGame}>
                  <Text style={textStyles.default}>Create Review</Text>
                  {/* <SmallRatings rating={0} /> */}
                  <ReviewGamePopup game={game} visible={modalVisible} onClose={() => setModalVisible(false)} />
                </TouchableOpacity>
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }}></View>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: 'row'}}>
                    <CategoryTab title="Game" onPress={() => handleTextPress('Game')} isSelected={selectedText === 'Game'} />
                    <CategoryTab title="Characters" onPress={() => handleTextPress('Characters')} isSelected={selectedText === 'Characters'} />
                    <CategoryTab title="Credits" onPress={() => handleTextPress('Credits')} isSelected={selectedText === 'Credits'} />
                    <CategoryTab title="Reviews" onPress={() => handleTextPress('Reviews')} isSelected={selectedText === 'Reviews'} />
                </View>
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: 'white' }}></View>

          {selectedText === 'Game' && <GameTab game={game} />}
          {selectedText === 'Characters' && <Characters game={game} />}
          {selectedText === 'Credits' && <Credits game={game} />}
          {selectedText === 'Reviews' && <GameReviewListCard game={game} />}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      backgroundColor: '#14171C',
      padding: 20,
      margin: 10,
      flexDirection: 'column',
    },
    description: {
        color: 'lightgrey',
        fontSize: 13,
        padding: 15,
    },

    logo: {
        width: 100,
        height: 100,
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
    ratingContainer: {
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      padding: 5,
      flex: 1,
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
    },

    review: {
      flex: 2,
      alignItems: 'center',
    },
  });
