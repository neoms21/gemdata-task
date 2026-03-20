import { type ColumnDef } from "@tanstack/react-table";
import { type UniverseDefinitionItem } from "../../types/universe-definition";
import { Checkbox } from "../../components/ui/checkbox";
import { Download, Info, MoreVertical, Upload } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";

export const columns: ColumnDef<UniverseDefinitionItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const originalDate = row.original.originalDate;

      if (date === "Latest" && originalDate) {
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-gray-900 font-medium">{date}</span>
            <Tooltip>
              <TooltipTrigger className="cursor-help transition-colors text-gray-400 hover:text-gray-600 outline-none">
                <Info className="w-3.5 h-3.5" strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent className="bg-[#18181b] text-white border-0 py-1.5 px-3 rounded-lg shadow-xl text-xs font-medium">
                Uploaded: {originalDate}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      }

      return (
        <span className="text-[13px] text-gray-900 font-medium">{date}</span>
      );
    },
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <span className="text-[13px] text-gray-800">
        {row.getValue("service")}
      </span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-medium border border-gray-200 bg-white text-gray-700 shadow-sm uppercase tracking-wide">
        {row.getValue("region")}
      </span>
    ),
  },
  {
    accessorKey: "submittedBy",
    header: "Submitted by",
    cell: ({ row }) => (
      <span className="text-[13px] text-gray-800">
        {row.getValue("submittedBy")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="flex justify-center">SUD</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <button className="p-1.5 border border-gray-200 rounded-[5px] text-gray-600 hover:bg-gray-50 transition-colors shadow-sm bg-white">
          <Download className="w-4 h-4" strokeWidth={1.5} />
        </button>
        {row.original.canUploadSUD && (
          <button className="p-1.5 border border-gray-900 rounded-[5px] bg-[#18181b] text-white hover:bg-black transition-colors shadow-sm">
            <Upload className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
        <button className="p-1 text-gray-400 hover:text-gray-900 opacity-60 hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    ),
  },
];
