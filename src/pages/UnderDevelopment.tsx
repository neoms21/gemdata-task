import { Hammer } from "lucide-react";

export function UnderDevelopment() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-32 px-8 min-h-[500px]">
      <Hammer className="w-16 h-16 mb-6 text-slate-300" strokeWidth={1} />
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Under Development
      </h2>
      <p className="max-w-sm">
        This page is coming soon. We are actively working on bringing this feature to you.
      </p>
    </div>
  );
}
