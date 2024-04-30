import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import textStyles from '../../styles/textStyles';

export default GameTab = ({ game }) => {
    return (
        <View>
            <Text style={[textStyles.default, styles.title]}>{game.title}</Text>
            <Text style={[textStyles.default, styles.description]}>{game.longDescription}</Text>
            <ScrollView horizontal>
                <Image
                    source={{ uri: game.banner }} // Replace with your image path
                    style={styles.image}
                />
                <Image
                    source={{ uri: game.banner }} // Replace with your image path
                    style={styles.image}
                />
                <Image
                    source={{ uri: game.banner }} // Replace with your image path
                    style={styles.image}
                />
            </ScrollView>
        </View>
    );
};

const styles = {
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 30,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        paddingLeft: 10,
        paddingTop: 30,
        paddingBottom: 30,
        color : 'lightgrey',
    },
    image: {
        width: 200,
        height: 200,
        marginRight: 10,
    },
};