import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'

const SettingsContext = createContext();

const settingsReducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE_SETTINGS':
            return { ...state, ...action.payload };
        case 'UPDATE_SETTING':
            return { ...state, [action.payload.key]: action.payload.value };
        default:
            return state;
    }
};

const SettingsProvider = ({ children }) => {
    const [settings, dispatch] = useReducer(settingsReducer, {
        monthStartDay: 1,
        budgetAmount: 0,
        useTouchID: false,
        income: 0
    });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const initializeSettings = async (dispatch) => {
            try {
                // Load settings from AsyncStorage
                const storedSettings = await AsyncStorage.getItem('settings');
                // console.log('Stored settings during initialization:', storedSettings);

                const initialSettings = storedSettings ? JSON.parse(storedSettings) : {};

                // Dispatch initial settings to the context
                if (parseInt(initialSettings.monthStartDay) > parseInt(moment().date())) {
                    setStartDate(moment().subtract(1, 'months').date(initialSettings.monthStartDay))
                    console.log(moment().subtract(1, 'months').date(initialSettings.monthStartDay))
                    console.log('larger')
                } else {
                    setStartDate(moment().set('date', initialSettings.monthStartDay));
                    console.log(moment().set('date', initialSettings.monthStartDay))
                    console.log('not')
                }


                dispatch({ type: 'INITIALIZE_SETTINGS', payload: initialSettings });

            } catch (error) {
                console.error('Error initializing settings:', error);
            }
        };

        initializeSettings(dispatch);
    }, []);


    const updateSetting = async (key, value) => {
        try {
            // Save the setting to AsyncStorage
            await AsyncStorage.setItem('settings', JSON.stringify({ ...settings, [key]: value }));
            // console.log('Updated settings:', { ...settings, [key]: value });

            // Update the context state
            if (key === 'monthStartDay') {
                // Dispatch initial settings to the context
                if (parseInt(value) > parseInt(moment().date())) {
                    setStartDate(moment().subtract(1, 'months').date(value))
                    console.log(moment().subtract(1, 'months').date(value))
                    console.log('key larger')
                } else {
                    setStartDate(moment().set('date', value));
                    console.log(moment().set('date', value))
                    console.log('key not')
                }
                // setStartDate(moment().set('date', value));
                setEndDate(moment(startDate).add(moment(startDate).daysInMonth(), 'days'));
            }
            dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
        } catch (error) {
            console.error('Error updating setting:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, startDate, endDate }}>
            {children}
        </SettingsContext.Provider>
    );
};


const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export { SettingsProvider, useSettings };
