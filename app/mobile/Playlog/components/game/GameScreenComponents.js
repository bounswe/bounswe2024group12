import { StyleSheet, Text, Image, ScrollView } from "react-native";
import textStyles from "../../styles/textStyles";
import GameScreenBanner from "./GameScreenBanner";

export default GameScreenComponents = ({ game }) => {
    return (
        <ScrollView>
            <GameScreenBanner game={game} />
            <Text style={[textStyles.default, styles.description]}>{game.shortDescription}</Text>

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
  });
  