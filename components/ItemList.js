import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, PanResponder, Animated } from 'react-native';
import { defaultColor } from '../Colors/LightColors'
import TransactionModal from './Modals/TransactionModal';
import moment from 'moment'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { deleteTransaction } from '../db/Database'
import { useTransaction } from '../context/TransactionContext';
import SettingsModal from './Modals/SettingModal';

import CustomButton from './Buttons/CustomButton';
import CustomPageSwitch from './Buttons/CustomPageSwitch';
import { useSettings } from '../context/SettingContext'


import { useFonts, Inter_400Regular, Inter_500Medium, } from '@expo-google-fonts/inter';





const ItemList = ({ data, subHeading, isExpensesType }) => {

    const { transactionRefresh } = useTransaction();
    const [isTransactionVisible, setTransactionVisible] = useState(false);
    const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });
    const [editTransactionData, setEditTransactionData] = useState(false);
    const { settings, startDate } = useSettings();


    const toggleTransactionModal = () => {
        setTransactionVisible(!isTransactionVisible);
        setEditTransactionData(false);
    };


    const itemsPerPage = 3;
    const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);
    const hasMoreItems = visibleItemCount < data.length;

    const toggleSettingsModal = () => {
        setSettingsVisible(!isSettingsVisible);
    };
    const [isSettingsVisible, setSettingsVisible] = useState(false);

    const handleViewMore = () => {
        const nextVisibleItemCount = Math.min(visibleItemCount + itemsPerPage, data.length);
        setVisibleItemCount(nextVisibleItemCount);
    };


    const handleDelete = (id) => {
        deleteTransaction(
            id,
            () => {
                console.log('Transaction deleted successfully!');
                transactionRefresh();
                // Implement any other logic or state update if needed
            },
            (error) => {
                console.log('Error deleting transaction.', error);
                // Handle error deleting transaction
            }
        );
    }


    const handleEdit = (item) => {
        setTransactionVisible(true);
        setEditTransactionData(item);
    }

    const rightSwipeActions = (id) => {
        return (

            <TouchableOpacity
                style={{
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => handleDelete(id)}
            >

                <Text
                    style={{
                        color: defaultColor.white,
                        // paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 15,
                        // paddingVertical: 10,
                        fontSize: 15
                    }}
                >
                    Delete
                </Text>
            </TouchableOpacity >
        );
    };

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.itemListContainer}>
            <Text style={styles.subHeading}>{subHeading}</Text>
            <View style={styles.listRowOne}>
                <CustomButton title={'New +'} onPress={toggleTransactionModal}></CustomButton>
                <TransactionModal
                    isVisible={isTransactionVisible}
                    onClose={toggleTransactionModal}
                    isExpensesType={isExpensesType}
                    subHeading={editTransactionData ? 'EDIT TRANSACTION' : 'NEW TRANSACTION'}
                    editTransactionData={editTransactionData}
                />
                <CustomPageSwitch
                    title={'View More >'}
                    // onPress={HandleViewMore} 
                    color={defaultColor.primeCol}
                />
            </View>
            <View >
                {settings.income > 0 && isExpensesType === false && startDate &&
                    < TouchableOpacity onPress={toggleSettingsModal}>
                        <SettingsModal isVisible={isSettingsVisible} onClose={toggleSettingsModal} />
                        <Text style={styles.dateStyle}>{moment(startDate).format("dddd, D MMM").toUpperCase()}</Text>
                        <View style={styles.itemRows}>
                            <Text>Monthly Income</Text>
                            <Text>£{settings.income}</Text>
                        </View>

                    </TouchableOpacity >}
                {data.slice(0, visibleItemCount).map((item) => (
                    <Swipeable
                        renderRightActions={() => rightSwipeActions(item.id)}
                        key={item.id}
                    >

                        <TouchableOpacity onPress={() => { handleEdit(item) }}>
                            <Text style={styles.dateStyle}>{moment(item.date).format("dddd, D MMM").toUpperCase()}</Text>
                            <View style={styles.itemRows}>
                                <Text>{item.description}</Text>
                                <Text>£{item.amount}</Text>
                            </View>

                        </TouchableOpacity >
                    </Swipeable>
                ))}
                {hasMoreItems && (
                    <TouchableOpacity onPress={handleViewMore}>
                        <View style={styles.loadMoreRow}>
                            <Text>{`Load More`}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

        </View >

    );
};



const styles = StyleSheet.create({
    itemListContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    subHeading: {
        fontFamily: 'Inter_500Medium',
        fontSize: 25
    },
    listRowOne: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 8
    },
    dateStyle: {
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
        color: defaultColor.greyFour,
    },
    itemRows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        borderBottomColor: defaultColor.greyThree,
        borderBottomWidth: 1,
        paddingBottom: 7,
        paddingTop: 2,
    },
    loadMoreRow: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },

});

export default ItemList;



