import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import textStyles from "../../styles/textStyles";

export default TextButton = (props) => {
    const { title, onPress = () => { }, isActive = true, style } = props;
    return (
        <TouchableOpacity onPress={onPress} disabled={!isActive} style={[styles.button, style]}>
            <Text style={[textStyles.default, styles.buttonText, !isActive && styles.disabledButtonText]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: null,
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#3AA6B9',
        textAlign: 'center',
    },
    disabledButtonText: {
        color: 'gray',
    },
})