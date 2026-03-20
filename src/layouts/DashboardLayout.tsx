import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
