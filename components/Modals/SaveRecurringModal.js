import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback, TextInput, Switch } from 'react-native';
import { updatethisEventAfter } from '../../db/Database'
import { useTransaction } from '../../context/TransactionContext';
import moment from 'moment'

const SaveRecurringModal = ({ isVisible, onClose, editTransactionData }) => {
    const { transactionRefresh } = useTransaction();
    const handleAllEventAfter = () => {

        updatethisEventAfter(
            editTransactionData.ogId,
            editTransactionData.amount,
            // new Date(editTransactionData.date),
            new Date(moment(editTransactionData.date)),
            editTransactionData.description,
            editTransactionData.expensesType ? 'Expenses' : 'Incomes',
            editTransactionData.repeating,
            () => {
                console.log('Transaction updated successfully!');
                transactionRefresh();
                onClose(); // Close the modal after saving
            },
            () => {
                console.log('Error updating transaction');
                // Handle error updating transaction
            }
        );

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent} >
                    {/* <View style={styles.controlButtonsContainer}> */}
                    <Text>Update recurring event</Text>
                    <TouchableOpacity >
                        <Text>This event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAllEventAfter}>
                        <Text>This and all events after</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    {/* </View> */}
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
    modalContent: {
        backgroundColor: '#cccccc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        paddingTop: 30,
        height: '40%', // Adjust the height as needed
    },
    controlButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        alignItems: 'center'
    },

});

export default SaveRecurringModal;
