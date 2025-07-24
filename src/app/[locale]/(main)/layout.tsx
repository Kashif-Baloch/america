import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
