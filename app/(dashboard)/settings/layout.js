import Sidebar from "@/app/(dashboard)/settings/sidebar";

export const metadata = {
  title: "AfriqLoan - Settings"
};

export default function SettingsLayout({ children }) {

  return (
    <div className="h-100 d-flex flex-column flex-md-row">
        <div className="flex-fill col-md-2 shadow">
          <Sidebar />
        </div>
        <div className="flex-fill col-12 col-md-10 bg-tertiary">
          {children}
        </div>
    </div>
  );
}
