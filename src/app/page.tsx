"use client";

import {
  TotalStats,
  TransactionCharts,
  TransactionForm,
  TransactionList,
} from "@/components";
import { useTheme } from "@/hooks/useTheme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-500">
              Gelir/Gider Takibi
            </h1>
            <button
              className="bg-gray-100 dark:bg-background rounded-lg p-1.5 text-indigo-500"
              onClick={toggleTheme}
            >
              {theme === 'light'  ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 lg:gap-6">
            <div className="grid gap-6 lg:col-span-1">
              <TransactionForm />
              <TransactionList />
            </div>
            <div className="grid gap-6 lg:col-span-2 grid-rows-[auto_1fr]">
              <TotalStats />
              <TransactionCharts />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
