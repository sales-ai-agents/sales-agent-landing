import React from "react";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body relative overflow-x-hidden">
      <main>{children}</main>
      <Footer />
    </div>
  );
}
