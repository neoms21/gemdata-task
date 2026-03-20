import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMetadataFromFileName } from "@/helpers/getMetadata";
import { API_URL } from "@/helpers/constants";

interface UploadModalProps {
  children: React.ReactElement;
}

export const UploadModal = ({ children }: UploadModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = React.useCallback(() => {
    setError(null);
    setIsOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      const metadata = getMetadataFromFileName(file.name);
      if (!metadata.isFileNameValid) {
        setError(
          "Unable to generate metadata as filename is not valid. filename should be in the format: assetclass_producttype_type_region.csv",
        );
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleContainerUploadClick = React.useCallback(() => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const metadata = getMetadataFromFileName(selectedFile.name);
      const newEntry = {
        id: Date.now().toString(),
        date: metadata.date,
        service: metadata.service,
        region: metadata.region,
        submittedBy: metadata.uploadedBy || "System",
        canUploadSUD: true,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) {
        throw new Error(
          "Failed to save data. Ensure json-server is running on port 3000.",
        );
      }

      setIsOpen(false);
      setSelectedFile(null);
      // Invalidate query to reflect newly added data
      await queryClient.invalidateQueries({
        queryKey: ["universeDefinitions"],
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div onClick={handleUploadClick} className="inline-block cursor-pointer">
        {children}
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
      />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setError(null);
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Universe Definition</DialogTitle>
            <DialogDescription>
              Select a CSV file to define your universe.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {selectedFile ? (
              <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-900 line-clamp-1">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-green-700">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-1">
                  Waiting for file selection...
                </p>
                <button
                  onClick={handleContainerUploadClick}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Browse again
                </button>
              </div>
            )}
            {error && (
              <span className="text-xs text-red-600 text-center font-medium">
                {error}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedFile || isUploading}
              onClick={handleConfirmUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-[#09090b] hover:bg-[#27272a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
