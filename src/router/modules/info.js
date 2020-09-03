import Layout from '@/view/layout/Layout'
const infoRouter = {
  path: '/info',
  component: Layout,
  alwaysShow: true,
  redirect: '/info/info-list',
  name:'info',
  title: 'title',
  children: [
    {
      path: 'info-list',
      component: () => import('@/view/info/info-list'),
      meta: {
        title: '通知列表'
      }
    },
    {
      path: 'info-list/add-info',
      component: () => import('@/view/info/add-info'),
      meta: {
        title: '通知增改'
      }
    },
    {
      path: 'info-advise',
      component: () => import('@/view/info/info-advise'),
      meta: {
        title: '投诉建议'
      }
    },
    {
      path: 'info-baoxiu',
      component: () => import('@/view/info/info-baoxiu'),
      meta: {
        title: '报修管理'
      }
    },
  ]
}
export default infoRouter
