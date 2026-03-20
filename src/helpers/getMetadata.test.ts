import { describe, expect, it } from "vitest";
import { getMetadataFromFileName } from "./getMetadata";

describe("getMetadataFromFileName", () => {
  it("extracts service, region, and date correctly", () => {
    const result = getMetadataFromFileName("equity_vanilla_option_ldn.csv");
    expect(result).toEqual({
      service: "equity_vanilla_option",
      region: "LDN",
      date: "Latest",
      isFileNameValid: true,
      uploadedBy: "Manoj S.",
    });
  });

  it("handles filenames with missing parts", () => {
    const result = getMetadataFromFileName("compute_us-east-1");
    expect(result).toEqual({
      isFileNameValid: false,
      service: "",
      region: "",
      date: "",
      uploadedBy: "",
    });
  });

  it("handles empty strings", () => {
    const result = getMetadataFromFileName("");
    expect(result).toEqual({
      isFileNameValid: false,
      service: "",
      region: "",
      date: "",
      uploadedBy: "",
    });
  });
});
