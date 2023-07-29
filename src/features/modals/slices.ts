import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ClosedModalState = {
  isOpen: false;
};

export type OpenModalState<T = undefined> = {
  isOpen: true;
  data: T;
};

export type ModalState<T = undefined> = ClosedModalState | OpenModalState<T>;

export function createModalSlice<T = undefined>({ name }: ModalSliceOpts) {
  const initialState: ModalState<T> = { isOpen: false };
  return createSlice({
    name,
    initialState,
    reducers: {
      closeModal: (state: APIState, action: PayloadAction) => {
        return initialState;
      },
      openModal: (state: APIState, { payload: data }: PayloadAction<T>) => {
        return {
          isOpen: true,
          data,
        };
      },
    },
  });
}
