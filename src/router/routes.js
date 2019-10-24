"use strict";

const site = {
  path: "/site/:siteId",
  name: "site",
  meta: { title: "站点" },
  component: () => import("@/views/Site")
};

const login = {
  path: "/login",
  name: "login",
  meta: { title: "登录" },
  component: () => import("@/views/Login")
};

const list = {
  path: "/list",
  name: "list",
  meta: { title: "数据列表" },
  component: () => import("@/views/List")
};

const sketch = {
  path: "/sketch",
  name: "sketch",
  meta: { title: "数据勾画" },
  component: () => import("@/views/Sketch")
};

const version = {
  path: "/version",
  name: "version",
  meta: { title: "AI版本" },
  component: () => import("@/views/Version")
};

export const routes = [
  site,
  login,
  {
    path: "/",
    component: () => import("../views/Layout.vue"),
    redirect: "/list",
    children: [list, sketch, version]
  }
];
