"use client";

import { useTransactions } from "@/context";
import { renderActiveShape } from "@/lib";
import { useState } from "react";
import DatePicker from "react-datepicker";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { tr } from "date-fns/locale";
import dayjs from "dayjs";
import { ActiveShape } from "recharts/types/util/types";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

export function TransactionCharts() {
  const { getLineChartData, getPieChartData } = useTransactions() || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState<Date | null>(new Date());

  const lineChartData = getLineChartData ? getLineChartData() : [];
  const pieChartData = getPieChartData ? getPieChartData(date) : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-lg text-foreground">Gelir/Gider Grafiği</h2>
        <hr className="mt-1 mb-4" />
        <div className="w-full h-[400px]">
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  className="text-sm"
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis className="text-sm" tick={{ fill: "#6B7280" }} tickFormatter={(value) => `${value.toLocaleString("tr-TR")}₺`}/>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  name="Gelir"
                  strokeWidth={2}
                  dot={{ stroke: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  name="Gider"
                  strokeWidth={2}
                  dot={{ stroke: "#EF4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500 flex justify-center items-center h-full">
              Veri bulunamadı
            </div>
          )}
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-foreground">Kategori Bazlı Harcamalar</h2>
          <DatePicker
            wrapperClassName="inline-flex w-24 ml-auto"
            className="inline-flex w-24 bg-background rounded-md border-0 py-0 px-2 text-center text-foreground ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
            selected={dayjs(date).toDate()}
            onChange={(date) => setDate(date)}
            locale={tr}
            showMonthYearPicker
            dateFormat="MMM / yy"
            maxDate={dayjs().toDate()}
            dayClassName={(date) =>
              dayjs(date).isSame(dayjs(date), "month")
                ? "!bg-indigo-500 text-white"
                : ""
            }
          />
        </div>
        <hr className="mt-1 mb-4" />
        <div className="w-full h-[400px]">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill={"#818cf8"}
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500 flex justify-center items-center h-full">
              Veri bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
