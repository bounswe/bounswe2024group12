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

    const navigateLogin = () => {
        navigation.navigate('Login Page')
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
                onPress={() => alert(`Username: ${username}\nPassword: ${password}\nE-Mail: ${email}`)}
                style={styles.button} />
            <TextButton title="Already Registered? Login" onPress={navigateLogin} />
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