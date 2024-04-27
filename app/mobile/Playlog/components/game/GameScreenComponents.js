import { StyleSheet, Text, Image } from "react-native";
import textStyles from "../../styles/textStyles";

export default GameScreenComponents = ({ game }) => {
    return (
        <>
            <Text style={textStyles.default}>{game.title}</Text>
            <Image source={{ uri: game.logo }} style={styles.logo} />
            <Text style={textStyles.default}>{game.shortDescription}</Text>
            <Text style={textStyles.default}>{game.developer}</Text>
            <Text style={textStyles.default}>{game.publisher}</Text>
            <Text style={textStyles.default}>{game.publicationDate.toDateString()}</Text>
            <Text style={textStyles.default}>{game.platforms.join(', ')}</Text>
            <Text style={textStyles.default}>{game.genres.join(', ')}</Text>
            <Text style={textStyles.default}>{game.directors.join(', ')}</Text>
            <Text style={textStyles.default}>{game.producers.join(', ')}</Text>
            <Text style={textStyles.default}>{game.screenWriters.join(', ')}</Text>
            <Text style={textStyles.default}>{game.composers.join(', ')}</Text>
            <Text style={textStyles.default}>{game.countryOfOrigin}</Text>
            <Text style={textStyles.default}>{game.storeUrls.steam}</Text>
            <Text style={textStyles.default}>{game.storeUrls.gog}</Text>
            <Text style={textStyles.default}>{game.storeUrls.epic}</Text>
            <Text style={textStyles.default}>{game.criticScores.metacritic}</Text>
            <Text style={textStyles.default}>{game.criticScores.opencritic}</Text>
            <Text style={textStyles.default}>{game.criticScores.ign}</Text>
            <Text style={textStyles.default}>{game.canYouRunItUrl}</Text>
            <Text style={textStyles.default}>{game.likes}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
    }
});