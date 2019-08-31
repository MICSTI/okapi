import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  UPDATE_USER,
} from './actions.type';
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from './mutations.type';

const state = {
  errors: null,
  user: {},
  isAuthenticated: false,
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      // TODO call ApiService.login
      data = {
        user: { 'id': 'a' },
      };

      context.commit(SET_AUTH, data.user);
      resolve(data);
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, user) {
    return new Promise((resolve, reject) => {
      // TODO call ApiService.register
      data = {
        user: { 'id': 'a' },
      };

      context.commit(SET_AUTH, data.user);
      resolve(data);
    });
  },
  [CHECK_AUTH](context, payload) {
    // check if JwtService has token, otherwise purge auth
  },
  [UPDATE_USER](context, payload) {
    // call ApiService.update
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    // JwtService.saveToken(state.user.token);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    // JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters,
}
