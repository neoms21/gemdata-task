import { ChevronDown, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { UniverseDefinitionItem } from "../types/universe-definition";

interface UniverseDefinitionToolbarProps {
  data: UniverseDefinitionItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (value: string) => void;
}

export function UniverseDefinitionToolbar({
  data,
  searchTerm,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  serviceFilter,
  onServiceFilterChange,
}: UniverseDefinitionToolbarProps) {
  // Extract unique values from data
  const regions = Array.from(new Set(data.map((item) => item.region))).sort();
  const services = Array.from(new Set(data.map((item) => item.service))).sort();

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
        {/* Region Filter */}
        <div className="relative pt-1.5">
          <span className="absolute -top-1 left-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight bg-white leading-none z-10">
            Region
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 transition-colors cursor-pointer outline-none">
              {regionFilter}
              <ChevronDown
                className="w-3.5 h-3.5 text-gray-400"
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
              <DropdownMenuRadioGroup
                value={regionFilter}
                onValueChange={onRegionFilterChange}
              >
                <DropdownMenuRadioItem
                  value="All"
                  className="px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  All
                </DropdownMenuRadioItem>
                {regions.map((region) => (
                  <DropdownMenuRadioItem
                    key={region}
                    value={region}
                    className="px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 rounded-md uppercase"
                  >
                    {region}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Service Filter */}
        <div className="relative pt-1.5">
          <span className="absolute -top-1 left-2.5  text-[10px] font-bold text-gray-400 uppercase tracking-tight bg-white leading-none z-10">
            Service
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 transition-colors max-w-[180px] truncate cursor-pointer outline-none">
              {serviceFilter === "All" ? "All" : serviceFilter}
              <ChevronDown
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg max-h-[300px] overflow-y-auto">
              <DropdownMenuRadioGroup
                value={serviceFilter}
                onValueChange={onServiceFilterChange}
              >
                <DropdownMenuRadioItem
                  value="All"
                  className="px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  All
                </DropdownMenuRadioItem>
                {services.map((service) => (
                  <DropdownMenuRadioItem
                    key={service}
                    value={service}
                    className="px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 rounded-md"
                  >
                    {service}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Type Filter - Static for now */}
        <button className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 transition-colors">
          Type
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 transition-colors">
          <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
          Date
        </button>
      </div>
    </div>
  );
}
