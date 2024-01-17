import { View, Text, Pressable, StyleSheet } from 'react-native';
import { buttonTheme } from '../../Colors/LightColors'
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

const CustomButton = ({ onPress, title }) => {

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
        <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
};



const styles = StyleSheet.create({
    button: ({ pressed }) => ({
        backgroundColor: pressed ? buttonTheme.onPressed : buttonTheme.background,
        padding: 10,
        borderRadius: 35,
        alignItems: 'center',
        alignSelf: 'flex-start',

    }),
    buttonText: {
        color: buttonTheme.text,
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default CustomButton;