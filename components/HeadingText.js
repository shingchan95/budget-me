import { View, Text, Pressable, StyleSheet } from 'react-native';
import { defaultColor } from '../Colors/LightColors'
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

const HeadingText = ({ description }) => {

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
        <View style={styles.headerContainer}>
            <Text style={styles.headingText} >{description}</Text>
        </View>
    );
};



const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: defaultColor.primeCol,
        paddingTop: 5,
        justifyContent: 'center',
    },
    headingText: {
        fontFamily: 'Inter_600SemiBold',
        color: defaultColor.white,
        fontSize: 30
    },
});

export default HeadingText;

