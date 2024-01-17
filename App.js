import { useEffect } from 'react'
import HomeView from './screens/HomeView';
import CalendarView from './screens/CalendarView';
import Overview from './screens/Overview';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SettingsProvider } from './context/SettingContext';
import { TransactionProvider } from './context/TransactionContext';

import { initializeDatabase, fetchTransactions, deleteTransaction } from './db/Database'
import moment from 'moment'




const Stack = createNativeStackNavigator()

function App() {

  useEffect(() => {
    initializeDatabase();
    // deleteTransaction(null)
    // const startDate = moment().subtract(1, 'month'); // Set your desired start date
    // const endDate = moment().add(1, 'month'); // Set your desired end date
    // fetchTransactions(
    //   startDate,
    //   endDate,
    //   (transactions) => {
    //     console.log('App.js', transactions)
    //   },
    //   () => {
    //     // Handle error fetching transactions
    //   }
    // );
  }, []);

  return (
    <SettingsProvider>
      <TransactionProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeView} />
            <Stack.Screen name="Calendar" component={CalendarView} />
            <Stack.Screen name="Overview" component={Overview} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </SettingsProvider>
  );
}


export default App


