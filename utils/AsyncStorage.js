import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSetting = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving setting:', error);
    }
};

export const getSetting = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
};
