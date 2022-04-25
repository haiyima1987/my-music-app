import axios from 'axios'
import dataHandler from './DataHandler'
import {SET_LOADING} from "../store/shared/actions";

const RESPONSE_TYPES = {
  STATUS_OK: 200,
  STATUS_CREATED: 201,
  STATUS_NO_CONTENT: 204,
  STATUS_UNAUTHORIZED: 401
}

const TOKEN_SAVING_DELAY = 500;

/** This is a class I personally use for all projects, it's mostly generic using Axios **/
class ApiHandler {
  constructor() {
    /** Create the api instance for auth APIs **/
    this.apiAuth = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
    /** Create the api instance for public APIs **/
    this.apiPublic = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
    this.source = undefined;
    this.store = undefined;
    this.apiCount = 0;
    this.router = undefined;
    dataHandler.getAccessToken() ? this.setAuthApiHandler() : this.setNonAuthApiHandler();
  }

  setAuthApiHandler() {
    this.api = this.apiAuth;
  }

  setNonAuthApiHandler() {
    this.api = this.apiPublic;
  }

  setInterceptors(store) {
    this.store = store;
    const self = this;
    // Add a request interceptor
    this.apiAuth.interceptors.request.use(
      async function (config) {
        self.increaseApiCount();
        /** here update the access token with refresh token with native fetch() **/
        if (!dataHandler.getAccessToken()) {
          await self.refreshToken();
          // after new tokens retrieved, don't forget to set it in the headers for following API calls
          config.headers = self.getAuthHeader();
          return config;
        } else {
          // Do something before request is sent
          return config;
        }
      },
      function (error) {
        self.decreaseApiCount();
        // Do something with request error
        return Promise.reject(error)
      }
    );
    // Add a response interceptor
    this.apiAuth.interceptors.response.use(
      function (response) {
        self.decreaseApiCount();
        // Do something with response data
        return response
      },
      function (error) {
        self.decreaseApiCount();
        // Do something with response error
        return Promise.reject(error)
      }
    );
    // Add a request interceptor for public APIs
    this.apiPublic.interceptors.request.use(
      function (config) {
        self.increaseApiCount();
        // Do something before request is sent
        return config
      },
      function (error) {
        self.decreaseApiCount();
        // Do something with request error
        return Promise.reject(error)
      }
    );
    // Add a response interceptor for public APIs
    this.apiPublic.interceptors.response.use(
      function (response) {
        self.decreaseApiCount();
        // Do something with response data
        return response
      },
      function (error) {
        self.decreaseApiCount();
        // Do something with response error
        return Promise.reject(error)
      }
    );
  }

  increaseApiCount() {
    this.apiCount++;
    if (this.apiCount > 0) {
      this.store.dispatch({type: SET_LOADING, payload: true});
    }
  }

  decreaseApiCount() {
    this.apiCount--;
    if (this.apiCount < 1) {
      this.store.dispatch({type: SET_LOADING, payload: false});
    }
  }

  async refreshToken() {
    try {
      const formData = {grant_type: 'client_credentials'};
      // use native fetch to get new tokens
      const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${(new Buffer(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`).toString('base64'))}`
        },
        body: new URLSearchParams(formData),
      });
      const payload = await response.json();
      dataHandler.setKeepMeLoggedIn({keepMeLoggedIn: true});
      dataHandler.setAccessToken(payload.access_token, payload.expires_in);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          /** tiny delay for database token saving **/
        }, TOKEN_SAVING_DELAY);
      })
    } catch (error) {
      console.error(error);
      window.location.replace("/logout");
    }
  }

  send(method, url, headers = {}, data = {}, params = {}, arrayBufferResponse = false) {
    return this.sendApi(this.api, method, url, headers, data, params, arrayBufferResponse);
  }

  /** you can also just use these 2 to force a public or auth api instance. don't forget to add new function like getPublic() **/
  sendPublic(method, url, headers = {}, data = {}, params = {}, arrayBufferResponse = false) {
    return this.sendApi(this.apiPublic, method, url, headers, data, params, arrayBufferResponse);
  }

  sendAuth(method, url, headers = {}, data = {}, params = {}, arrayBufferResponse = false) {
    return this.sendApi(this.apiAuth, method, url, headers, data, params, arrayBufferResponse);
  }

  sendApi(instance, method, url, headers = {}, data = {}, params = {}, arrayBufferResponse = false) {
    this.source = axios.CancelToken.source();
    // Define the headers if they are undefined
    headers = headers ? headers : {}
    return instance.request({
      method: method,
      url: url,
      headers: headers !== undefined ? headers : {},
      data: data !== undefined ? data : {},
      params: params !== undefined ? params : {},
      responseType: arrayBufferResponse === true ? 'arraybuffer' : undefined,
      cancelToken: this.source.token
    })
  }

  get(url, headers = {}, params = {}, responseType = false) {
    return this.send('GET', url, headers, undefined, params, responseType)
  }

  post(url, data = {}, headers = {}, params = {}, fileResponse = {}) {
    return this.send('POST', url, headers, data, params, fileResponse)
  }

  patch(url, data = {}, headers = {}, params = {}) {
    return this.send('PATCH', url, headers, data, params)
  }

  put(url, data = {}, headers = {}, params = {}) {
    return this.send('PUT', url, headers, data, params)
  }

  delete(url, data = {}, header = {}) {
    return this.send('DELETE', url, header, data)
  }

  cancel() {
    this.source.cancel('Request Cancelled')
  }

  getAuthHeader() {
    // Check if access token is present
    if (!dataHandler.getAccessToken()) return undefined
    return {
      Authorization: `Bearer ${dataHandler.getAccessToken()}`,
      'accept-language': 'en'
    }
  }

  isSuccess(statusCode) {
    return (
      statusCode === RESPONSE_TYPES.STATUS_OK ||
      statusCode === RESPONSE_TYPES.STATUS_CREATED ||
      statusCode === RESPONSE_TYPES.STATUS_NO_CONTENT
    )
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApiHandler()
    }
    return this.instance
  }
}

export default ApiHandler.getInstance()
