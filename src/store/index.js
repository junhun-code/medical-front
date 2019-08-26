"use strict";

import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: false,
  plugins: debug ? [createLogger()] : []
});
