import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import store from "./store";
import { Provider } from "react-redux";
import apiHandler from "./utils/ApiHandler";

apiHandler.setInterceptors(store);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
