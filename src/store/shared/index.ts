import { createSlice } from "@reduxjs/toolkit";

export interface SharedState {
  isLoading: boolean;
}

export const sharedState = {
  isLoading: false
};

const sharedSlice = createSlice({
  name: "shared",
  initialState: sharedState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export default sharedSlice;
