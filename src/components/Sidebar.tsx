import {
  LayoutGrid,
  FileText,
  Layers,
  Globe,
  CreditCard,
  Upload,
  Users,
  Key,
  History,
  BoxSelect
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const platformLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Services", href: "/services", icon: Layers },
    { name: "Universe Definition", href: "/universe-definition", icon: Globe },
    { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { name: "Data Drop", href: "/data-drop", icon: Upload },
  ];

  const adminLinks = [
    { name: "Team", href: "/team", icon: Users },
    { name: "API Keys", href: "/api-keys", icon: Key },
    { name: "Historical Upload", href: "/historical-upload", icon: History },
  ];

  return (
    <aside className="w-64 bg-[#f8f9fa] border-r border-slate-200 h-screen sticky top-0 flex flex-col pt-8 pb-4 shrink-0">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] border border-blue-200 bg-white flex items-center justify-center text-blue-500 shadow-sm">
          <BoxSelect className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-slate-900 leading-tight">Acme Bank</span>
          <span className="text-sm text-slate-500 leading-tight">Contributor</span>
        </div>
      </div>

      <div className="px-3 flex flex-col gap-0.5 mb-8">
        <span className="px-3 text-xs font-semibold text-slate-500 mb-2">Platform</span>
        {platformLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-100/60 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-100 font-normal hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
               <>
                 <link.icon
                   className={`w-[18px] h-[18px] ${isActive ? "text-blue-600" : "text-slate-700"}`}
                   strokeWidth={1.5}
                 />
                 {link.name}
               </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="px-3 flex flex-col gap-0.5">
        <span className="px-3 text-xs font-semibold text-slate-500 mb-2">Admin</span>
        {adminLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-100/60 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-100 font-normal hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
               <>
                 <link.icon
                   className={`w-[18px] h-[18px] ${isActive ? "text-blue-600" : "text-slate-700"}`}
                   strokeWidth={1.5}
                 />
                 {link.name}
               </>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
