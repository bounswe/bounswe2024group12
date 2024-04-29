import { FlatList, StyleSheet, Text, View } from "react-native";
import GameCard from "../commons/GameCard";
import textStyles from "../../styles/textStyles";

const exampleGameList = [
    {
        gameId: 'exampleId',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    },
    {
        gameId: 'exampleId2',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    }, {
        gameId: 'exampleId3',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    },
    {
        gameId: 'exampleId4',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    }, {
        gameId: 'exampleId5',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    }, {
        gameId: 'exampleId6',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    },
    {
        gameId: 'exampleId7',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    }, {
        gameId: 'exampleId8',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    },
    {
        gameId: 'exampleId9',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    }, {
        gameId: 'exampleId10',
        gameLogo: "https://wallpaperaccess.com/full/204728.jpg"
    },
]

export default MoreGamesGrid = ({ games = exampleGameList }) => {
    return (
        <View style={styles.grid}>
            <Text style={textStyles.cardTitle}>More Games</Text>
            <FlatList
                data={games}
                numColumns={3}
                keyExtractor={game => game.gameId.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <GameCard gameId={item.gameId} gameLogo={item.gameLogo} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        width: '100%',
        alignItems: 'center',

    }
})