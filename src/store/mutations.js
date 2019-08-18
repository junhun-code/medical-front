"use strict";

import * as types from "./mutation-types";

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  [types.SET_DATA_MANAGE_PERMS](state, perms) {
    console.log(perms);
    perms.forEach(item => {
      if (item.perm === "back_dataManage") {
        state.listPerms = item;
      } else if (item.perm === "sketch_dataManage") {
        state.sketchPerms = item;
      }
    });
  }
};

export default mutations;
