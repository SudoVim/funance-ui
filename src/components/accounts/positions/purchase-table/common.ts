export type PurchaseType = "SELL" | "BUY";

export function purchaseTypeFromNumber(num: number): PurchaseType {
  if (num >= 0) {
    return "BUY";
  }

  return "SELL";
}
