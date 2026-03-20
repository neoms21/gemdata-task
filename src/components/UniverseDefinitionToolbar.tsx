import { ChevronDown, Calendar as CalendarIcon, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
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
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedCount?: number;
  onDelete?: () => void;
}

export function UniverseDefinitionToolbar({
  data,
  searchTerm,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  serviceFilter,
  onServiceFilterChange,
  dateRange,
  onDateRangeChange,
  selectedCount = 0,
  onDelete,
}: UniverseDefinitionToolbarProps) {
  // Extract unique values from data
  const regions = Array.from(new Set(data.map((item) => item.region))).sort();
  const services = Array.from(new Set(data.map((item) => item.service))).sort();

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateRangeChange(undefined);
  };

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

      <div className="flex-1">
        {selectedCount > 0 && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            Delete ({selectedCount})
          </button>
        )}
      </div>

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
        
        {/* Date Range Picker */}
        <div className="relative pt-1.5">
          <span className="absolute -top-1 left-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight bg-white leading-none z-10">
            Date
          </span>
          <Popover>
            <PopoverTrigger
              className={cn(
                "bg-gray-50/80 hover:bg-gray-100 border border-gray-200 h-8 px-2.5 py-1.5 rounded-lg text-xs font-normal text-gray-700 flex items-center gap-2 transition-colors outline-none pr-2",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
              <div className="flex items-center gap-2">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
                {dateRange && (
                  <div
                    onClick={handleClearDate}
                    className="p-0.5 hover:bg-gray-200 rounded-sm transition-colors cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-600" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
