import { Hammer } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export function UnderDevelopment() {
  return (
    <div className="flex flex-col w-full h-full">
      <Breadcrumbs />
      <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-500 py-32 px-8 min-h-[500px]">
      <Hammer className="w-16 h-16 mb-6 text-slate-300" strokeWidth={1} />
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Under Development
      </h2>
      <p className="max-w-sm">
        This page is coming soon. We are actively working on bringing this feature to you.
      </p>
    </div>
  </div>
  );
}
