import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import apiReducer from "features/api";
import accountReducer from "features/account";
import counterReducer from "features/counter/counterSlice";
import createSagaMiddleware from "redux-saga";
import { sagas } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    api: apiReducer,
    account: accountReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(sagas);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
