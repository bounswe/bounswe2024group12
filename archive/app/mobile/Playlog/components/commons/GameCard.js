import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Touchable, TouchableOpacity } from "react-native";

export default GameCard = ({ gameId, gameLogo, onPress }) => {
    const navigation = useNavigation();
    if (!onPress) {
        onPress = () => {
            navigation.navigate('Game', { gameId });
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: gameLogo }} style={styles.icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: null,
        margin: 5,
        alignItems: 'center',
    },
    icon: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
});