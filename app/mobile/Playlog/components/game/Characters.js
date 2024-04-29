import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import textStyles from '../../styles/textStyles';

const Characters = ({game}) => {
    const characters = [
        {
            id: 1,
            name: 'Character 1',
            description: 'This is the description for Character 1.',
        },
        {
            id: 2,
            name: 'Character 2',
            description: 'This is the description for Character 2.',
        },
        // Add more characters here...
    ];

    return (
        <View>
            {characters.map((character) => (
                <View key={character.id}>

                <View  style={styles.characterContainer}>
                    <Image
                    source={{ uri: game.banner }} // Replace with your image path
                    style={styles.characterImage}
                    />
                    <View style={styles.characterInfo}>
                        <Text style={[textStyles.default, styles.characterName]}>{character.name}</Text>
                        <Text style={[textStyles.default, styles.description]}>{game.shortDescription}</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }}></View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    characterContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        color: 'lightgrey',
        fontSize: 13,
        paddingTop: 5,
    },
    characterImage: {
        width: 50,
        height: 90,
    },
    characterInfo: {
        marginLeft: 10,
    },
    characterName: {
        fontWeight: 'bold',
    },
});

export default Characters;