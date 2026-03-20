import type { Instrument } from "../types/instrument";

export function StatusBadge({ status }: { status: Instrument["status"] }) {
  const styles = {
    Verified: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Outlier: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full border text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
