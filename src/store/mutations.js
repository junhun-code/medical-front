"use strict";

import * as types from "./mutation-types";

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  [types.SET_DATA_MANAGE_PERMS](state, perms) {
    perms.forEach(item => {
      if (item.perm === "back_dataManage") {
        state.listPerms = item;
      } else if (item.perm === "sketch_dataManage") {
        state.sketchPerms = item;
      }
    });
  },
  [types.SET_SELECTED_RECORDS](state, records) {
    state.selectedRecords = records;
  }
};

export default mutations;
