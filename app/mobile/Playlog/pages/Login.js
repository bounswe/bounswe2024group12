import { StyleSheet, Text, TextInput, View } from "react-native"
import Screen from "../layouts/Screen"
import textStyles from "../styles/textStyles"
import { useState } from "react"
import CustomButton from "../components/buttons/CustomButton"
import TextButton from "../components/buttons/TextButton"
import { useNavigation } from "@react-navigation/native"

export default Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    const navigateSignUp = () => {
        navigation.navigate('Signup')
    }

    return (
        <Screen>
            <Text style={[textStyles.title, styles.title]}>Login Page</Text>
            <TextInput
                placeholder="Username"
                placeholderTextColor={'#888'}
                style={[textStyles.default, styles.input]}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor={'#888'}
                style={[textStyles.default, styles.input]}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <CustomButton
                title="Login"
                onPress={() => alert(`Username: ${username}\nPassword: ${password}`)}
                style={styles.button} />
            <View style={styles.bottomView}>
                <TextButton title="Forgot Password?" onPress={() => alert('Forgot Password?')} />
                <TextButton title="Continue as a Guest" onPress={() => alert('Guest')} />
                <TextButton title="Sign Up" onPress={navigateSignUp} />
            </View>

        </Screen>
    );
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        width: '80%',
        color: 'black',
    },
    button: {
        marginVertical: 25,
        width: '80%',
    },
    title: {
        marginVertical: 20,
    },
    bottomView: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        margin: 10,
    }
});
