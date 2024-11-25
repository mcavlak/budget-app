import { Transaction } from "./types";

export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
};

export const getTransactions = (): Transaction[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};
