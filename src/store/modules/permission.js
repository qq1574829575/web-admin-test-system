import { constantRoutes } from '@/router'

import Layout from '@/layout'
/**
 * 递归动态路由
 * @param routes
 */
export function filterAsyncRoutes(routes) {
  const result = []
  for (const route of routes) {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }
    if (tmp.component === '@/layout') {
      tmp.component = Layout
    } else {
      try {
        tmp.component = require(`@/views/${tmp.component}`).default
      } catch (e) {
        console.log('加载路由组件失败：', `@/views/${tmp.component}`)
        continue
      }
    }
    result.push(tmp)
  }
  return result
}

/**
 * 生成扁平化机构路由(仅两级结构)
 * @param {*[]} accessRoutes
 * 路由基本机构:
 * {
 *   name: String,
 *   path: String,
 *   component: Component,
 *   redirect: String,
 *   children: [
 *   ]
 * }
 */
function generateFlatRoutes(accessRoutes) {
  const flatRoutes = []

  for (const item of accessRoutes) {
    let childrenFflatRoutes = []
    if (item.children && item.children.length > 0) {
      childrenFflatRoutes = castToFlatRoute(item.children, '')
    }

    // 一级路由是布局路由,需要处理的只是其子路由数据
    flatRoutes.push({
      name: item.name,
      path: item.path,
      component: item.component,
      redirect: item.redirect,
      children: childrenFflatRoutes
    })
  }

  return flatRoutes
}

/**
 * 将子路由转换为扁平化路由数组（仅一级）
 * @param {any} routes
 * @param {any} parentPath
 * @param flatRoutes
 */
function castToFlatRoute(routes, parentPath, flatRoutes = []) {
  for (const item of routes) {
    if (item.children && item.children.length > 0) {
      if (item.redirect && item.redirect !== 'noRedirect') {
        flatRoutes.push({
          name: item.name,
          path: (parentPath + '/' + item.path).substring(1),
          redirect: item.redirect,
          meta: item.meta
        })
      }
      castToFlatRoute(item.children, parentPath + '/' + item.path, flatRoutes)
    } else {
      flatRoutes.push({
        name: item.name,
        path: (parentPath + '/' + item.path).substring(1),
        component: item.component,
        meta: item.meta
      })
    }
  }

  return flatRoutes
}

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise(resolve => {
      const accessRoutes = filterAsyncRoutes(routes)
      // 404页面必须放在最后
      accessRoutes.push({ path: '*', redirect: '/404', hidden: true })
      // 扁平化路由
      const flatRoutes = generateFlatRoutes(accessRoutes)
      commit('SET_ROUTES', accessRoutes)
      resolve(flatRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
