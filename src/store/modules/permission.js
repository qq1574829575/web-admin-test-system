import { constantRoutes } from '@/router'

import Layout from '@/layout'
/**
 * Filter asynchronous routing tables by recursion
 * @param adminRoutes
 */
export function filterAsyncRoutes(adminRoutes) {
  const res = []
  adminRoutes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }
    if (tmp.component === '@/layout') {
      tmp.component = Layout
    } else {
      tmp.component = require(`@/views/${tmp.component}`).default
    }
    res.push(tmp)
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, res) {
    return new Promise(resolve => {
      if (res.msg === 'success') {
        const adminRoutes = JSON.parse(res.permission_routes.routes)
        const accessRoutes = filterAsyncRoutes(adminRoutes)
        // 404页面必须放在最后
        accessRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessRoutes)
        resolve(accessRoutes)
      } else {
        const asyncRoutes = [{ path: '*', redirect: '/404', hidden: true }]
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
