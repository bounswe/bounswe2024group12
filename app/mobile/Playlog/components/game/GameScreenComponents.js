import { StyleSheet, Text, Image, ScrollView, View } from "react-native";
import textStyles from "../../styles/textStyles";
import GameScreenBanner from "./GameScreenBanner";
import { useState } from "react";

export default GameScreenComponents = ({ game }) => {
    const [selectedText, setSelectedText] = useState('Text 1');

    const handleTextPress = (text) => {
        setSelectedText(text);
    };

    return (
        <ScrollView>
            <GameScreenBanner game={game} />
            <Text style={[textStyles.default, styles.description]}>{game.shortDescription}</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }}></View>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: 'row'}}>
                    <CategoryTab title="Text 1" onPress={() => handleTextPress('Text 1')} isSelected={selectedText === 'Text 1'} />
                    <CategoryTab title="Text 2" onPress={() => handleTextPress('Text 2')} isSelected={selectedText === 'Text 2'} />
                    <CategoryTab title="Text 3" onPress={() => handleTextPress('Text 3')} isSelected={selectedText === 'Text 3'} />
                    <CategoryTab title="Text 4" onPress={() => handleTextPress('Text 4')} isSelected={selectedText === 'Text 4'} />
                    <CategoryTab title="Text 5" onPress={() => handleTextPress('Text 5')} isSelected={selectedText === 'Text 5'} />
                    <CategoryTab title="Text 6" onPress={() => handleTextPress('Text 6')} isSelected={selectedText === 'Text 6'} />
                    <CategoryTab title="Text 7" onPress={() => handleTextPress('Text 7')} isSelected={selectedText === 'Text 7'} />
                    <CategoryTab title="Text 8" onPress={() => handleTextPress('Text 8')} isSelected={selectedText === 'Text 8'} />
                    <CategoryTab title="Text 9" onPress={() => handleTextPress('Text 9')} isSelected={selectedText === 'Text 9'} />
                    <CategoryTab title="Text 10" onPress={() => handleTextPress('Text 10')} isSelected={selectedText === 'Text 10'} />
                    <CategoryTab title="Text 11" onPress={() => handleTextPress('Text 11')} isSelected={selectedText === 'Text 11'} />
                    <CategoryTab title="Text 12" onPress={() => handleTextPress('Text 12')} isSelected={selectedText === 'Text 12'} />
                </View>
            </ScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: 'white' }}></View>
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
  