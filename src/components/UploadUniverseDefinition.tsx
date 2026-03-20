import { Globe, ArrowUpRight, Upload } from "lucide-react";
import { UploadModal } from "@/components/UploadModal";

export const UploadUniverseDefinition = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl bg-white shadow-sm mt-4 py-24 px-4 text-center min-h-[460px]">
      <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center mb-5 shadow-sm">
        <Globe className="w-6 h-6 text-[#09090b]" />
      </div>
      <h3 className="text-[17px] font-semibold text-[#09090b] mb-2">
        No universe definitions yet
      </h3>
      <p className="text-[14px] text-[#71717a] mb-8 font-medium">
        Upload a SUD file to create a new universe definition
      </p>
      <UploadModal>
        <button className="bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] px-5 py-[10px] rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium transition-colors mb-10">
          <Upload className="w-4 h-4" strokeWidth={2.5} />
          Upload SUD
        </button>
      </UploadModal>
      <a
        href="#"
        className="flex items-center gap-1.5 text-[13px] font-medium text-[#71717a] hover:text-[#09090b] transition-colors"
      >
        Learn more about Universe Definition
        <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
      </a>
    </div>
  );
};
