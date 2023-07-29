function getAccountsListEndpoint(state: any) {
  return state.holdings.accounts.list;
}

function getAccountsCreateEndpoint(state: any) {
  return state.holdings.accounts.create;
}

export const selectors = {
  accounts: {
    list: {
      endpoint: getAccountsListEndpoint,
    },
    create: getAccountsCreateEndpoint,
  },
};
