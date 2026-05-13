import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const AppChrome = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);
