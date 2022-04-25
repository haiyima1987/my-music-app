/** This is a generic class to handle cookie, local storage, session storage, etc. **/
class DataHandler {
  constructor() {
    this.KEYS = Object.freeze({
      LOCAL_KEYS: 'local_keys',
      ACTIVE_USER: 'active_user',
      ACCESS_TOKEN: 'access_token',
      REFRESH_TOKEN: 'refresh_token',
      KEEP_ME_LOGGED_IN: 'keep_me_logged_in',
      USER_TYPE: 'user_type',
      IS_AUTHENTICATED: 'is_authenticated'
    });

    this.VALUES = {
      KEEP_ME_LOGGED_IN: '1',
      // todo: update the expire time depending on the back end setup
      REFRESH_TOKEN_EXPIRE_TIME: 3600 * 24 * 14
    };
  }

  /**
   * Function to retrieve a cookie
   * @param sKey key of the cookie
   */
  get(sKey) {
    if (!sKey) {
      return null
    }
    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
  }

  /**
   * Function to set a cookie
   * @param sKey key of the cookie
   * @param sValue value of the cookie
   * @param vEnd duration of the cookie(ms)
   * @param sPath path of the cookie
   * @param sDomain domain of the cookie
   */
  set(sKey, sValue, vEnd = 3600, sPath = null, sDomain = null) {
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
      return false
    }
    let sExpires = ''
    if (vEnd) {
      let end = this.end(vEnd)
      sExpires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; expires=' + end
    }
    document.cookie =
      encodeURIComponent(sKey) + '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (window.location.href.match('https') ? '; secure' : '')
    return true
  }

  /**
   * Function to remove a cookie
   * @param sKey key of the cookie
   * @param sPath path of the cookie
   * @param sDomain domain of the cookie
   */
  remove(sKey, sPath = '', sDomain = null) {
    if (!this.has(sKey)) {
      return false
    }
    document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '')
    return true
  }

  /**
   * Function to destroy all cookies
   */
  destroy() {
    // clear all cookies except for persistent keys
    for (let key of this.keys()) {
      this.remove(key, '/', `${process.env.REACT_APP_HOST}`);
    }
  }

  clearLocalData() {
    const keys = localStorage.getItem(this.KEYS.LOCAL_KEYS)
    if (keys == null) {
      return
    }
    const keyArray = JSON.parse(keys)
    for (const keyName of keyArray) {
      localStorage.removeItem(keyName)
      sessionStorage.removeItem(keyName)
    }
    localStorage.removeItem(this.KEYS.LOCAL_KEYS)
    this.clearKeepMeLoggedIn();
  }

  /**
   * Function to check if cookie exists
   * @param sKey key of the cookie
   */
  has(sKey) {
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
      return false
    }
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
  }

  /**
   * Function to retrieve all stored cookie keys
   */
  keys() {
    let aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/)
    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
    }
    return aKeys
  }

  end(maxAge) {
    return maxAge === Infinity ? 'Fri, 31 Dec 9999 23:59:59 GMT' : (new Date(maxAge * 1e3 + Date.now())).toUTCString()
  }

  /** functions to handle keep me logged in **/
  setKeepMeLoggedIn({keepMeLoggedIn}) {
    /** save the keep me logged in to local storage since it persistent for future use **/
    if (keepMeLoggedIn) {
      return this.saveLocalData(this.KEYS.KEEP_ME_LOGGED_IN, this.VALUES.KEEP_ME_LOGGED_IN);
    }
    /**
     * if not, set a key in sessionStorage, if the key is gone (all tabs closed), the user can't get refresh token to
     * refresh access token (considered not "keepMeLoggedIn"), check getRefreshToken() call.
     **/
    sessionStorage.setItem(this.KEYS.IS_AUTHENTICATED, '1');
  }

  getKeepMeLoggedIn() {
    // get the keep me logged in value
    return localStorage.getItem(this.KEYS.KEEP_ME_LOGGED_IN);
  }

  clearKeepMeLoggedIn() {
    // remove keep me logged in
    localStorage.removeItem(this.KEYS.KEEP_ME_LOGGED_IN)
  }

  /**
   * functions to deal with access token and refresh token depending on "remember me/keep me logged in"
   **/
  getAccessToken() {
    const token = this.get(this.KEYS.ACCESS_TOKEN);
    /** case when the user didn't check "keepMeLoggedIn" but come back within 1 hour **/
    if (token && !this.getKeepMeLoggedIn()) {
      sessionStorage.setItem(this.KEYS.IS_AUTHENTICATED, '1');
    }
    return token;
  }

  setAccessToken(token, expireIn) {
    this.set(this.KEYS.ACCESS_TOKEN, token, expireIn, '/', `${process.env.REACT_APP_HOST}`)
  }

  /** functions to deal with refresh token **/
  getRefreshToken() {
    if (this.getKeepMeLoggedIn()) {
      return this.get(this.KEYS.REFRESH_TOKEN)
    }
    if (sessionStorage.getItem(this.KEYS.IS_AUTHENTICATED)) {
      return this.get(this.KEYS.REFRESH_TOKEN);
    }
    return null;
  }

  setRefreshToken(token, expireIn) {
    this.set(this.KEYS.REFRESH_TOKEN, token, expireIn, '/', `${process.env.REACT_APP_HOST}`)
  }

  /** general functions to save data into local storage **/
  saveLocalKey(keyName) {
    let keys = localStorage.getItem(this.KEYS.LOCAL_KEYS)
    if (keys == null) {
      localStorage.setItem(this.KEYS.LOCAL_KEYS, JSON.stringify([keyName]))
      return
    }
    let keyArray = JSON.parse(keys)
    if (keyArray.indexOf(keyName) === -1) {
      keyArray.push(keyName)
      localStorage.setItem(this.KEYS.LOCAL_KEYS, JSON.stringify(keyArray))
    }
  }

  saveLocalData(keyName, data) {
    this.saveLocalKey(keyName)
    if (typeof data === 'string') {
      localStorage.setItem(keyName, data)
      return
    }
    localStorage.setItem(keyName, JSON.stringify(data))
  }

  persistLocalData(keyName, data) {
    if (typeof data === 'string') {
      localStorage.setItem(keyName, data)
      return
    }
    localStorage.setItem(keyName, JSON.stringify(data))
  }

  getLocalData(keyName) {
    let data = localStorage.getItem(keyName)
    if (data == null) return data
    try {
      // return the parsed json object
      return JSON.parse(data)
    } catch (e) {
      // error means this is not a json data, which is a saved string
      return data
    }
  }

  removeLocalKey(keyName) {
    let keys = localStorage.getItem(this.KEYS.LOCAL_KEYS)
    if (keys == null) {
      return
    }
    let keyArray = JSON.parse(keys)
    let index = keyArray.indexOf(keyName)
    if (index !== -1) {
      keyArray.splice(index, 1)
      localStorage.setItem(this.KEYS.LOCAL_KEYS, JSON.stringify(keyArray))
    }
  }

  removeLocalData(keyName) {
    this.removeLocalKey(keyName)
    localStorage.removeItem(keyName)
  }

  /**
   * Function to get the instance of the cookie handler
   */
  static getInstance() {
    if (this.instance == null) {
      this.instance = new DataHandler()
    }
    return this.instance
  }
}

export default DataHandler.getInstance()
