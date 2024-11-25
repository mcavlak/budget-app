export type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number | string;
  description: string;
  date: string;
};
