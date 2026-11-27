import {
  createFund,
  getFundsPage,
  getFund,
  updateFund,
  getFundAllocationsPage,
  getFundAllocation,
  updateFundAllocation,
  deleteFundAllocation,
} from "./sagas";
import { describe, it } from "vitest";
import { testSaga } from "redux-saga-test-plan";
import { authRequest } from "features/api";
import { endpoints } from "./endpoints";

describe("test createFund", () => {
  it("creates a fund without optional fields", () => {
    const request = {
      name: "Fund Name",
    };
    const response = {};
    const saga = createFund;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/",
        method: "POST",
        body: { name: "Fund Name" },
      })
      .next(response)
      .call(endpoints.create.handleResponse, { request, response })
      .next()
      .isDone();
  });
  it("creates a fund with optional fields", () => {
    const request = {
      name: "Fund Name",
      shares: 230,
    };
    const response = {};
    const saga = createFund;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/",
        method: "POST",
        body: {
          name: "Fund Name",
          shares: 230,
        },
      })
      .next(response)
      .call(endpoints.create.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test getFundsPage", () => {
  it("fetches a page of funds", () => {
    const request = {};
    const response = {};
    const saga = getFundsPage;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/?page=1",
        method: "GET",
      })
      .next(response)
      .call(endpoints.list.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test getFund", () => {
  it("retrieves a single fund", () => {
    const request = {
      id: "fund%id",
    };
    const response = {};
    const saga = getFund;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/fund%25id/",
        method: "GET",
      })
      .next(response)
      .call(endpoints.get.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test updateFund", () => {
  it("updates a fund with no parameters", () => {
    const request = {
      id: "fund%id",
    };
    const response = {};
    const saga = updateFund;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/fund%25id/",
        method: "PATCH",
        body: {},
      })
      .next(response)
      .call(endpoints.update.handleResponse, { request, response })
      .next()
      .isDone();
  });
  it("updates a fund with optional parameters", () => {
    const request = {
      id: "fund%id",
      name: "New Fund Name",
      shares: 303,
    };
    const response = {};
    const saga = updateFund;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/fund%25id/",
        method: "PATCH",
        body: {
          name: "New Fund Name",
          shares: 303,
        },
      })
      .next(response)
      .call(endpoints.update.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test getFundAllocationsPage", () => {
  it("fetches a page of fund allocations", () => {
    const request = {
      id: "fund%id",
    };
    const response = {};
    const saga = getFundAllocationsPage;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/funds/fund%25id/?page=1",
        method: "GET",
      })
      .next(response)
      .call(endpoints.list.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test getFundAllocation", () => {
  it("fetches a fund allocation", () => {
    const request = {
      id: "allocation%id",
    };
    const response = {};
    const saga = getFundAllocation;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/fund_allocations/allocation%25id/",
        method: "GET",
      })
      .next(response)
      .call(endpoints.allocations.get.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test updateFundAllocation", () => {
  it("updates a fund allocation with minimal fields", () => {
    const request = {
      id: "allocation%id",
    };
    const response = {};
    const saga = updateFundAllocation;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/fund_allocations/allocation%25id/",
        method: "PATCH",
        body: {},
      })
      .next(response)
      .call(endpoints.allocations.update.handleResponse, { request, response })
      .next()
      .isDone();
  });
  it("updates a fund allocation with all fields", () => {
    const request = {
      id: "allocation%id",
      shares: 123,
    };
    const response = {};
    const saga = updateFundAllocation;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/fund_allocations/allocation%25id/",
        method: "PATCH",
        body: {
          shares: 123,
        },
      })
      .next(response)
      .call(endpoints.allocations.update.handleResponse, { request, response })
      .next()
      .isDone();
  });
});

describe("test deleteFundAllocation", () => {
  it("updates a fund allocation with minimal fields", () => {
    const request = {
      id: "allocation%id",
    };
    const response = {};
    const saga = deleteFundAllocation;
    testSaga(saga, { payload: request })
      .next()
      .call(authRequest, {
        path: "/fund_allocations/allocation%25id/",
        method: "DELETE",
      })
      .next(response)
      .call(endpoints.allocations.delete.handleResponse, { request, response })
      .next()
      .isDone();
  });
});
