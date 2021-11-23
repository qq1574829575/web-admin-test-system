// 未使用getter的方式
import { resetRouter } from '@/router'

const state = {
  token: null,
  userInfo: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  logout({ commit, state, dispatch }) {
    // 清除本地用户信息
    localStorage.clear()
    // 重置路由
    resetRouter()
    // 清除状态管理器token
    commit('SET_TOKEN', null)
    // 清除所有视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
