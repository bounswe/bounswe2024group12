import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useEffect } from "react";
import textStyles from "../../styles/textStyles";

export default CategoryTab = (props) => {
    const { title, onPress = () => { }, style, isSelected} = props;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, isSelected && styles.selectedButton, style]}>
            <Text style={textStyles.default}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 50,
    },
    selectedButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    }
})