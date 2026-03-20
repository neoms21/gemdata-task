import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useInstruments } from "./hooks/useInstruments";
import { PriceCell } from "./components/PriceCell";
import { StatusBadge } from "./components/StatusBadge";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const instruments = useInstruments();

  // 1. Efficient Filtering (Interviewers love useMemo)
  const filteredInstruments = useMemo(() => {
    return instruments.filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assetClass.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, instruments]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Market Data Utility
        </h1>
        <p className="text-slate-500">
          Independent Price Verification Dashboard
        </p>
      </header>

      <main className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by ticker or class..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Instrument</th>
                <th className="px-6 py-4 text-right">Mid Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInstruments.map((inst) => (
                <tr
                  key={inst.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">
                      {inst.ticker}
                    </div>
                    <div className="text-xs text-slate-500">
                      {inst.assetClass}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <PriceCell value={inst.valuation.mid} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inst.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${inst.confidenceScore * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


