import { describe, it, expect } from "vitest";
import { getCurrentAccount, getCurrentCreatePurchase } from "./accounts";
import { emptyEndpoint } from "features/api/endpoint";

describe("getCurrentAccount tests", () => {
  it("returns the account as expected", () => {
    const account = { name: "account-name" };
    const endpoint = {
      isFilled: true,
      success: true,
      data: account,
    };
    const currentAccount = {
      id: "account-id",
    };
    const state = {
      holdings: {
        accounts: {
          current: {
            currentAccount,
          },
          get: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpAccount = getCurrentAccount(state);
    expect(cmpAccount).toEqual(account);
  });
  it("returns nothing if endpoint failed", () => {
    const endpoint = {
      isFilled: true,
      success: false,
    };
    const currentAccount = {
      id: "account-id",
    };
    const state = {
      holdings: {
        accounts: {
          current: {
            currentAccount,
          },
          get: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpAccount = getCurrentAccount(state);
    expect(cmpAccount).toEqual(undefined);
  });
  it("returns nothing if endpoint is empty", () => {
    const currentAccount = {
      id: "account-id",
    };
    const state = {
      holdings: {
        accounts: {
          current: {
            currentAccount,
          },
          get: {},
        },
      },
    };

    const cmpAccount = getCurrentAccount(state);
    expect(cmpAccount).toEqual(undefined);
  });
  it("returns nothing if no current account is set", () => {
    const account = { name: "account-name" };
    const endpoint = {
      isFilled: true,
      success: true,
      data: account,
    };
    const state = {
      holdings: {
        accounts: {
          current: {},
          get: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpAccount = getCurrentAccount(state);
    expect(cmpAccount).toEqual(undefined);
  });
});

describe("getCurrentCreatePurchase tests", () => {
  it("returns the current createPurchase endpoint", () => {
    const endpoint = { end: "point" };
    const state = {
      holdings: {
        accounts: {
          current: {
            currentAccount: { id: "account-id" },
          },
          createPurchase: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpEndpoint = getCurrentCreatePurchase(state);
    expect(cmpEndpoint).toEqual(endpoint);
  });
  it("returns empty if there is no match", () => {
    const endpoint = { end: "point" };
    const state = {
      holdings: {
        accounts: {
          current: {
            currentAccount: { id: "some-other-account-id" },
          },
          createPurchase: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpEndpoint = getCurrentCreatePurchase(state);
    expect(cmpEndpoint).toEqual(emptyEndpoint);
  });
  it("returns undefined if there is no current account", () => {
    const endpoint = { end: "point" };
    const state = {
      holdings: {
        accounts: {
          current: {},
          createPurchase: {
            "account-id": endpoint,
          },
        },
      },
    };

    const cmpEndpoint = getCurrentCreatePurchase(state);
    expect(cmpEndpoint).toEqual(undefined);
  });
});
