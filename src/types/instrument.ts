export type AssetClass = "Rates" | "FX" | "Credit" | "Equities";
export type VerificationStatus = "Verified" | "Pending" | "Outlier";

export interface Valuation {
  mid: number;
  bid: number | null;
  ask: number | null;
  currency: string;
}

export interface Instrument {
  id: string;
  ticker: string;
  assetClass: AssetClass;
  valuation: Valuation;
  lastUpdated: string; // ISO String
  status: VerificationStatus;
  confidenceScore: number; // 0 to 1
}
