import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
  //       component: () => import('@/views/test/index'),
  //       name: 'Index',
  //       meta: { title: '上传工资表', icon: 'money', noCache: true }
  //     },
  //     {
  //       path: 'wage',
  //       component: () => import('@/views/test/wage'),
  //       name: 'Wage',
  //       meta: { title: '个人工资明细', icon: 'money', noCache: true }
  //     },
  //     {
  //       path: 'CwUploadWage',
  //       component: () => import('@/views/test/CwUploadWage'),
  //       name: 'CwUploadWage',
  //       meta: { title: '上传财务明细', icon: 'money', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: false,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: '用户中心', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/gongwen',
  //   component: Layout,
  //   redirect: 'noRedirect', // 在面包屑中不可点击
  //   alwaysShow: true,
  //   hidden: false,
  //   meta: {
  //     title: '公文系统',
  //     icon: 'lock'
  //   },
  //   children: [
  //     {
  //       path: 'newGongwen',
  //       component: () => import('@/views/gongwen/newGongwen/index'),
  //       name: 'newGongwen',
  //       meta: { title: '发布公文', icon: 'user', noCache: true }
  //     },
  //     {
  //       path: 'daibanGongwen',
  //       component: () => import('@/views/gongwen/daibanGongwen/index'),
  //       name: 'daibanGongwen',
  //       meta: { title: '待办公文', icon: 'user', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/document',
  //   component: Layout,
  //   redirect: 'noRedirect', // 在面包屑中不可点击
  //   alwaysShow: true,
  //   hidden: false,
  //   meta: {
  //     title: '公文管理系统',
  //     icon: 'lock'
  //   },
  //   children: [
  //     {
  //       path: 'management',
  //       component: () => import('@/views/document/management'),
  //       name: 'management',
  //       meta: { title: '公文管理', icon: 'lock', noCache: true }
  //     },
  //     {
  //       path: 'consult',
  //       component: () => import('@/views/document/consult'),
  //       name: 'consult',
  //       meta: { title: '公文查阅', icon: 'lock', noCache: true }
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
