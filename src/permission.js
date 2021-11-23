import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import http from '@/utils/http'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/PreviewApproval'] // 白名单路由，即不需要登录也可以访问到的路由

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断路由是否在白名单
  if (whiteList.indexOf(to.path) !== -1) {
    // 在路由白名单的直接通过
    next()
  } else {
    // 先检查状态管理器有无token
    const vuexToken = store.getters.token
    if (vuexToken) {
      // 状态管理器已保存了token，直接放行即可
      next()
    } else {
      // 没有token,检查localStorage是否保存了token
      const localToken = window.localStorage.getItem('token')
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      if (localToken) {
        // 本地有token
        // 设置vuex state的状态(兼容学校的状态管理)
        await store.dispatch('setToken', localToken)
        await store.dispatch('setUserInfo', userInfo)
        // 设置vuex getters的状态
        await store.dispatch('user/setToken', localToken)
        await store.dispatch('user/setUserInfo', userInfo)
        // 获取动态路由
        const res = await http.post('user/getRoutes', { token: localToken })
        // 获取管理用户路由
        const flatRoutes = await store.dispatch('permission/generateRoutes', res.data.routes)
        // 加载动态路由
        router.addRoutes(flatRoutes)
        next({ ...to, replace: true })
      } else {
        // 本地也未保存token,则跳转到登录
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
