"use client";

import { getTransactions, saveTransactions, Transaction } from "@/lib";
import dayjs from "dayjs";
import React, { createContext, useContext, useState, useEffect } from "react";

type LineChartDataItem = {
  date: string;
  income: number;
  expense: number;
};

type PiChartDataItem = {
  name: string;
  value: number;
};

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getLineChartData: () => LineChartDataItem[];
  getPieChartData: (date: Date | null) => PiChartDataItem[];
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = getTransactions();
    setTransactions(stored);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: window.crypto.randomUUID(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const getLineChartData = () => {
    const grouped = transactions.reduce(
      (acc: Record<string, LineChartDataItem>, transaction) => {
        const date = dayjs(transaction.date).format("DD/MM/YYYY");
        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }
        if (transaction.type === "income") {
          acc[date].income += Number(transaction.amount);
        } else {
          acc[date].expense += Number(transaction.amount);
        }
        return acc;
      },
      {}
    );

    return Object.values(grouped);
  };

  const getPieChartData: TransactionContextType["getPieChartData"] = (date) => {
    const filteredTransactions = date
      ? transactions.filter((t) => dayjs(t.date).isSame(dayjs(date), "month"))
      : transactions;

    const grouped = filteredTransactions.reduce(
      (acc: Record<string, PiChartDataItem>, transaction) => {
        const category = transaction.category;
        if (category) {
          if (!acc[category]) {
            acc[category] = { name: category, value: 0 };
          }
          acc[category].value += Number(transaction.amount);
        } else {
          acc["other"] = { name: "Diğer", value: 0 };
          acc["other"].value += Number(transaction.amount);
        }
        return acc;
      },
      {}
    );

    return Object.values(grouped);
  };

  const value = {
    transactions,
    addTransaction,
    getTotalIncome,
    getTotalExpense,
    getLineChartData,
    getPieChartData,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
