import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import textStyles from '../../styles/textStyles';

const Credits = ({game}) => {
    const creditsList = [
        { title: 'Developer', people: ['John Doe', 'Jane Smith'] },
        { title: 'Designer', people: ['Alice Johnson', 'Bob Williams'] },
        { title: 'Tester', people: ['Charlie Brown', 'Diana Davis'] },
    ];

    return (
        <View>
            <Text style={[textStyles.default, styles.title]}>Credits</Text>
            {creditsList.map((credit, index) => (
                <View key={index} style={styles.container}>
                    <Text style={textStyles.default}>
                        <Text style={[textStyles.default, styles.bold]}>{credit.title}:</Text> 
                        <Text style={textStyles.default}>
                            {credit.people.join(', ')}
                        </Text>
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingLeft: 10,
    },
    bold: {
        fontWeight: 'bold'
    },
    container: {
        padding: 10
    }
});

export default Credits;
