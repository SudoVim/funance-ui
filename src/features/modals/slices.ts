import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

export type ClosedModalState = {
  isOpen: false;
};

export const closedModalState: ClosedModalState = {
  isOpen: false,
};

export type OpenModalState<T = undefined> = {
  isOpen: true;
  data: T;
};

export type ModalState<T = undefined> = ClosedModalState | OpenModalState<T>;

export type ModalSliceOpts = {
  name: string;
};

export function createModalSlice<T = undefined>({ name }: ModalSliceOpts) {
  return createSlice<ModalState<T>, SliceCaseReducers<ModalState<T>>>({
    name,
    initialState: closedModalState,
    reducers: {
      closeModal: (state: any, action: PayloadAction): ModalState<T> => {
        return closedModalState;
      },
      openModal: (
        state: any,
        { payload: data }: PayloadAction<T>,
      ): ModalState<T> => {
        return {
          isOpen: true,
          data,
        };
      },
    },
  });
}
