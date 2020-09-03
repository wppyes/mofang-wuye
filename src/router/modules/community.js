

import Layout from '@/view/layout/Layout'
const communityRouter = {
  path: '/community',
  component: Layout,
  alwaysShow: true,
  redirect: '/community/list',
  name:'community',
  title: 'title',
  children: [
    {
      path: 'list',
      component: () => import('@/view/community/list'),
      meta: {
        title: '社区列表'
      }
    },
    {
      path: 'list/pinglun',
      component: () => import('@/view/community/pinglun'),
      meta: {
        title: '评论列表'
      }
    },
    {
      path: 'topic',
      component: () => import('@/view/community/topic'),
      meta: {
        title: '分类列表'
      }
    },
  ]
}
export default communityRouter
