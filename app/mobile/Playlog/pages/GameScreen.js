import { useEffect, useState } from "react";
import CustomButton from "../components/buttons/CustomButton";
import Screen from "../layouts/Screen";
import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import GameScreenComponents from "../components/game/GameScreenComponents";
import CategoryTab from "../components/game/CategoryTab";

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

export default GameScreen = ({ gameId = 'exampleGameId' }) => {

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedText, setSelectedText] = useState('Text 1');

    const handleTextPress = (text) => {
        setSelectedText(text);
    };

    const getGame = async () => {
        // setLoading(true)
        // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/game/${gameId}`)
        // const game = await response.json()
        // setLoading(false)
        // return game


        return exampleGame;
    }

    useEffect(() => {
        getGame().then(game => setGame(game))
    }, [])


    return (
        <View>

            {
                loading ?
                    <Text>Loading...</Text> :
                    game === null ?
                        <CustomButton title="Load Game" onPress={() => getGame().then(game => setGame(game))} /> :
                        <GameScreenComponents game={game} />
            }
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }}></View>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flexDirection: 'row'}}>
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
        </View>
    );
}
