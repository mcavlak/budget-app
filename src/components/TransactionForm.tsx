"use client";

import { useTransactions } from "@/context";
import { Transaction } from "@/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import { tr } from "date-fns/locale/tr";

const defaultForm: Omit<Transaction, "id"> = {
  type: "income",
  amount: "",
  description: "",
  category: "",
  date: dayjs().toISOString(),
};

type Category = {
  name: string;
  limit: number | string;
};

const defaultCategory: Category = {
  name: "",
  limit: "",
};

export function TransactionForm() {
  const { addTransaction, getTotalExpense } = useTransactions() || {};
  const [form, setForm] = useState({ ...defaultForm });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ ...defaultCategory });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (addTransaction) {
      if (categories.length > 0 && form.category) {
        const category = categories.find(
          (category) => category.name === form.category
        );
        if (category) {
          const totalExpense = getTotalExpense ? getTotalExpense() : 0;
          const newTotal = totalExpense + Number(form.amount);

          if (newTotal >= Number(category.limit)) {
            if (
              !confirm(
                `${category.limit}₺ olan kategori limitinizi aştınız. İşlemi kaydetmek istiyor musunuz?`
              )
            ) {
              return;
            }
          } else if (newTotal >= Number(category.limit) * 0.8) {
            if (
              !confirm(
                `${category.limit}₺ olan kategori limitine yaklaşıyorsunuz. İşlemi kaydetmek istiyor musunuz?`
              )
            ) {
              return;
            }
          }
        }
      }
      addTransaction(form);
    }

    setForm({ ...defaultForm });
  };

  const setCategoriesWithLocalStorage = (categories: Category[]) => {
    localStorage.setItem("categories", JSON.stringify([...categories]));
    setCategories([...categories]);
  };

  const handleAddCategory = () => {
    if (
      newCategory.name.trim() &&
      !categories.some((category) => category.name === newCategory.name)
    ) {
      const newCategories = [...categories, newCategory];
      setCategoriesWithLocalStorage(newCategories);
      setNewCategory({ ...defaultCategory });
      setIsCategoryModalOpen(false);
      setForm({ ...form, category: newCategory.name });
    }
  };

  useEffect(() => {
    const localCategories = localStorage.getItem("categories");
    if (localCategories) {
      setCategories(JSON.parse(localCategories));
    }
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h2 className="text-lg text-foreground ">Yeni İşlem Ekle</h2>
      <hr className="mt-1 mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: "income" })}
            className={`flex-1 py-1.5 px-4 rounded-lg font-medium transition-colors ${
              form.type === "income"
                ? "bg-green-500 text-white"
                : "bg-background  text-foreground dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            Gelir
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: "expense" })}
            className={`flex-1 py-1.5 px-4 rounded-lg font-medium transition-colors ${
              form.type === "expense"
                ? "bg-red-500 text-white"
                : "bg-background  text-foreground dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            Gider
          </button>
        </div>

        <div>
          <NumericFormat
            value={form.amount}
            onValueChange={(value) =>
              setForm({ ...form, amount: Number(value.floatValue) })
            }
            placeholder="Miktar (Örn: 100,00₺)"
            className="block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
            required
            allowNegative={false}
            decimalScale={2}
            thousandSeparator="."
            decimalSeparator=","
            suffix="₺"
          />
        </div>

        <div>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={
              form.type === "income"
                ? "Açıklama (Örn: Eylül maaşı yattı)"
                : "Açıklama (Örn: X kırtasiyede harcandı)"
            }
            className="block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
            required
          />
        </div>

        <div>
          <DatePicker
            wrapperClassName="block w-full"
            className="block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
            selected={dayjs(form.date).toDate()}
            onChange={(date) =>
              setForm({ ...form, date: dayjs(date).toISOString() })
            }
            locale={tr}
            dateFormat="dd/MM/yyyy"
            maxDate={dayjs().toDate()}
            dayClassName={(date) =>
              dayjs(date).isSame(dayjs(form.date), "day")
                ? "!bg-indigo-500 text-white"
                : ""
            }
          />
        </div>

        {form.type === "expense" && (
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              title="Kategori Ekle"
              className="block w-fit rounded-md bg-indigo-50 border-0 py-1.5 px-4  text-indigo-500 font-bold ring-1 ring-inset ring-indigo-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none hover:bg-indigo-100 transition-colors dark:bg-background dark:text-foreground dark:hover:bg-background dark:ring-slate-600"
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              +
            </button>

            {isCategoryModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-card p-6 rounded-lg shadow-lg w-80">
                  <h2 className="text-lg text-foreground ">
                    Yeni Kategori Ekle
                  </h2>
                  <hr className="mt-1 mb-4" />
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
                    placeholder="Kategori adı"
                  />
                  <NumericFormat
                    value={newCategory.limit}
                    onValueChange={(value) =>
                      setNewCategory({
                        ...newCategory,
                        limit: Number(value.floatValue),
                      })
                    }
                    placeholder="Harcama limiti (Örn: 100,00₺)"
                    className="my-4 block w-full bg-background rounded-md border-0 py-1.5 px-4 text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
                    required
                    allowNegative={false}
                    decimalScale={2}
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix="₺"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsCategoryModalOpen(false);
                        setNewCategory({ name: "", limit: 100 });
                      }}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-background dark:text-foreground dark:hover:bg-slate-600"
                    >
                      İptal Et
                    </button>
                    <button
                      disabled={!newCategory}
                      onClick={handleAddCategory}
                      className="bg-indigo-500 text-white py-1.5 px-4 rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 dark:disabled:text-slate-500"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          disabled={!form.amount || !form.description}
          type="submit"
          className="w-full bg-indigo-500 text-white py-1.5 px-4 rounded-lg font-medium hover:bg-indigo-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 dark:disabled:text-slate-500"
        >
          İşlemi Kaydet
        </button>
      </form>
    </div>
  );
}
