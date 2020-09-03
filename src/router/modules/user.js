

import Layout from '@/view/layout/Layout'
const userRouter = {
  path: '/user',
  component: Layout,
  alwaysShow: true,
  redirect: '/user/user-list',
  name:'user',
  title: 'title',
  children: [
    {
      path: 'user-list',
      component: () => import('@/view/user/user-list'),
      meta: {
        title: '用户列表'
      }
    },
  ]
}
export default userRouter
