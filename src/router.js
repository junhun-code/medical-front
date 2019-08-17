import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login")
    },
    {
      path: "/list",
      name: "list",
      component: () => import("./views/List")
    },
    {
      path: "/sketch",
      name: "sketch",
      component: () => import("./views/Sketch")
    }
  ]
});
