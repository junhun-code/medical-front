"use strict";

import axios from "axios";
import { Notification } from "element-ui";

axios.defaults.timeout = 10000;
axios.defaults.headers.common["accept"] = "application/json";

// 请求拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response && response.status === 200) {
      // 未登录
      if (response.data.code === 401) {
        // auth
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = "/login";
          break;
        case 403:
          Notification.error({
            title: "错误：403",
            message: "访问拒绝"
          });
          break;
        case 404:
          Notification.error({
            title: "错误：404",
            message: "找不到网络资源"
          });
          break;
        case 500:
          Notification.error({
            title: "错误：500",
            message: "服务器出错"
          });
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
