"use strict";
const client = require("scp2");

// 测试
client.scp(
  "./dist/",
  {
    host: "106.13.95.188",
    username: "root",
    password: "xupeng@163",
    path: "/home/admin/apps/medical-front/"
  },
  function(err) {
    if (!err) {
      console.log(
        "scp2工具上传完毕,test远端服务路径：/home/admin/apps/medical-front/"
      );
    } else {
      console.log("err", err);
    }
  }
);
