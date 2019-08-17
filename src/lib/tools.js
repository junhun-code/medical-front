"use strict";

export default {
  redirectTo(path) {
    const redirect_url = window.location.href;
    window.location.href =
      `${path}?redirect_url=` + encodeURIComponent(redirect_url);
  },
  countOccurences: (arr, value) =>
    arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0),
  setSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  removeSessionStorage(key) {
    sessionStorage.removeItem(key);
  },
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
