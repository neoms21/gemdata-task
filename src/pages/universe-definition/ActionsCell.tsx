import { type UniverseDefinitionItem } from "../../types/universe-definition";
import { Download, MoreVertical, Upload, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { UploadModal } from "@/components/UploadModal";
import { useDeleteUniverseDefinition } from "../../queries/useUniverseDefinitions";

export const ActionsCell = ({
  row,
}: {
  row: { original: UniverseDefinitionItem };
}) => {
  const deleteMutation = useDeleteUniverseDefinition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this universe definition?")) {
      deleteMutation.mutate(row.original.id);
    }
  };

  const handleDownload = () => {
    if (!row.original.data) return;

    const blob = new Blob([row.original.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.original.service}_${row.original.region}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasData = !!row.original.data;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!hasData}
        title={hasData ? "Download CSV" : "No data available"}
        className={`py-1 px-1.5 border border-gray-200 rounded-[5px] transition-colors shadow-sm bg-white ${
          hasData
            ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            : "text-gray-300 cursor-not-allowed opacity-50"
        }`}
      >
        <Download className="w-4 h-4" strokeWidth={1.5} />
      </button>
      <UploadModal universeDefinition={row.original}>
        <button
          type="button"
          className="py-1 px-1.5 border border-gray-900 rounded-[5px] bg-[#18181b] text-white hover:bg-black transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </UploadModal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
