import { View, Text, Pressable, StyleSheet } from 'react-native';
import { pageSwitchTheme } from '../../Colors/LightColors'
import {
    useFonts,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
} from '@expo-google-fonts/inter';

const CustomHeaderButton = ({ onPress, title, color }) => {

    let [fontsLoaded] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    if (!fontsLoaded) {
        return null; // Or render a loading indicator
    }

    return (
        <Pressable onPress={onPress}>
            <Text style={[styles.buttonText, color && { color: color }]}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: pageSwitchTheme.text,
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default CustomHeaderButton;