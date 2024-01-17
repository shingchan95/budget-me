import React, { createContext, useContext, useState, useCallback } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const transactionRefresh = useCallback(() => {
        setRefreshKey((prevKey) => prevKey + 1);
    }, []);

    return (
        <TransactionContext.Provider value={{ refreshKey, transactionRefresh }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};
