import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Logo } from "./components/Logo";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pomorimo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed top-2 flex items-center ml-8">
          <Logo className="w-10" />
          <span className="font-bold ml-2 text-2xl">Pomorimo</span>
        </div>
        <UserProvider>{children}</UserProvider>
        <Analytics />
      </body>
    </html>
  );
}