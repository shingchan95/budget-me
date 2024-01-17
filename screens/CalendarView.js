import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, StyleSheet, useColorScheme } from 'react-native';

function CalendarView() {
    return (
        <View style={styles.container}>
            <Text>Calendar
            </Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default CalendarView