// import {applyMiddleware, compose, createStore} from "redux";
// import rootReducer from "./reducers/index";
// import {forbiddenWordsMiddleware} from "./middlewares";
// import thunk from "redux-thunk";
//
// const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// console.log(storeEnhancers);
//
// const store = createStore(
//   rootReducer,
//   storeEnhancers(applyMiddleware(forbiddenWordsMiddleware, thunk))
// );
//
// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { forbiddenWordsMiddleware } from "./middlewares";
import sharedSlice, { SharedState } from "./shared";
import authSlice, { AuthState } from "./auth";
import trackSlice, { TrackState } from "./track";

export interface StoreRootState {
  article: TrackState;
  auth: AuthState;
  shared: SharedState
}

const middlewares = [
  forbiddenWordsMiddleware
];

const store = configureStore({
  reducer: {
    shared: sharedSlice.reducer,
    auth: authSlice.reducer,
    article: trackSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
})

store.getState()

export default store;
