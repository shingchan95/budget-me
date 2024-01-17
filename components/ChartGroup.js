import { View, Text, Pressable, StyleSheet } from 'react-native';
import { defaultColor } from '../Colors/LightColors'
import CustomPageSwitch from './Buttons/CustomPageSwitch';
import CircularProgress from './Figure/CircularProgress';
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


const HandleViewMore = () => {
    console.log('View More >')
}
const HandleAdjust = () => {
    console.log('Adjust')
}
const ChartGroup = ({ subHeading, subHeadingAmount, ProgressAmount, ProgressText, ProgressPercent }) => {

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
        <View style={styles.chartContainer}>
            <View style={styles.chartRowOne}>
                <Text style={styles.budgetText}> {subHeading} £{subHeadingAmount}</Text>
                <CustomPageSwitch title={'View More >'} onPress={HandleViewMore}></CustomPageSwitch>
            </View>
            <View style={styles.chartRowTwo}>
            </View>
            <View style={styles.chartRowThree}>
                <CircularProgress
                    size={200}
                    strokeWidth={12}
                    text={'£' + ProgressAmount}
                    progressPercent={ProgressPercent}
                    bgColor={ProgressAmount > 0 ? defaultColor.white : defaultColor.red}
                    pgColor={ProgressAmount > 0 ? defaultColor.secPrimeCol : defaultColor.red}
                    textColor={defaultColor.white}
                    textSize={30}
                    percentText={ProgressText}
                />
            </View>

        </View>
    );
};



const styles = StyleSheet.create({
    chartContainer: {
        paddingTop: 20,
    },
    chartRowOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '3%',

    },
    budgetText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: defaultColor.white,
    },
    chartRowTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '3%',
        marginTop: '1%'

    },
    chartRowThree: {
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default ChartGroup;



