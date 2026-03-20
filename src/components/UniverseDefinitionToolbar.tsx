import { ChevronDown, Calendar } from "lucide-react";

interface UniverseDefinitionToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UniverseDefinitionToolbar({
  searchTerm,
  onSearchChange,
}: UniverseDefinitionToolbarProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-[320px] relative">
        <input
          type="text"
          placeholder="Filter name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 bg-white"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {["Region", "Service", "Type"].map((label) => (
          <button
            key={label}
            className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
          >
            {label}
            <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
          </button>
        ))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors">
          <Calendar className="w-4 h-4" strokeWidth={2} />
          Date
        </button>
      </div>
    </div>
  );
}
