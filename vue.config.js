"use strict";

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: {
    port: 8080,
    host: "0.0.0.0",
    disableHostCheck: true,
    proxy: {
      "/": {
        target: "http://60.191.84.4:8088/",
        // target: "http://192.168.1.136:8080/",
        changeOrigin: true,
        ws: false, //值为false防止控制台报错
        secure: false
      }
    }
  },
  chainWebpack(config) {
    // alias
    config.resolve.alias.set("@", resolve("src"));
  }
};
