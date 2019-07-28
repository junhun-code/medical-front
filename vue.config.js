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
        target: "http://192.168.1.136",
        changeOrigin: true,
        autoRewrite: true,
        cookieDomainRewrite: true
      }
    }
  },
  chainWebpack(config) {
    // alias
    config.resolve.alias.set("@", resolve("src"));
  }
};
