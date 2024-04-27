
export default GameScreenComponents = ({ game }) => {
    return (
        <>
            <Text>{game.title}</Text>
            <Image source={{ uri: game.logo }} style={styles.logo} />
            <Text>{game.shortDescription}</Text>
            <Text>{game.developer}</Text>
            <Text>{game.publisher}</Text>
            <Text>{game.publicationDate.toDateString()}</Text>
            <Text>{game.platforms.join(', ')}</Text>
            <Text>{game.genres.join(', ')}</Text>
            <Text>{game.directors.join(', ')}</Text>
            <Text>{game.producers.join(', ')}</Text>
            <Text>{game.screenWriters.join(', ')}</Text>
            <Text>{game.composers.join(', ')}</Text>
            <Text>{game.countryOfOrigin}</Text>
            <Text>{game.storeUrls.steam}</Text>
            <Text>{game.storeUrls.gog}</Text>
            <Text>{game.storeUrls.epic}</Text>
            <Text>{game.criticScores.metacritic}</Text>
            <Text>{game.criticScores.opencritic}</Text>
            <Text>{game.criticScores.ign}</Text>
            <Text>{game.canYouRunItUrl}</Text>
            <Text>{game.likes}</Text>
        </>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
    }
});