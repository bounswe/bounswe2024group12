import { ScrollView, StyleSheet, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import CustomButton from "../buttons/CustomButton";
import GameCard from "../commons/GameCard";
import GameListCard from "../commons/GameListCard";
import MoreGamesGrid from "./MoreGamesGrid";
import ReviewListCard from "./ReviewListCard";
import MainPageBanner from "./MainPageBanner";
import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../../context/ProfileProvider";
import SearchBar from "../commons/SearchBar";

export default MainScreenComponents = () => {
    const [isSearch, setIsSearch] = useState(false)
    const { username, token, isGuest, logoutHandler } = useContext(ProfileContext)

    const [gameOfTheDay, setGameOfTheDay] = useState(null);
    const [popularGames, setPopularGames] = useState(null);

    const navigation = useNavigation();

    const onLogout = () => {
        logoutHandler();
        navigation.replace('Login');
    }

    const onSearch = (query) => {
        console.log(query);
    }

    const onFocus = () => {
        setIsSearch(true)
    }

    const onBlur = () => {
        setIsSearch(false)
    }

    const fetchGame = async () => {
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/game-of-the-day`;
            console.log("Fetching game of the day from:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const fetchedGame = await response.json();
            setGameOfTheDay(fetchedGame);
        } catch (e) {
            console.error('Error fetching game of the day:', e);
        }
    };

    useEffect(() => {
        fetchGame();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
            <SearchBar onSearch={onSearch} onFocus={onFocus} onBlur={onBlur} />
            {!isSearch && <>
                <Text style={textStyles.title}>Welcome {!isGuest ? username : "Guest"}</Text>
                <MainPageBanner game={gameOfTheDay} />
                <GameListCard title={"Popular Games"} />
                <GameListCard title={"Recent Games"} />
                <ReviewListCard title={"Recent Reviews"} />
                <ReviewListCard title={"Friend Reviews"} />
                <MoreGamesGrid />
                <CustomButton title="Logout" onPress={onLogout} />
            </>}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        width:'100%'
    },
    scrollViewContainer: {
        // alignItems: 'center',
        // justifyContent: 'center',
    }
});