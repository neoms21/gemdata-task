type FileMetadata = {
  service: string;
  region: string;
  date: string;
  isFileNameValid: boolean;
  uploadedBy: string;
};

export const getMetadataFromFileName = (fileName: string): FileMetadata => {
  const parts = fileName.split(".")?.[0].split("_");

  if (parts.length < 4)
    return {
      service: "",
      region: "",
      date: "",
      isFileNameValid: false,
      uploadedBy: "",
    };

  const [assetClass, productType, type, region] = parts;
  return {
    service: `${assetClass}_${productType}_${type}`,
    region: region.toUpperCase(),
    date: "Latest",
    isFileNameValid: true,
    uploadedBy: "Manoj S.",
  };
};
