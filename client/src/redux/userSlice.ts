import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {  ISpending } from "../pages/Home";


export type IinitialState ={
  currentUser: ICurrentUser | null,
  token: string | null,
  mode: TMode,
  error: string | null,
  loading: boolean,
}

interface ICurrentSpendings {
  income: number,
  month: Date,
  spendings?: Array<ISpending>
  _id?: string
}

export interface ICurrentUser {
  _id: string,
  username: string,
  spendings: Array<ICurrentSpendings> | null
}

export type TMode = 'light' | 'dark';


const initialState: IinitialState = {
  currentUser: null,
  token: null,
  mode: 'light',
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    signInStart: (state) => {
      state.loading = true;
    },
    signinSuccess: (state, action: PayloadAction<IinitialState>) => {
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSpendings: (state, action: PayloadAction<[] |Array<ICurrentSpendings>>) => {
      if(state.currentUser){
        state.currentUser.spendings = action.payload;
      }
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.token = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.token = null,
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setMode,
  signInStart, 
  signInFailure, 
  signinSuccess,
  setSpendings,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess } = userSlice.actions;


export default userSlice.reducer;