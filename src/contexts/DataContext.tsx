import React, { createContext, useContext, useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

interface Loan {
  id: string;
  type: string;
  bank: string;
  amount: number;
  interestRate: number;
  tenure: number;
  emi: number;
}

interface Asset {
  id: string;
  type: string;
  name: string;
  value: number;
  monthlyReturn?: number;
}

interface Liability {
  id: string;
  type: string;
  name: string;
  amount: number;
  monthlyPayment?: number;
}

interface DataContextType {
  loans: Loan[];
  assets: Asset[];
  liabilities: Liability[];
  transactions: Transaction[];
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeLoan: (id: string) => void;
  removeAsset: (id: string) => void;
  removeLiability: (id: string) => void;
  removeTransaction: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: Date.now().toString() };
    setLoans(prev => [...prev, newLoan]);
  };

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    setAssets(prev => [...prev, newAsset]);
  };

  const addLiability = (liability: Omit<Liability, 'id'>) => {
    const newLiability = { ...liability, id: Date.now().toString() };
    setLiabilities(prev => [...prev, newLiability]);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const removeLoan = (id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id));
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const removeLiability = (id: string) => {
    setLiabilities(prev => prev.filter(liability => liability.id !== id));
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <DataContext.Provider value={{
      loans, assets, liabilities, transactions,
      addLoan, addAsset, addLiability, addTransaction,
      removeLoan, removeAsset, removeLiability, removeTransaction
    }}>
      {children}
    </DataContext.Provider>
  );
};