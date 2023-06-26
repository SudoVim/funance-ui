function getAccountsListEndpoint(state: any) {
  return state.holdings.accounts.list;
}

export const selectors = {
  accounts: {
    list: {
      endpoint: getAccountsListEndpoint,
    },
  },
};
