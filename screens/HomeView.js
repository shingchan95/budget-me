import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, FlatList } from 'react-native';
import SettingsModal from '../components/Modals/SettingModal';
import Swiper from 'react-native-swiper';
import moment from 'moment'

import { defaultColor } from '../Colors/LightColors'

import HeadingText from '../components/HeadingText';
import ChartGroup from '../components/ChartGroup';
import ItemList from '../components/ItemList';

import { fetchTransactions, sumTransactions } from '../db/Database';
import { useTransaction } from '../context/TransactionContext';


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettings } from '../context/SettingContext'

function HomeView() {

    const [incomesData, setIncomesData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    // const [refreshKey, setRefreshKey] = useState(0);
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const { refreshKey, transactionRefresh } = useTransaction();
    const [totalIncome, setTotalIncome] = useState(null)
    const [totalExpense, setTotalExpense] = useState(null)

    const { settings, startDate } = useSettings();

    const monthStartDay = settings.monthStartDay;
    const [endDate, setEndDate] = useState(null)

    const income = settings.income

    useEffect(() => {
        if (startDate) {
            const calculatedEndDate = moment(startDate).add(moment(startDate).daysInMonth(), 'days');
            setEndDate(calculatedEndDate);
        }
        // console.log('settings', settings.income)
    }, [startDate, income]);

    useEffect(() => {
        // const endDate = moment().endOf('month'); // Set your desired end date 
        fetchTransactions(
            startDate,
            endDate,
            (transactions) => {
                // Sort transactions by date (assuming there's a 'date' property)
                transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Filter transactions based on type
                const incomeTransactions = transactions.filter((t) => t.type === 'Incomes');
                const expenseTransactions = transactions.filter((t) => t.type === 'Expenses');
                setIncomesData(incomeTransactions);
                setExpensesData(expenseTransactions);
            },
            () => {
                console.error('Error.');
            }
        );
        sumTransactions(startDate, endDate, 'Incomes',
            (totalAmount) => {
                setTotalIncome(totalAmount + parseInt(settings.income))
            },
            () => {
                console.error('Error calculating total income.');
            }
        );
        sumTransactions(startDate, endDate, 'Expenses',
            (totalAmount) => {
                setTotalExpense(totalAmount)
            },
            () => {
                console.error('Error calculating total income.');
            }
        );

    }, [startDate, endDate, refreshKey]);




    const onRefresh = useCallback(() => {

        setTimeout(() => {
            transactionRefresh(); // Trigger the refresh
            setRefreshing(false);
        }, 650);
    }, [transactionRefresh]);

    const toggleSettingsModal = () => {
        setSettingsVisible(!isSettingsVisible);
    };


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Pressable style={styles.topButtonContainer} onPress={toggleSettingsModal}>
                <Text style={{ color: defaultColor.white }}>Setting</Text>
                <SettingsModal isVisible={isSettingsVisible} onClose={toggleSettingsModal} />
            </Pressable>
            <HeadingText description={'Home'} />

            <Swiper style={styles.swiperContainer} >
                <ChartGroup
                    subHeading={'Monthly Income:'}
                    ProgressText={'BALANCE'}
                    subHeadingAmount={settings.income}
                    ProgressPercent={100 - ((parseInt(settings.income) - (totalIncome - totalExpense)) / parseInt(settings.income) * 100)}
                    ProgressAmount={totalIncome - totalExpense}
                />
                <ChartGroup
                    subHeading={'Monthly Budget:'}
                    ProgressText={'LEFT TO SPENT'}
                    subHeadingAmount={settings.budgetAmount}
                    ProgressPercent={100 - ((parseInt(settings.budgetAmount) - (parseInt(settings.budgetAmount) - totalExpense)) / parseInt(settings.budgetAmount) * 100)}
                    ProgressAmount={parseInt(settings.budgetAmount) - totalExpense}
                />
            </Swiper>

            <FlatList
                style={styles.dataContainer}
                data={[{ type: 'Incomes', data: incomesData }, { type: 'Expenses', data: expensesData }]}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <GestureHandlerRootView>
                        <ItemList
                            key={item.type}
                            data={item.data}
                            subHeading={item.type === 'Incomes' ? 'Incomes' : 'Recent Expenses'}
                            onSave={transactionRefresh}
                            isExpensesType={item.type === 'Incomes' ? false : true}
                        />
                    </GestureHandlerRootView>
                )}
            />

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    topButtonContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: defaultColor.primeCol,
        paddingTop: 50,
        paddingRight: 20
    },
    swiperContainer: {
        height: '100%',
        backgroundColor: defaultColor.primeCol,
        // marginBottom: 20,
        // paddingBottom: 40
    },

    dataContainer: {
        flex: 1,
        backgroundColor: defaultColor.white,
        marginBottom: 10,
        paddingBottom: 10
    },

});


export default HomeView