"use client";

import { useTransactions } from "@/context";

export function TotalStats() {
  const { getTotalIncome, getTotalExpense } = useTransactions() || {};
  const totalIncome = getTotalIncome ? getTotalIncome() : 0;
  const totalExpense = getTotalExpense ? getTotalExpense() : 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-fit">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h3 className="text-foreground text-sm font-medium mb-2">Toplam Gelir</h3>
        <p className="text-2xl font-bold text-green-600">
          {totalIncome.toLocaleString("tr-TR")} ₺
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-lg p-6">
        <h3 className="text-foreground text-sm font-medium mb-2">Toplam Gider</h3>
        <p className="text-2xl font-bold text-red-500">
          {totalExpense.toLocaleString("tr-TR")} ₺
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-lg p-6">
        <h3 className="text-foreground text-sm font-medium mb-2">Genel Bakiye</h3>
        <p
          className={`text-2xl font-bold ${
            balance >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {balance.toLocaleString("tr-TR")} ₺
        </p>
      </div>
    </div>
  );
}
