import Layout from '@/view/layout/Layout'
const renyuanRouter = {
  path: '/yuangong',
  component: Layout,
  alwaysShow: true,
  redirect: '/yuangong/star-list',
  name:'yuangong',
  title: 'title',
  children: [
    {
      path: 'star-list',
      component: () => import('@/view/yuangong/star-list'),
      meta: {
        title: '明星人员管理'
      }
    },
    {
      path: 'star-biglist',
      component: () => import('@/view/yuangong/star-biglist'),
      meta: {
        title: '明星列表'
      }
    },
    {
      path: 'star-list/add-star',
      component: () => import('@/view/yuangong/add-star'),
      meta: {
        title: '明星增改'
      }
    },
    {
      path: 'star-biglist/set-renyuan',
      component: () => import('@/view/yuangong/set-renyuan'),
      meta: {
        title: '人员设置'
      }
    },
  ]
}
export default renyuanRouter
