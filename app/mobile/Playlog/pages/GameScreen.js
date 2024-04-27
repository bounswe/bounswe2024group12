import { useEffect, useState } from "react";
import CustomButton from "../components/buttons/CustomButton";
import Screen from "../layouts/Screen";
import { Text } from "react-native";
import GameScreenComponents from "../components/game/GameScreenComponents";

const exampleGame = {
    title: "The Witcher 3",
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
}

export default GameScreen = ({ gameId = 'exampleGameId' }) => {

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(false);

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
        <Screen>
            {
                loading ?
                    <Text>Loading...</Text> :
                    game === null ?
                        <CustomButton title="Load Game" onPress={() => getGame().then(game => setGame(game))} /> :
                        <GameScreenComponents game={game} />
            }
        </Screen>
    );
}
