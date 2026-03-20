import { PanelLeft, ChevronRight, Upload } from "lucide-react";
import { UploadUniverseDefinition } from "@/components/UploadUniverseDefinition";
import { UploadModal } from "@/components/UploadModal";
import { useUniverseDefinitions } from "../../queries/useUniverseDefinitions";
import { UniverseDefinitionTable } from "../../components/UniverseDefinitionTable";

export function UniverseDefinition() {
  // const [searchTerm, setSearchTerm] = useState("");

  const { data = [], isLoading: loading, error } = useUniverseDefinitions();

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
            <UploadModal>
              <button className="bg-[#18181b] hover:bg-black text-white px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium transition-colors">
                <Upload className="w-[18px] h-[18px]" strokeWidth={2} />
                Upload new version(s)
              </button>
            </UploadModal>
          )}
        </div>

        {error ? (
          <div className="p-8 text-center text-red-500 border border-gray-200 rounded-xl bg-white shadow-sm mt-4">
            Error: {error.message}
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-xl bg-white shadow-sm mt-4">
            Loading data...
          </div>
        ) : data.length === 0 ? (
          <UploadUniverseDefinition />
        ) : (
          <UniverseDefinitionTable data={data} />
        )}
      </div>
    </div>
  );
}
