import { ScrollView, StyleSheet, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import CustomButton from "../buttons/CustomButton";
import GameCard from "../commons/GameCard";
import GameListCard from "../commons/GameListCard";
import MoreGamesGrid from "./MoreGamesGrid";
import ReviewListCard from "./ReviewListCard";
import MainPageBanner from "./MainPageBanner";
import { useContext } from "react";
import { ProfileContext } from "../../context/ProfileProvider";

export default MainScreenComponents = () => {

    const { username, token, isGuest, logoutHandler } = useContext(ProfileContext)

    const navigation = useNavigation();

    const onLogout = () => {
        logoutHandler();
        navigation.replace('Login');
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* <Text style={textStyles.header}>Main Screen</Text> */}
            <Text style={textStyles.title}>Welcome {!isGuest ? username : "Guest"}</Text>
            <MainPageBanner />
            <GameListCard title={"Popular Games"} />
            <GameListCard title={"Recent Games"} />
            <ReviewListCard title={"Recent Reviews"} />
            <ReviewListCard title={"Friend Reviews"} />
            <MoreGamesGrid />
            <CustomButton title="Logout" onPress={onLogout} />
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    scrollView: {

    }
})