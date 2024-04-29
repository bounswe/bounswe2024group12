import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'react-native';

const Screen = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Screen;

