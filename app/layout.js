import { Raleway } from "next/font/google";

import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import React from 'react'
import IsOffline from '@/app/lib/isoffline'
import Bootstrap from "@/app/components/bootstrap";

import "@/app/globals.css";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], display: "swap" });

export const metadata = {
  title: "AfriqLoan",
  description: "AfriqLoan Web Application",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
        <body className={`${raleway.className}`}>
            <Bootstrap />
            <IsOffline />
            {children}
        </body>
    </html>
  )
}
