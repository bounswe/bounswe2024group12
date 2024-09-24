import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({
    onFocus=()=>{},
    onBlur = ()=>{},
    onSearch = (query) => {},
}) => {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search..."
                onChangeText={onSearch}
                onFocus={onFocus}
                onBlur={onBlur}
                // Add any additional props or event handlers you need
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 10,
        width:"100%"
    },
    input: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },
});

export default SearchBar;