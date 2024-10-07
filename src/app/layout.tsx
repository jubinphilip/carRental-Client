import type { Metadata } from "next";
import './globals.css'
import Navbar from "./user/components/navbar/navbar";
import Footer from "./user/components/Footer/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
