import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, TextInput, Switch } from 'react-native';
import { defaultColor } from '../../Colors/LightColors'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import { saveTransaction, updateTransaction } from '../../db/Database'
import { useTransaction } from '../../context/TransactionContext';
import SaveRecurringModal from './SaveRecurringModal'

const TransactionModal = ({ isVisible, onClose, isExpensesType, subHeading, editTransactionData }) => {

    const [pickerVisible, setPickerVisible] = useState(false);
    const [mode, setMode] = useState('date');

    // const [amount, setAmount] = useState(editTransactionData?.amount.toString() || '0.00')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('')
    const [repeating, setRepeating] = useState('Never')
    const [expensesType, setExpensesType] = useState(isExpensesType)
    const [isRecurring, setIsRecurring] = useState(false)
    const [id, setId] = useState('')
    const [ogId, setOgId] = useState('')

    const { transactionRefresh, refreshKey } = useTransaction();

    useEffect(() => {
        if (editTransactionData) {
            setAmount(editTransactionData.amount.toString());
            setDate(new Date(editTransactionData.date))
            setDescription(editTransactionData.description)
            setRepeating(editTransactionData.repeating)
            setExpensesType(editTransactionData.type == 'Incomes' ? false : true)
            setOgId(editTransactionData.repeatingId)
        }
        else {
            setAmount('');
            setDate(new Date())
            setDescription('')
            setRepeating('Never')
            setExpensesType(isExpensesType)
        }
    }, [editTransactionData, refreshKey]);



    const repeatingOption = ['Never', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const handleRepeatChange = (options) => {
        setRepeating(options);

    };

    const handleSave = (id) => {
        if (editTransactionData) {
            // if (editTransactionData.repeatingId) {
            //     setIsRecurring(true)
            // } else {
            updateTransaction(
                id,
                amount,
                date,
                description,
                expensesType ? 'Expenses' : 'Incomes',
                repeating,
                () => {
                    console.log('Transaction updated successfully!');
                    transactionRefresh();
                    onClose(); // Close the modal after saving
                },
                () => {
                    console.log('Error updating transaction?');
                    // Handle error updating transaction
                }
            );
            // }
        } else {
            saveTransaction(
                amount,
                date,
                description,
                expensesType ? 'Expenses' : 'Incomes',
                repeating,
                () => {
                    console.log('Transaction saved successfully!');
                    transactionRefresh();
                    onClose(); // Close the modal after saving
                },
                () => {
                    console.log('Error saving transaction.');
                    // Handle error saving transaction
                }
            );
        }
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
                    {false && (
                        <SaveRecurringModal
                            isVisible={isRecurring}
                            onClose={() => setIsRecurring(false)}
                            editTransactionData={
                                {
                                    ogId,
                                    amount,
                                    date,
                                    description,
                                    repeating,
                                    expensesType,
                                    isRecurring
                                }} />
                    )}
                    <View style={styles.controlButtonsContainer} >
                        <TouchableOpacity onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20 }}>{subHeading}</Text>
                        <TouchableOpacity onPress={() => { handleSave(editTransactionData.id) }}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={styles.textInputRow}>

                            <TextInput
                                onChangeText={setAmount}
                                style={styles.textInput}
                                keyboardType="numeric"
                                placeholder="£0.00"
                                value={amount}
                            />
                        </View>
                        <View style={styles.dateRow}>
                            <Text>Date</Text>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                onChange={onChange}
                            />
                        </View>

                        <View style={styles.descriptionInputRow}>
                            <TextInput
                                placeholder='Description'
                                // style={styles.input}
                                onChangeText={setDescription}
                                value={description}
                            />
                        </View>

                        <View style={styles.transactionTypeButtons}>
                            <Text style={styles.transactionTypeText}>Transaction Type</Text>
                            <View style={styles.switchContainer}>
                                <Text style={styles.transactionTypelabel}>Incomes</Text>
                                <Switch
                                    value={expensesType}
                                    onValueChange={() => { setExpensesType(!expensesType) }}
                                />
                                <Text style={styles.transactionTypelabel}>Expenses</Text>
                            </View>
                        </View>

                        {/* {!editTransactionData && ( */}
                        {false && (
                            <View>
                                <TouchableOpacity style={styles.repeatingRow} onPress={() => { setPickerVisible(!pickerVisible) }}>
                                    <Text >Repeating</Text>
                                    <Text>{repeating}</Text>
                                </TouchableOpacity>
                                {pickerVisible && (
                                    <Picker
                                        selectedValue={repeating}
                                        onValueChange={handleRepeatChange}
                                    >
                                        {repeatingOption.map((options, index) => (
                                            <Picker.Item key={index} label={options} value={options} />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                        )}
                    </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        paddingTop: 30,
        height: '70%', // Adjust the height as needed
    },
    textInputRow: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textInput: {
        fontSize: 30
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 35,

    },
    descriptionInputRow: {
        marginTop: 35,

    },
    transactionTypeText: {
        flex: 1,  // This will make the text take the available space
    },
    transactionTypeButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    transactionTypelabel: {
        fontSize: 11,
        color: 'black', // Set the desired text color
    },

    repeatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 35,
    },
});

export default TransactionModal;
