interface UniverseDefinitionFooterProps {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function UniverseDefinitionFooter({
  pageIndex,
  pageSize,
  totalRows,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
}: UniverseDefinitionFooterProps) {
  return (
    <div className="flex items-center justify-between mt-5 text-[13px] text-gray-500 font-medium pb-2">
      <span>
        {pageIndex * pageSize + 1}–
        {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          className="flex items-center gap-1 px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={!canNextPage}
          className="flex items-center gap-1 px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
