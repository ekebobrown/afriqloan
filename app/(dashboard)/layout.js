import Header from "@/app/(dashboard)/header";
import Sidebar from "@/app/(dashboard)/sidebar";
import Footer from "@/app/(dashboard)/footer"

export const metadata = {
  title: "AfriqLoan - Dashboard",
  description: "Welcome to AfriqLoan Web",
};

export default function DashboardLayout({ children }) {

  return (
    <>
      <Header />
      <main className="d-flex flex-column flex-md-row bg-white" style={{minHeight:'92vh'}}>
        <Sidebar />
        <div className="col-12 col-md-10 bg-tertiary">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
