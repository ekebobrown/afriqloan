import { Raleway } from "next/font/google";

import "bootstrap/dist/css/bootstrap.css";
import "@/app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Header from "@/app/(dashboard)/header";
import Sidebar from "@/app/(dashboard)/sidebar";
import Footer from "@/app/(dashboard)/footer"
import Bootstrap from "@/app/components/bootstrap";

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
        <main className="d-flex flex-column flex-md-row bg-white" style={{minHeight:'92vh'}}>
          <div className="d-flex col-12 col-md-3 bg-light justify-content-center py-4 fs-6 text-body-secondary">
            <Sidebar />
          </div>
          <div className="col-12 col-md-9">
            <Header />
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
