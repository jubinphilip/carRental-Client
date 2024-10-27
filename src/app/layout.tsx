import type { Metadata } from "next";
import './globals.css'
import Navbar from "./user/components/navbar/navbar";
import Footer from "./user/components/Footer/Footer";
import {AppContextProvider } from "@/context/appContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Wrapping the application with Context  */}
        <AppContextProvider>
        <Navbar/>
        {children}
        <Footer/>
        </AppContextProvider>
      </body>
    </html>
  );
}
