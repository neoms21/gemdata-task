import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getMetadataFromFileName } from "./getMetadata";

describe("getMetadataFromFileName", () => {
  const mockDate = new Date("2026-03-20T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("extracts service, region, and date correctly", () => {
    const result = getMetadataFromFileName("equity_vanilla_option_ldn.csv");
    expect(result).toEqual({
      service: "equity_vanilla_option",
      region: "LDN",
      date: mockDate.toISOString(),
      isFileNameValid: true,
      uploadedBy: expect.any(String),
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
