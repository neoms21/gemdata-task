import { useState, useMemo, useEffect } from "react";
import {
  PanelLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Upload,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { UniverseDefinitionItem } from "../../types/universe-definition";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { columns } from "./column-defs";
import { UploadUniverseDefinition } from "@/components/UploadUniverseDefinition";

const PAGE_SIZE = 7;

export function UniverseDefinition() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<UniverseDefinitionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/universeDefinitions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, data],
  );

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

  return (
    <div className="flex flex-col w-full">
      {/* Top bar with breadcrumbs */}
      <div className="flex items-center gap-3 px-8 py-3.5 border-b border-gray-200 bg-slate-50 sticky top-0 bg-opacity-95 backdrop-blur z-10">
        <PanelLeft className="w-4 h-4 text-gray-500 cursor-pointer" />
        <div className="w-px h-3.5 bg-gray-300 mx-1" />
        <span className="text-sm text-gray-500">Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">
          Universe Definition
        </span>
      </div>

      <div className="px-8 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
          <h1 className="text-[26px] font-bold text-[#09090b] tracking-tight">
            Universe Definition
          </h1>
          {data.length > 0 && (
            <button className="bg-[#18181b] hover:bg-black text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium transition-colors">
              <Upload className="w-[18px] h-[18px]" strokeWidth={2} />
              Upload new version(s)
            </button>
          )}
        </div>

        {error ? (
          <div className="p-8 text-center text-red-500 border border-gray-200 rounded-xl bg-white shadow-sm mt-4">
            Error: {error}
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-xl bg-white shadow-sm mt-4">
            Loading data...
          </div>
        ) : data.length === 0 ? (
          <UploadUniverseDefinition />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[320px] relative">
                <input
                  type="text"
                  placeholder="Filter name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 bg-white"
                />
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                {["Asset", "Region", "Service", "Type", "Status"].map(
                  (label) => (
                    <button
                      key={label}
                      className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
                    >
                      {label}
                      <ChevronDown
                        className="w-4 h-4 text-gray-400"
                        strokeWidth={2}
                      />
                    </button>
                  ),
                )}
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button className="bg-gray-50/80 hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors">
                  <Calendar className="w-4 h-4" strokeWidth={2} />
                  Date
                </button>
              </div>
            </div>

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
                          className="font-semibold text-[#09090b] text-[13px] h-11"
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
                          <TableCell key={cell.id} className="py-3">
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

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 text-[13px] text-gray-500 font-medium pb-2">
              <span>
                {pageIndex * PAGE_SIZE + 1}–
                {Math.min((pageIndex + 1) * PAGE_SIZE, filteredData.length)} of{" "}
                {filteredData.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="flex items-center gap-1 px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="flex items-center gap-1 px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
