

import Layout from '@/view/layout/Layout'
const baseRouter = {
  path: '/base',
  component: Layout,
  alwaysShow: true,
  redirect: '/base/banner-list',
  name:'base',
  title: 'title',
  children: [
    {
      path: 'banner-list',
      component: () => import('@/view/base/banner-list'),
      meta: {
        title: '轮播(商城)'
      }
    },
    {
      path: 'navconfig',
      component: () => import('@/view/base/navconfig'),
      meta: {
        title: '总栏目(商城)'
      }
    },
    {
      path: 'ads',
      component: () => import('@/view/base/ads'),
      meta: {
        title: '广告位(商城)'
      }
    },
    {
      path: 'index-nav',
      component: () => import('@/view/base/index-nav'),
      meta: {
        title: '首页导航(商城)'
      }
    },
    {
      path: 'index-nav-mofang',
      component: () => import('@/view/base/index-nav-mofang'),
      meta: {
        title: '首页导航(魔方)'
      }
    },
    {
      path: 'navconfig-mofang',
      component: () => import('@/view/base/navconfig-mofang'),
      meta: {
        title: '总栏目(魔方)'
      }
    },
    {
      path: 'navconfig-banshi',
      component: () => import('@/view/base/navconfig-banshi'),
      meta: {
        title: '总栏目(办事处)'
      }
    },
  ]
}
export default baseRouter
