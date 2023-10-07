import { describe, it, expect } from "vitest";
import { purchaseTypeFromNumber } from "./common";

describe("purchaseTypeFromNumber tests", () => {
  it('is a "BUY" from positive', () => {
    const num = 5;
    expect(purchaseTypeFromNumber(num)).toEqual("BUY");
  });
  it('is a "BUY" from zero', () => {
    const num = 0;
    expect(purchaseTypeFromNumber(num)).toEqual("BUY");
  });
  it('is a "SELL" from negative', () => {
    const num = -5;
    expect(purchaseTypeFromNumber(num)).toEqual("SELL");
  });
});
