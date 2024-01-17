// Database.js
import * as SQLite from 'expo-sqlite';
import moment from 'moment'
import uuid from 'react-native-uuid';


const db = SQLite.openDatabase('transactionsV4.db');

const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS transactionsV4 (
                id TEXT PRIMARY KEY,
                amount REAL,
                date TEXT,
                description TEXT,
                type TEXT,
                repeating TEXT,
                lastUpdate TEXT,
                repeatingId TEXT
              );`
        );
    });
};

const fetchTransactions = (startDate, endDate, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            `SELECT * FROM transactionsV4 
            WHERE date >= ? AND date <= ?;`,
            [moment(startDate).startOf('day').toISOString(), moment(endDate).endOf('day').toISOString()],
            (_, result) => {
                const transactions = [];
                for (let i = 0; i < result.rows.length; i++) {
                    const transaction = result.rows.item(i)
                    transactions.push(transaction);
                }
                onSuccess(transactions);
            },
            (_, error) => {
                console.error('Error fetching transactions:', error);
                onError();
            }
        );
    });
};

const sumTransactions = (startDate, endDate, type, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            `SELECT SUM(amount) AS totalAmount FROM transactionsV4 
            WHERE date >= ? AND date <= ? AND type = ?;`,
            [
                moment(startDate).startOf('day').toISOString(),
                moment(endDate).endOf('day').toISOString(),
                type,
            ],
            (_, result) => {
                const totalAmount = result.rows.item(0).totalAmount || 0;
                onSuccess(totalAmount);
            },
            (_, error) => {
                console.error('Error summing transactions:', error);
                onError();
            }
        );
    });
};

const saveTransaction = (amount, date, description, type, repeating, onSuccess, onError) => {
    const id = uuid.v4();

    db.transaction(
        (tx) => {
            if (repeating === 'Never') {
                tx.executeSql(
                    `INSERT INTO transactionsV4 (id, amount, date, description, type, repeating) VALUES (?, ?, ?, ?, ?, ?);`,
                    [id, amount, formatDate(date), description, type, repeating],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            const savedTransaction = {
                                id,
                                amount,
                                date: formatDate(date),
                                description,
                                type,
                                repeating,
                            };
                            console.log('Transaction saved successfully!');
                            onSuccess(savedTransaction);
                        }
                        else {
                            console.log('Error saving transaction. No rows affected.');
                            onError();
                        }
                    },
                    (_, error) => {
                        console.error('Error during SQL execution:', error);

                        onError();
                    }
                );
            } else {
                const repeatIncrement = getRepeatIncrement(repeating);
                const endOfYearDate = moment().endOf('year')
                const endOfMonthDate = moment().endOf('month')
                const originalTransactionDate = date;
                let repeatTransactionDate = date

                const repeatingTrans = []
                const OGTransaction = {
                    id,
                    amount,
                    date: formatDate(repeatTransactionDate),
                    description,
                    type,
                    repeating,
                    repeatingId: id
                };
                repeatingTrans.push(OGTransaction)

                let count = 1
                while (moment(repeatTransactionDate).isBefore(endOfMonthDate)) {
                    if (repeating === 'Daily' || repeating === 'Weekly') {
                        repeatTransactionDate = moment(repeatTransactionDate).add(repeatIncrement, 'days').toISOString() //Increment by days 
                    } else {
                        repeatTransactionDate = moment(originalTransactionDate).add(count * repeatIncrement, 'months').toISOString();//Increment by months
                    }

                    if (moment(repeatTransactionDate).isBefore(endOfMonthDate)) {
                        const repeatID = count + 'REPEATING' + id
                        const repeatTransaction = {
                            id: repeatID,
                            amount,
                            date: repeatTransactionDate,
                            description,
                            type,
                            repeating,
                            repeatingId: id
                        };
                        repeatingTrans.push(repeatTransaction)
                        count++
                    }
                }
                // console.log('repeatingTrans', repeatingTrans)
                // Prepare the SQL statement for inserting repeating transactions
                const insertRepeatingTransactionStatement = `
                 INSERT INTO transactionsV4 (id, amount, date, description, type, repeating, lastUpdate, repeatingId)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

                // Execute the prepared statement for each repeating transaction
                repeatingTrans.forEach((transaction) => {
                    tx.executeSql(
                        insertRepeatingTransactionStatement,
                        [
                            transaction.id,
                            transaction.amount,
                            transaction.date,
                            transaction.description,
                            transaction.type,
                            transaction.repeating,
                            transaction.lastUpdate,
                            transaction.repeatingId,
                        ],
                        (_, result) => {
                            if (result.rowsAffected > 0) {
                                onSuccess(transaction)
                            } else {
                                onError('Error saving repeating transaction. No rows affected.');
                            }
                        },
                        (_, error) => {
                            console.error('Error during SQL execution:', error);
                        }
                    );
                });
            }
        },
        (error) => {
            console.error('Error during transaction:', error);
        }
    );
};


