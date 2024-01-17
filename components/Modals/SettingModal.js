import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, TextInput, Switch } from 'react-native';
import { defaultColor } from '../../Colors/LightColors'
import { Picker } from '@react-native-picker/picker'
import { useSettings } from '../../context/SettingContext';
import _debounce from 'lodash.debounce';


const SettingsModal = ({ isVisible, onClose }) => {

    const [pickerVisible, setPickerVisible] = useState(false);
    const { settings, updateSetting } = useSettings();
    const [localMonthStartDay, setLocalMonthStartDay] = useState();
    const [localIncome, setLocalIncome] = useState();
    const [localBudgetAmount, setLocalBudgetAmount] = useState();
    const [localUseTouchID, setLocalUseTouchID] = useState();



    const showPicker = () => {
        setPickerVisible(!pickerVisible);
    };

    const hidePicker = () => {
        setPickerVisible(false);
    };

    // const handleDayChange = (day) => {
    //     setLocalMonthStartDay(day);
    // };

    // const handleIncomeChange = (income) => {
    //     setLocalIncome(income);
    // };

    // const handleBudgetChange = (amount) => {
    //     setLocalBudgetAmount(amount);
    // };

    // const handleTouchIDToggle = () => {
    //     setLocalUseTouchID((prev) => !prev);
    // };
    useEffect(() => {
        // Update local state when settings change
        setLocalMonthStartDay(settings.monthStartDay);
        setLocalIncome(settings.income);
        setLocalBudgetAmount(settings.budgetAmount);
        setLocalUseTouchID(settings.useTouchID);
    }, [settings]);

    const handleDayChange = (day) => {
        updateSetting('monthStartDay', day);
    };
    const handleIncomeChange = (income) => {
        updateSetting('income', income);
    };
    const handleBudgetChange = (amount) => {
        updateSetting('budgetAmount', amount);
    };

    const handleTouchIDToggle = () => {
        updateSetting('isTouchIDEnabled', !settings.isTouchIDEnabled);
    };
    const handleClose = () => {
        // Update settings when the modal is closed
        // updateSetting('monthStartDay', localMonthStartDay);
        // updateSetting('income', localIncome);
        // updateSetting('budgetAmount', localBudgetAmount);
        // updateSetting('useTouchID', localUseTouchID);

        // Close the modal
        onClose();
    };


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer} >

                <View style={styles.modalContent} >
                    <TouchableWithoutFeedback onPress={hidePicker}>
                        <View style={styles.controlButtonsContainer} >
                            <TouchableOpacity onPress={handleClose}>
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                    <ScrollView stlye={styles.settingListContainer}>
                        <TouchableOpacity style={styles.settingItem} onPress={showPicker}>
                            <Text style={styles.label} >Month Start Day</Text>
                            <Text>{localMonthStartDay}</Text>
                        </TouchableOpacity>
                        {pickerVisible && (
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={localMonthStartDay}
                                    onValueChange={handleDayChange}
                                    style={styles.picker}
                                >
                                    {[...Array(31)].map((_, index) => (
                                        <Picker.Item key={index} label={`${index + 1}`} value={index + 1} />
                                    ))}
                                </Picker>
                            </View>
                        )}
                        <TouchableWithoutFeedback onPress={hidePicker}>
                            <View>
                                <View style={styles.settingItem}>
                                    <Text style={styles.label}>Monthly Income</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder="Enter amount"
                                        value={localIncome ? localIncome.toString() : ''}
                                        onChangeText={handleIncomeChange}
                                    />
                                </View>
                                <View style={styles.settingItem}>
                                    <Text style={styles.label}>Budget Amount</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder="Enter amount"
                                        value={localBudgetAmount ? localBudgetAmount.toString() : ''}
                                        onChangeText={handleBudgetChange}
                                    />
                                </View>
                                <View style={styles.settingItem}>
                                    <Text style={styles.label}>Face ID/ Touch ID</Text>
                                    <Switch
                                        value={localUseTouchID}
                                        onValueChange={handleTouchIDToggle}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                    </ScrollView>
                </View>
            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Align modal to the bottom
    },
    controlButtonsContainer: {
        alignItems: 'flex-end',
        paddingBottom: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        paddingTop: 60,
        height: '100%', // Adjust the height as needed
    },
    settingItem: {
        paddingVertical: 10,
        borderBottomColor: defaultColor.greyThree,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20
    },
    label: {
        fontSize: 16,
        color: 'black', // Set the desired text color
    },
    bottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginTop: 5,
    },
    pickerContainer: {
        borderBottomColor: defaultColor.greyThree,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    picker: {
        height: '100%',
        width: '100%', // Take up the full width
        flex: 1
    },
});

export default SettingsModal;
