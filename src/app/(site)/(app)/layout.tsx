import React from "react";
import DashboardShell from "./dashboard-shell";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default AppLayout;
