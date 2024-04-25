import { StyleSheet, Text, TextInput } from "react-native"
import Screen from "../layouts/Screen"
import textStyles from "../styles/textStyles"
import { useState } from "react"
import CustomButton from "../components/buttons/CustomButton"

export default Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <Screen>
            <Text style={[textStyles.title, styles.title]}>Login</Text>
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