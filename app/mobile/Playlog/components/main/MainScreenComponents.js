import { ScrollView, StyleSheet, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import CustomButton from "../buttons/CustomButton";
import GameCard from "../commons/GameCard";
import GameListCard from "../commons/GameListCard";
import MoreGamesGrid from "./MoreGamesGrid";

export default MainScreenComponents = () => {

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={textStyles.header}>Main Screen</Text>
            <Text style={textStyles.default}>Welcome to the Main Screen</Text>
            <GameListCard title={"Popular Games"} />
            <GameListCard title={"Recent Games"} />
            <MoreGamesGrid />
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    scrollView: {

    }
})