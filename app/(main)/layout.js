import {Raleway } from "next/font/google";

import "bootstrap/dist/css/bootstrap.css";
import "@/app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Bootstrap from "@/app/components/bootstrap";
import Header from "@/app/(main)/header";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], display: 'swap' });

export const metadata = {
  title: "AfriqLoan",
  description: "AfriqLoan Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.className}`}>
        <Bootstrap />
        <Header />
        {children}
      </body>
    </html>
  );
}
