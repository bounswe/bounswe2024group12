import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "../../pages/GameScreen"
import MainScreen from "../../pages/MainScreen"
import Login from '../../pages/Login';
import Signup from '../../pages/Signup';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { ProfileContext } from "../../context/ProfileProvider";

const Stack = createNativeStackNavigator();

export default NavigationContent = () => {

    const { isLoggedIn } = useContext(ProfileContext);

    return (
        <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={headerHide} />
                <Stack.Screen name="Signup" component={Signup} options={headerHide} />
                {isLoggedIn && <>
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Game" component={GameScreen} />
                </>}
            </Stack.Navigator>
        </NavigationContainer>)
}

const headerHide = {
    headerShown: false,
}