import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

import Header from "@/app/(dashboard)/header";
import Sidebar from "@/app/(dashboard)/sidebar";
import Footer from "@/app/(dashboard)/footer"

export const metadata = {
  title: "AfriqLoan - Dashboard",
  description: "Welcome to AfriqLoan Web",
};

export default function DashboardLayout({ children }) {

  return (
    <div className="d-flex flex-column" style={{minHeight:'100vh'}}>
      <Header />
      <main className="flex-fill d-flex flex-column flex-lg-row bg-white">
        <Suspense fallback={
            <div className="d-none d-lg-flex flex-column gap-2 col-lg-2 px-4 bg-light">
                <h5><Skeleton width={140} className="rounded-pill" /></h5>
                <h5><Skeleton width={80} className="rounded-pill" /></h5>
                <h5><Skeleton width={110} className="rounded-pill" /></h5>
                <h5><Skeleton width={120} className="rounded-pill" /></h5>
                <h5><Skeleton width={80} className="rounded-pill" /></h5>
                <h5><Skeleton width={110} className="rounded-pill" /></h5>
            </div>
        }>
            <Sidebar />
        </Suspense>
        <div id="content" className="col-12 col-lg-10 bg-tertiary border border-1">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
