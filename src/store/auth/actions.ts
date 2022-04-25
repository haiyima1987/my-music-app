import apiHandler from "../../utils/ApiHandler";
import axios from "axios";
import { Dispatch } from "redux";

export const LOGIN_SUCCESS = "auth/loginSuccess";
export const LOGIN_FAILED = "auth/loginFailed";

export function login() {
  return async function (dispatch: Dispatch) {
    const api = axios.create({
      baseURL: process.env.REACT_APP_AUTH_URL,
      headers: {
        'Authorization': `Basic ${(new Buffer(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`).toString('base64'))}`
      }
    });
    const formData = {grant_type: 'client_credentials'};
    return api.post('token', new URLSearchParams(formData)).then(response => {
      apiHandler.setAuthApiHandler();
      dispatch({type: LOGIN_SUCCESS, payload: response.data});
      return true;
    }).catch(error => {
      console.log(error.response);
      dispatch({type: LOGIN_FAILED, payload: error.response.data});
    })
  }
}
