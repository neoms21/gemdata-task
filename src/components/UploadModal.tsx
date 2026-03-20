import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteUniverseDefinition,
  useUploadUniverseDefinition,
} from "@/queries/useUniverseDefinitions";
import { type UniverseDefinitionItem } from "@/types/universe-definition";
import { getMetadataFromFileName } from "@/helpers/getMetadata";

interface UploadModalProps {
  children: React.ReactElement;
  universeDefinition?: UniverseDefinitionItem;
}

export const UploadModal = ({
  children,
  universeDefinition,
}: UploadModalProps) => {
  const deleteMutation = useDeleteUniverseDefinition();
  const uploadMutation = useUploadUniverseDefinition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUploadClick = React.useCallback(() => {
    setValidationError(null);
    setIsOpen(true);
    if (fileInputRef.current && !universeDefinition) {
      fileInputRef.current.click();
    }
  }, [universeDefinition]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = event.target.files?.[0];
    if (file) {
      const metadata = getMetadataFromFileName(file.name);
      if (!metadata.isFileNameValid) {
        setValidationError(
          "Unable to generate metadata as filename is not valid. filename should be in the format: assetclass_producttype_type_region.csv",
        );
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleContainerUploadClick = React.useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    //if replacing an existing universe definition, delete it first
    if (universeDefinition) {
      await deleteMutation.mutateAsync(universeDefinition.id);
    }

    const metadata = getMetadataFromFileName(selectedFile.name);
    const newEntry = {
      date: metadata.date,
      service: metadata.service,
      region: metadata.region,
      submittedBy: metadata.uploadedBy || "System",
      canUploadSUD: true,
    };

    try {
      await uploadMutation.mutateAsync(newEntry);
      setIsOpen(false);
      setSelectedFile(null);
    } catch {
      // Error is captured by the mutation state for UI display
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
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Upload Universe Definition
              <br />
              {universeDefinition && (
                <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded text-xs font-normal text-gray-500">
                  {universeDefinition.service} ({universeDefinition.region})
                </span>
              )}
            </DialogTitle>
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
            {(validationError || uploadMutation.error) && (
              <span className="text-xs text-red-600 text-center font-medium">
                {validationError || uploadMutation.error?.message}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedFile || uploadMutation.isPending}
              onClick={handleConfirmUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-[#09090b] hover:bg-[#27272a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? "Uploading..." : "Confirm Upload"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
