/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/OaSystem',
  component: Layout,
  redirect: '/OaSystem/ApprovalSystem/MyApproval',
  name: 'OaSystem',
  meta: {
    title: '测试OA系统',
    icon: 'nested'
  },
  children: [
    {
      path: 'ApprovalSystem',
      component: () => import('@/views/OaSystem/OaApproval/ApprovalSystem/index'), // Parent router-view
      name: 'ApprovalSystem',
      alwaysShow: true,
      meta: { title: '审批系统' },
      redirect: '/OaSystem/ApprovalSystem/MyApproval',
      children: [
        {
          path: 'MyApproval',
          component: () => import('@/views/OaSystem/OaApproval/MyApproval'),
          name: 'MyApproval',
          meta: { title: '我的申请' }
        }
      ]
    },
    {
      path: 'document',
      name: 'document',
      component: () => import('@/views/OaSystem/document/index'),
      meta: { title: '公文管理系统' },
      redirect: '/OaSystem/document/management',
      children: [
        {
          path: 'management',
          component: () => import('@/views/OaSystem/document/management'),
          name: 'management',
          meta: { title: '公文管理' }
        },
        {
          path: 'consult',
          component: () => import('@/views/OaSystem/document/consult'),
          name: 'consult',
          meta: { title: '公文查阅' }
        }
      ]
    }
  ]
}

export default nestedRouter
