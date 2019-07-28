"use strict";

import axios from "axios";
import { Notification } from 'element-ui';

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
    Notification.error({
        title:`错误：${error.response.status}`,
        message:'服务器开小差了'
    })

    return Promise.reject(error.response);
  }
);

export default axios;
