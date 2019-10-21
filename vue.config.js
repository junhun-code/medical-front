"use strict";

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: {
    port: 8080,
    host: "dev.nlifec.com",
    disableHostCheck: true,
    proxy: {
      "/msci": {
        target: "http://l2736397e3.wicp.vip:13935/",
        pathRewrite: { "^/msci": "" },
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
