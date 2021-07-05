import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import request from '@/utils/request'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单路由，即不需要登录也可以访问到的路由

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // localStorage.clear()
  // 获取本地用户信息
  const userinfo = JSON.parse(window.localStorage.getItem('userinfo'))
  if (userinfo) {
    await store.dispatch('user/setUserinfo', userinfo)
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoutes = store.getters.hasRoutes
      if (hasRoutes) {
        next()
      } else {
        const res = await request({
          url: '/GetAdminUserInfo',
          method: 'post',
          data: { username: userinfo.studentID }
        })
        // 获取管理用户路由
        const accessRoutes = await store.dispatch('permission/generateRoutes', res)
        // 加载动态路由
        router.addRoutes(accessRoutes)
        // 设置hasRoutes状态
        await store.dispatch('user/setHasRoutes', true)
        await store.dispatch('user/setAdminUserinfo', res.admin_userinfo)
        next({ ...to, replace: true })
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在路由白名单的直接通过
      next()
    } else {
      // 否则转到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
