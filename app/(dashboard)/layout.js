import { Raleway } from "next/font/google";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Header from "@/app/(dashboard)/header";
import Sidebar from "@/app/(dashboard)/sidebar";
import Footer from "@/app/(dashboard)/footer"
import Bootstrap from "@/app/components/bootstrap";
import IsOnline from "@/app/lib/isonline";

import "@/app/globals.css";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], display: "swap" });

export const metadata = {
  title: "AfriqLoan",
  description: "AfriqLoan Web Application",
};

export default function DashboardLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${raleway.className}`}>
        <Bootstrap />
        <Header />
        <main className="d-flex flex-column flex-md-row bg-white" style={{minHeight:'92vh'}}>
          <Sidebar />
          <div className="col-12 col-md-9">
            {children}
          </div>
        </main>
        <Footer />
        <IsOnline />
      </body>
    </html>
  );
}
