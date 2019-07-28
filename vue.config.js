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
      "/jspxcms": {
        target: "http://60.191.84.4:8088/",
        changeOrigin: true,
        secure: false
      }
    }
  },
  chainWebpack(config) {
    // alias
    config.resolve.alias.set("@", resolve("src"));
  }
};
