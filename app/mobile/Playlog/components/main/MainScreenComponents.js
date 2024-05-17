import { ScrollView, StyleSheet, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import CustomButton from "../buttons/CustomButton";
import GameCard from "../commons/GameCard";
import GameListCard from "../commons/GameListCard";
import MoreGamesGrid from "./MoreGamesGrid";
import ReviewListCard from "./ReviewListCard";
import MainPageBanner from "./MainPageBanner";
import { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../../context/ProfileProvider";
import SearchBar from "../commons/SearchBar";
import textStyles from "../../styles/textStyles";
import TextButton from "../buttons/TextButton";
import { useHttp } from "../../hooks/useHttp";


const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
}

export default MainScreenComponents = () => {
    const [isSearch, setIsSearch] = useState(false)
    const { username, token, isGuest, logoutHandler } = useContext(ProfileContext)
    const [gameOfTheDay, setGameOfTheDay] = useState(null);
    const [popularGames, setPopularGames] = useState([]);
    const [newGames, setNewGames] = useState([]);
    const [searchFetch, setSearchFetch] = useState(null)
    const navigation = useNavigation();
    const searchRef = useRef(null);
    const {sendRequest,isLoading,error,clearError} = useHttp()
    const {sendRequest: fetchPopular,isLoading: popularLoading,error: popularError,clearError: clearPopularError} = useHttp()
    const {sendRequest: fetchRecent,isLoading: recentLoading,error: recentError,clearError: clearRecentError} = useHttp()

    useEffect(() => {
        return () => {
            if (searchRef.current) {
                searchRef.current.cancel();
            }
        }
    }, [searchFetch])

    const onLogout = () => {
        logoutHandler();
        navigation.replace('Login');
    }


    const onSearch = (query) => {
        //TODO: handle previous search abortion
        if (query) {
            console.log(process.env.EXPO_PUBLIC_URL)
            const fetchPromise = sendRequest(`${process.env.EXPO_PUBLIC_URL}/search-game`,
            'POST',
            JSON.stringify({search_term: query}),
            {
                'Content-Type': 'application/json',
            }).then((response) => {               
                setSearchFetch(response)
                console.log(response)
            }, (error) => {
                if (!error.isCanceled) {
                console.log("not canceled")
                console.error(error);
            }else{
                console.log("canceled")
            }
        });
        }
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

    const fetchPopularGames = async () => {
        try{
            const response = await fetchPopular(`${process.env.EXPO_PUBLIC_URL}/popular-games`,
            'GET',
            null,
            {
                'Content-Type': 'application/json',
            });
            if(popularError){
                console.error("Popular fetch:",popularError)
            }
            setPopularGames(response.games);
        } catch (e) {
            console.error('Error fetching popular games:', e);
        }
    }

    const fetchNewGames = async () => {
        try{
            const response = await fetchRecent(`${process.env.EXPO_PUBLIC_URL}/new-games`,
            'GET',
            null,
            {
                'Content-Type': 'application/json',
            });
            if(recentError){
                console.error("New fetch:",recentError);
            }
            setNewGames(response.games);
        } catch (e) {
            console.error('Error fetching new games:', e);
        }
    }

    useEffect(() => {
        fetchGame();
        fetchPopularGames();
        fetchNewGames();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer} style={styles.scrollView}>
            <SearchBar onSearch={onSearch} onFocus={onFocus} onBlur={onBlur} />
            {!isSearch ? <>
                <Text style={textStyles.title}>Welcome {!isGuest ? username : "Guest"}</Text>
                <MainPageBanner game={gameOfTheDay} />
                {popularLoading 
                    ? (<Text style={textStyles.default}>{"Loading..."}</Text> )
                    :(<GameListCard title={"Popular Games"} gameList={popularGames} />)}
                {recentLoading 
                    ? (<Text style={textStyles.default}>{"Loading..."}</Text> )
                    :(<GameListCard title={"New Games"} gameList={newGames} />)}                
                <ReviewListCard title={"Recent Reviews"} />
                <ReviewListCard title={"Friend Reviews"} />
                <MoreGamesGrid />
                <CustomButton title="Logout" onPress={onLogout} />
            </>
            :<>
                {searchFetch && searchFetch.games.map((game) => (
                    <TextButton key={game.game_slug} title={game.gameLabel} onPress={() => navigation.navigate('Game', { gameId: game.game_slug })} />
                ))}
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