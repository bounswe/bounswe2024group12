import { useEffect, useState } from "react";
import CustomButton from "../components/buttons/CustomButton";
import Screen from "../layouts/Screen";
import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import GameScreenComponents from "../components/game/GameScreenComponents";
import CategoryTab from "../components/game/CategoryTab";
import { ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";

export default GameScreen = () => {
    const route = useRoute();
    const { gameId } = route.params;

    const [game, setGame] = useState(null);
    const [characters, setCharacters] = useState(null);
<<<<<<< Updated upstream
    const [popularReviews, setPopularReviews] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
=======
    const [reviews, setReviews] = useState([]);
>>>>>>> Stashed changes
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

    const fetchCharacters = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/game-characters/${gameId}`;
            console.log("Fetching characters from:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const characters = await response.json(); // Await the response.json() method
            setCharacters(characters);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

<<<<<<< Updated upstream
    const fetchpopularReviews = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/popular-popularReviews-game`;
            console.log("Fetching popularReviews from:", url);
=======
    const fetchReviews = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/popular-reviews-game`;
            console.log("Fetching reviews from:", url);
>>>>>>> Stashed changes
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ game: gameId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
<<<<<<< Updated upstream
            const popularReviews = await response.json();
            setPopularReviews(popularReviews);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchRecentReviews = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/recent-reviews`;
            console.log("Fetching recent reviews from:", url);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const recentReviews = await response.json();
            setRecentReviews(recentReviews);
=======
            const reviews = await response.json();
            setReviews(reviews);
>>>>>>> Stashed changes
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGame();
        fetchCharacters();
<<<<<<< Updated upstream
        fetchpopularReviews();
        fetchRecentReviews();
=======
        fetchReviews();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <GameScreenComponents game={game} characters={characters} popularReviews={popularReviews} recentReviews={recentReviews} />
=======
                <GameScreenComponents game={game} characters={characters} reviews={reviews} />
>>>>>>> Stashed changes
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
