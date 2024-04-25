import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import textStyles from "../../styles/textStyles";

export default CustomButton = (props) => {
    const { title, onPress = () => { }, isActive = true, style } = props;
    return (
        <TouchableOpacity onPress={onPress} disabled={!isActive} style={[styles.button, !isActive && styles.disabledButton, style]}>
            <Text style={textStyles.default}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3AA6B9',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    }
})