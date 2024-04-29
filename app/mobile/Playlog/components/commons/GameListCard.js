import { ScrollView, StyleSheet, Text, View } from "react-native"
import textStyles from "../../styles/textStyles"

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
    },
]

export default GameListCard = ({ gameList = exampleGameList, title }) => {

    return <View style={styles.list}>
        <Text style={textStyles.title}>{title}</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}>
            {gameList.map((game) => (
                <GameCard key={game.gameId} gameId={game.gameId} gameLogo={game.gameLogo} />
            ))}
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    list: {
        marginVertical: 0,
    },
    scrollView: {
        marginTop: 10,
    }
})