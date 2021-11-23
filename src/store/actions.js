const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  }
}
export default actions
