import { useState, useEffect } from "react";

export function PriceCell({ value }: { value: number }) {
  const [prevValue, setPrevValue] = useState(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setFlash(value > prevValue ? "up" : "down");
  }

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const flashClass =
    flash === "up"
      ? "bg-green-500 text-white font-bold transition-none"
      : flash === "down"
        ? "bg-red-500 text-white font-bold transition-none"
        : "bg-transparent text-slate-900 transition-colors duration-500";

  return (
    <div className={`px-2 py-1 inline-block rounded ${flashClass}`}>
      {value.toFixed(4)}
    </div>
  );
}
