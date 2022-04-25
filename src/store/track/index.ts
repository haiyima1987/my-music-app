import { createSlice } from "@reduxjs/toolkit";

export interface TrackState {
}

const trackState = {
};

const trackSlice = createSlice({
  name: 'article',
  initialState: trackState,
  reducers: {
    foundBadWord: (state, action) => {
      console.log('bad word');
    }
  }
});

export default trackSlice;
