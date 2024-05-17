import { useEffect, useState } from "react";
import CustomButton from "../components/buttons/CustomButton";
import Screen from "../layouts/Screen";
import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import GameScreenComponents from "../components/game/GameScreenComponents";
import CategoryTab from "../components/game/CategoryTab";
import { ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";

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

export default GameScreen = () => {
    const route = useRoute();
    const { gameId } = route.params;

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGame = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/game-info/${gameId}`;
            console.log("Fetching game from:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const game = await response.json(); // Await the response.json() method
            setGame(game);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGame();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="yellow" />;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View>
            {game ? (
                <GameScreenComponents game={game} />
            ) : (
                <Text>No game info available.</Text>
            )}
        </View>
    );

    // const getGame = async () => {
    //   setLoading(true);
    //   let fetchedGame;
    //   try {
    //     console.log(`${process.env.EXPO_PUBLIC_API_URL}`);
    //     const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/game_info/${gameId}`);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     fetchedGame = await response.json();
    //   } catch (e) {
    //     console.error(e);
    //   } finally {
    //     setLoading(false);
    //   }
    //   return fetchedGame;
    // };

    // useEffect(() => {
    //   getGame().then((gameData) => setGame(gameData));
    // }, []); // Dependency array with gameId to fetch new game info if gameId changes
}
