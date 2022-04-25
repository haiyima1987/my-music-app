import { createSlice } from "@reduxjs/toolkit";
import dataHandler from "../../utils/DataHandler";
import apiHandler from "../../utils/ApiHandler";

export interface AuthState {
  isAuthenticated: boolean;
  error: string;
}

export const authState = {
  isAuthenticated: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: authState,
  reducers: {
    loginSuccess: (state, action) => {
      const payload = action.payload;
      dataHandler.setKeepMeLoggedIn({keepMeLoggedIn: true});
      dataHandler.setAccessToken(payload.access_token, payload.expires_in);
      state.isAuthenticated = true;
      state.error = "";
    },
    loginFailed: (state, action) => {
      state.error = action.payload;
    },
    logout: (state, action) => {
      dataHandler.destroy();
      dataHandler.clearLocalData();
      apiHandler.setNonAuthApiHandler();
      state.isAuthenticated = false;
      state.error = '';
    }
  }
});

export default authSlice;
