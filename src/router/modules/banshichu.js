import Layout from '@/view/layout/Layout'
const banshichuRouter = {
  path: '/banshichu',
  component: Layout,
  alwaysShow: true,
  redirect: '/banshichu/banshichu-list',
  name:'banshichu',
  title: 'title',
  children: [
    {
      path: 'banshichu-list',
      component: () => import('@/view/banshichu/banshichu-list'),
      meta: {
        title: '街道办列表'
      }
    },
    {
      path: 'banshichu-zhanghu',
      component: () => import('@/view/banshichu/banshichu-zhanghu'),
      meta: {
        title: '街道办账户'
      }
    },
    {
      path: 'banshichu-role',
      component: () => import('@/view/banshichu/banshichu-role'),
      meta: {
        title: '街道办角色'
      }
    },
    {
      path: 'banshichu-menu',
      component: () => import('@/view/banshichu/banshichu-menu'),
      meta: {
        title: '街道办菜单'
      }
    },
    {
      path: 'banshichu-list/banner-list-banshi',
      component: () => import('@/view/banshichu/banner-list-banshi'),
      meta: {
        title: '轮播(街道办)'
      }
    },
    {
      path: 'banshichu-list/ads-list-banshi',
      component: () => import('@/view/banshichu/ads-list-banshi'),
      meta: {
        title: '广告位(街道办)'
      }
    },
  ]
}
export default banshichuRouter
