import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body relative">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
