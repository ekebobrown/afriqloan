import Header from "@/app/(main)/header";

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
