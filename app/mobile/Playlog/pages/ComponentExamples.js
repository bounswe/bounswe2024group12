import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/buttons/CustomButton';
import TextButton from '../components/buttons/TextButton';
import Screen from '../layouts/Screen';

export default ComponentExamples = () => {
    return <Screen>
        <CustomButton title="CustomButton Active" onPress={() => alert('Hello World')} />
        <CustomButton title="CustomButton Disabled" onPress={() => alert('Hello World')} isActive={false} />
        <TextButton title="TextButton Active" onPress={() => alert('Hello World')} />
        <TextButton title="TextButton Disabled" onPress={() => alert('Hello World')} isActive={false} />
    </Screen>
}
const styles = StyleSheet.create({

});
