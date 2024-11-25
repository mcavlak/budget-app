"use client";

import { useTransactions } from "@/context";
import dayjs from "dayjs";

export function TransactionList() {
  const { transactions } = useTransactions() || {};

  return (
    <div className="h-full max-h-80 overflow-auto bg-card rounded-lg shadow-lg p-6 pt-0">
      <div className="bg-card sticky top-0 pt-6">
        <h2 className="text-lg text-foreground">İşlem Geçmişi</h2>
        <hr className="mt-1 mb-4" />
      </div>
      <div className="space-y-4">
        {transactions?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Henüz işlem bulunmuyor
          </p>
        ) : (
          transactions?.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-4 bg-background rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-slate-700"
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {transaction.description}
                </h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {dayjs(transaction.date).format("D MMMM YYYY")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {transaction.type === "expense" && transaction.category && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 dark:bg-card dark:text-indigo-300 text-indigo-500"
                  >
                    {transaction.category}
                  </span>
                )}

                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {transaction.amount.toLocaleString("tr-TR")} ₺
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
