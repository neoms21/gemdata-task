import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { columns } from "../pages/universe-definition/column-defs";
import type { UniverseDefinitionItem } from "../types/universe-definition";
import { UniverseDefinitionToolbar } from "./UniverseDefinitionToolbar";
import { UniverseDefinitionFooter } from "./UniverseDefinitionFooter";
import { TooltipProvider } from "./ui/tooltip";
import { useDeleteUniverseDefinition } from "../queries/useUniverseDefinitions";

const PAGE_SIZE = 4;

interface UniverseDefinitionTableProps {
  data: UniverseDefinitionItem[];
}

export function UniverseDefinitionTable({
  data,
}: UniverseDefinitionTableProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");

  const deleteMutation = useDeleteUniverseDefinition();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion =
        regionFilter === "All" || item.region === regionFilter;
      const matchesService =
        serviceFilter === "All" || item.service === serviceFilter;

      return matchesSearch && matchesRegion && matchesService;
    });
  }, [searchTerm, regionFilter, serviceFilter, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const { pageIndex } = table.getState().pagination;
  const selectedRowsCount = Object.keys(rowSelection).length;

  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (
      selectedRows.length > 0 &&
      confirm(`Are you sure you want to delete ${selectedRows.length} items?`)
    ) {
      try {
        await Promise.all(
          selectedRows.map((row) =>
            deleteMutation.mutateAsync(row.original.id),
          ),
        );
        setRowSelection({});
      } catch (error) {
        console.error("Bulk delete failed:", error);
        alert("Failed to delete some items. Please try again.");
      }
    }
  };

  return (
    <TooltipProvider delay={200}>
      <UniverseDefinitionToolbar
        data={data}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        selectedCount={selectedRowsCount}
        onDelete={handleBulkDelete}
      />

      {/* Table */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200 hover:bg-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-[#09090b] text-[13px] h-11 px-4 text-left"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors border-0 border-b border-gray-100 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400 text-sm"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UniverseDefinitionFooter
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        totalRows={filteredData.length}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </TooltipProvider>
  );
}
