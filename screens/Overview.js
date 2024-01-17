import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, StyleSheet, useColorScheme } from 'react-native';

function Overview() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Overview
            </Text>
            <StatusBar style="auto" />
        </SafeAreaView>
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


export default Overview