const updateTransaction = (id, amount, date, description, type, repeating, onSuccess, onError) => {
    db.transaction((tx) => {

        tx.executeSql(
            `UPDATE transactionsV4 
             SET amount = ?, date = ?, description = ?, type = ?, repeating = ?
             WHERE id = ?;`,
            [amount, formatDate(date), description, type, repeating, id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    const updatedTransaction = {
                        id,
                        amount,
                        date: formatDate(date),
                        description,
                        type,
                        repeating,
                    };
                    onSuccess(updatedTransaction);
                } else {
                    onError();
                }
            }
        );
    });
};

const deleteTransaction = (id, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            `DELETE FROM transactionsV4 WHERE id = ?;`,
            [id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    onSuccess();
                } else {
                    onError("No rows affected. Transaction may not exist or an issue occurred.");
                }
            },
            (_, error) => {
                console.error('Error during SQL execution:', error);
                onError(error);
            }
        );
    });
};

const updateLastUpdate = (date, id, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE transactionsV4 
             SET  lastUpdate = ?
             WHERE id = ?;`,
            [date, id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    const updatedTransaction = {
                        lastUpdate: date,
                        id,
                    };
                    onSuccess(updatedTransaction);
                } else {
                    onError();
                }
            },
            (_, error) => {
                onError();
            }
        );
    });
};

const updateRepatingTransaction = (id, amount, date, description, type, repeating, thisEventAfter, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE transactionsV4 
             SET amount = ?, date = ?, description = ?, type = ?, repeating = ?
             WHERE id = ?;`,
            [amount, formatDate(date), description, type, repeating, id],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    const updatedTransaction = {
                        id,
                        amount,
                        date,
                        description,
                        type,
                        repeating,
                    };

                    if (thisEventAfter) {
                        // Update all events with the same repeatingId that occur after the provided date
                        tx.executeSql(
                            `UPDATE transactionsV4 
                             SET amount = ?, date = ?, description = ?, type = ?, repeating = ?
                             WHERE repeatingId = ? AND date > ?;`,
                            [amount, formatDate(date), description, type, repeating, id, formatDate(date)],
                            (_, result) => {
                                onSuccess(updatedTransaction);
                            }
                        );
                    } else {
                        onSuccess(updatedTransaction);
                    }
                } else {
                    onError();
                }
            }
        );
    });
};

const updatethisEventAfter = (id, amount, date, description, type, repeating, onSuccess, onError) => {
    db.transaction((tx) => {

        tx.executeSql(
            `UPDATE transactionsV4 
            SET amount = ?, date= ? description = ?, type = ?, repeating = ?
            WHERE repeatingId = ? AND date > ?;`,

            [amount, formatDate(date), description, type, id, repeating, formatDate(date)],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    const updatedTransaction = {
                        id,
                        amount,
                        date,
                        description,
                        type,
                        repeating,
                    };
                    onSuccess(updatedTransaction);
                } else {
                    onError();
                }
            },
            (_, error) => {
                console.error('Update error:', error);
                onError(error);
            }
        );
    });
};


// Helper function to calculate repeat increments
const getRepeatIncrement = (repeating) => {
    switch (repeating) {
        case 'Daily':
            return 1;
        case 'Weekly':
            return 7;
        case 'Monthly':
            return 1;
        case 'Quarterly':
            return 3;
        case 'Yearly':
            return 12;
        default:
            return 0;
    }
};


const formatDate = (date) => {
    // Implement your date formatting logic here
    if (date && typeof date.toISOString === 'function') {
        // Implement your date formatting logic here
        return date.toISOString();
    } else {
        console.error('Invalid date:', date);
        return date; // or handle the error in a way that makes sense for your application
    }
};


export { initializeDatabase, saveTransaction, fetchTransactions, deleteTransaction, updateTransaction, updatethisEventAfter, sumTransactions };
