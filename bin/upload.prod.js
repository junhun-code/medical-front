"use strict";
const client = require("scp2");

// 测试
client.scp(
  "./dist/",
  {
    host: "60.191.84.4",
    username: "zhang",
    password: "JZXserver2018~",
    path: "/d:/Medical/front/"
  },
  function(err) {
    if (!err) {
      console.log("scp2工具上传完毕,prod远端服务路径：/Medical/front/");
    } else {
      console.log("err", err);
    }
  }
);
