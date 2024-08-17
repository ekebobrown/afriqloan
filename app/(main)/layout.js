import Header from "@/app/(main)/header";

export default function RootLayout({ children }) {
  return (
    <>
      <header className="sticky-top">
        <Header />
      </header>
      {children}
    </>
  );
}
