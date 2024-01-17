// DateStampContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DateStampContext = createContext();

export const DateStampProvider = ({ children }) => {
    const [lastInteractionDate, setLastInteractionDate] = useState(null);

    // Load the date stamp from AsyncStorage on component mount
    useEffect(() => {
        const loadDateStamp = async () => {
            try {
                const storedDate = await AsyncStorage.getItem('lastInteractionDate');
                if (storedDate) {
                    setLastInteractionDate(new Date(storedDate));
                }
            } catch (error) {
                console.error('Error loading date stamp:', error);
            }
        };

        loadDateStamp();
    }, []);

    // Update the date stamp in AsyncStorage and state
    const updateDateStamp = async (newDate) => {
        try {
            await AsyncStorage.setItem('lastInteractionDate', new Date().toISOString());
            setLastInteractionDate(newDate);
        } catch (error) {
            console.error('Error updating date stamp:', error);
        }
    };

    return (
        <DateStampContext.Provider value={{ lastInteractionDate, updateDateStamp }}>
            {children}
        </DateStampContext.Provider>
    );
};

export const useDateStamp = () => {
    const context = useContext(DateStampContext);
    if (!context) {
        throw new Error('useDateStamp must be used within a DateStampProvider');
    }
    return context;
};
