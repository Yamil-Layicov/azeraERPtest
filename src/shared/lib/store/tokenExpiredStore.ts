import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";

const INITIAL_LOAD_COOLDOWN = 3000;

export interface TokenExpiredState {
  showModalHandler: (() => void) | null;
  isModalAlreadyShown: boolean;
  isModalClosed: boolean;
  pageInitializedAt: number | null;
  has401ErrorForAuthMe: boolean;
  isCsrfInvalid: boolean;
}

export interface TokenExpiredActions {
  setHandler: (handler: (() => void) | null) => void;
  markModalShown: () => void;
  markModalClosed: () => void;
  resetState: () => void;
  setHas401ForAuthMe: (value: boolean) => void;
  setCsrfInvalid: (value: boolean) => void;
  clear401Error: () => void;
  getCanShowModal: () => boolean;
  getHas401ErrorForAuthMe: () => boolean;
}

export type TokenExpiredStore = TokenExpiredState & TokenExpiredActions;

const initialState: TokenExpiredState = {
  showModalHandler: null,
  isModalAlreadyShown: false,
  isModalClosed: false,
  pageInitializedAt: null,
  has401ErrorForAuthMe: false,
  isCsrfInvalid: false,
};

export const tokenExpiredStore = createStore<TokenExpiredStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setHandler: (handler) => {
      set({
        showModalHandler: handler,
        pageInitializedAt: Date.now(),
        has401ErrorForAuthMe: false,
        isCsrfInvalid: false,
      });
    },

    markModalShown: () => {
      set({ isModalAlreadyShown: true });
    },

    markModalClosed: () => {
      set({ 
        isModalClosed: true,
        // has401ErrorForAuthMe: true (Zaten true olmalı, dokunmuyoruz)
      });
    },

    resetState: () => {
      set({
        isModalAlreadyShown: false,
        isModalClosed: false,
        has401ErrorForAuthMe: false,
        isCsrfInvalid: false,
      });
    },

    clear401Error: () => {
      set({ has401ErrorForAuthMe: false });
    },

    setHas401ForAuthMe: (value) => {
      set({ has401ErrorForAuthMe: value });
    },

    setCsrfInvalid: (value) => {
      set({ isCsrfInvalid: value });
    },

    getCanShowModal: () => {
      const state = get();
      if (!state.pageInitializedAt) return false;
      const timeSince = Date.now() - state.pageInitializedAt;
      if (timeSince < INITIAL_LOAD_COOLDOWN) return false;
      if (state.isModalClosed) return false;
      if (state.isModalAlreadyShown) return false;
      return true;
    },

    getHas401ErrorForAuthMe: () => get().has401ErrorForAuthMe,
  }))
);
