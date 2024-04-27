import Login from './pages/Login';
import Signup from './pages/Signup';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameScreen from './pages/GameScreen';
import MainScreen from './pages/MainScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Login Page" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Login Page" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

