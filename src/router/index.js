import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import nestedRouter from './modules/nested'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
  // nestedRouter
  // {
  //   path: '/Test',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true,
  //   meta: {
  //     title: '工资系统',
  //     icon: 'money'
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/FormDesign/index'),
  //       name: 'Index',
  //       meta: { title: '上传工资表', icon: 'money', noCache: true }
  //     },
  //     {
  //       path: 'wage',
  //       component: () => import('@/views/FormDesign/wage'),
  //       name: 'Wage',
  //       meta: { title: '个人工资明细', icon: 'money', noCache: true }
  //     },
  //     {
  //       path: 'CwUploadWage',
  //       component: () => import('@/views/FormDesign/CwUploadWage'),
  //       name: 'CwUploadWage',
  //       meta: { title: '上传财务明细', icon: 'money', noCache: true }
  //     }
  //   ]
  // }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
