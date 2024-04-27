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

    const onLogin = async () => {
        //Send username and password to server
        //If successful, navigate to the home page
        //If not, show an error message
        //TODO: remove comment after implementing the server

        // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ username, password }),
        // })

        const response = {
            status: 200,
            token: 'your_token_here'
        }

        const { token } = response;

        if (response.status === 200 && token) {
            navigation.navigate('Main')
        } else {
            alert('Invalid username or password')
        }

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
                onPress={onLogin}
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
