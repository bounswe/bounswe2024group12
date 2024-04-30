import { StyleSheet, Text, TextInput } from "react-native"
import Screen from "../layouts/Screen"
import textStyles from "../styles/textStyles"
import { useState } from "react"
import CustomButton from "../components/buttons/CustomButton"
import TextButton from "../components/buttons/TextButton"
import { useNavigation } from "@react-navigation/native"

export default Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation()

    const signupHandler = async () => {
        // Call the signup API
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/signup`, {
                method: 'POST',
                body: JSON.stringify({ username, password, email }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response)

            // Parse the response
            // const responseJson = await response.json();
            // const responseData = responseJson.data;

            if (response.status === 201) {
                alert('Signup successful')
                navigation.navigate('Login')
            } else {
                alert('Signup failed')
                throw new Error('Signup failed');
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    const navigateLogin = () => {
        navigation.navigate('Login')
    }

    return (
        <Screen>
            <Text style={[textStyles.title, styles.title]}>Sign Up Page</Text>
            <TextInput
                placeholder="E-Mail"
                textContentType="emailAddress"
                style={[textStyles.default, styles.input]}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Username"
                textContentType="username"
                style={[textStyles.default, styles.input]}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                placeholder="Password"
                textContentType="password"
                style={[textStyles.default, styles.input]}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <CustomButton
                title="Sign Up"
                onPress={signupHandler}
                style={styles.button} />
            <TextButton title={`Already Registered?\nLogin`} onPress={navigateLogin} />
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
    }
});