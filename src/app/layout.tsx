import { TransactionProvider } from "@/context/TransactionContext";
import "@/app/globals.css";
import { Nunito } from "next/font/google";
import "@/lib/dayjs";
import "react-datepicker/dist/react-datepicker.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: 'Gelir/Gider Takibi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="bg-background text-foreground dark:bg-background dark:text-foreground">
        <TransactionProvider>{children}</TransactionProvider>
      </body>
    </html>
  );
}
