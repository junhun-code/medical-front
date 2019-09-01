import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import axios from "@/services/request";
import { Message } from "element-ui";
Vue.use(Router);

// 路由配置文件
import { routes } from "./routes";

var router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // 数据列表、勾画权限查询
  if (to.name !== "login") {
    axios.get("/cmscp/datamanage/dataManage/perms").then(
      res => {
        if (res.data.status === 0) {
          store.commit("SET_DATA_MANAGE_PERMS", res.data.data);
        } else {
          Message.error("权限查询失败");
        }
      },
      err => {
        Message.error("权限查询失败");
      }
    );
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
