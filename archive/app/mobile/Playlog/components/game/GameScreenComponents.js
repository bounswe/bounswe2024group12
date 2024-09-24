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

export default GameScreenComponents = ({ game, characters, popularReviews, recentReviews }) => {
    const [selectedText, setSelectedText] = useState('Game');
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const handleTextPress = (text) => {
        setSelectedText(text);
    };

    const reviewGame = () => {
      setIsEdit(false);
        setModalVisible(true);
    }

    const editReview = (review) => {
      setIsEdit(true);
      setEditingReview(review);
      setModalVisible(true);
    }

    return (
        <ScrollView>
            <GameScreenBanner game={game} />
            <Text style={[textStyles.default, styles.description]}>{game.gameDescription}</Text>
            <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                    {/* <Text style={[textStyles.default, styles.rating]}>{game.averageRating()}</Text> */}
                    {/* <Text style={[textStyles.default, styles.rating]}>{"change"}</Text> */}
                    {/* <SmallRatings rating={game.averageRating()} /> */}
                    <SmallRatings rating={4} />
                </View>
                <TouchableOpacity style={styles.review} onPress={reviewGame}>
                  <Text style={textStyles.default}>Create Review</Text>
                  {/* <SmallRatings rating={0} /> */}
                  <ReviewGamePopup editingReview={editingReview} game={game} visible={modalVisible} onClose={() => setModalVisible(false)} />
                </TouchableOpacity>
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }}></View>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: 'row'}}>
                    {/* <CategoryTab title="Game" onPress={() => handleTextPress('Game')} isSelected={selectedText === 'Game'} /> */}
                    <CategoryTab title="Characters" onPress={() => handleTextPress('Characters')} isSelected={selectedText === 'Characters'} />
                    {/* <CategoryTab title="Credits" onPress={() => handleTextPress('Credits')} isSelected={selectedText === 'Credits'} /> */}
                    {/* <CategoryTab title="PopularReviews" onPress={() => handleTextPress('PopularReviews')} isSelected={selectedText === 'PopularReviews'} /> */}
                    <CategoryTab title="Reviews" onPress={() => handleTextPress('NewReviews')} isSelected={selectedText === 'NewReviews'} />
                </View>
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: 'white' }}></View>

          {/* {selectedText === 'Game' && <GameTab game={game} />} */}
          {selectedText === 'Characters' && <Characters game={game} characters={characters} />}
          {/* {selectedText === 'Credits' && <Credits game={game} />} */}
          {/* {selectedText === 'PopularReviews' && <GameReviewListCard game={game} reviews={popularReviews} editReview={editReview} />} */}
          {selectedText === 'NewReviews' && <GameReviewListCard game={game} reviews={recentReviews} editReview={editReview} />}
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
