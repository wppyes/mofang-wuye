import Layout from '@/view/layout/Layout'
const starRouter = {
  path: '/star',
  component: Layout,
  alwaysShow: true,
  redirect: '/star/star-biglist',
  name:'star',
  title: 'title',
  children: [
    {
      path: 'star-biglist',
      component: () => import('@/view/star/star-biglist'),
      meta: {
        title: '明星列表'
      }
    },
    {
      path: 'star-biglist/add-star',
      component: () => import('@/view/star/add-star'),
      meta: {
        title: '明星增改'
      }
    },
    {
      path: 'star-fenlei',
      component: () => import('@/view/star/star-fenlei'),
      meta: {
        title: '明星分类'
      }
    },
    {
      path: 'pingjia-fenlei',
      component: () => import('@/view/star/pingjia-fenlei'),
      meta: {
        title: '评价分类'
      }
    },
  ]
}
export default starRouter
