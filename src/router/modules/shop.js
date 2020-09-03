

import Layout from '@/view/layout/Layout'
const shopRouter = {
  path: '/shop',
  component: Layout,
  alwaysShow: true,
  redirect: '/shop/product-hot-search',
  name:'shop',
  title: 'title',
  children: [
    {
      path: 'product-hot-search',
      component: () => import('@/view/shop/product-hot-search'),
      meta: {
        title: '产品热搜'
      }
    },
    {
      path: 'product-cate',
      component: () => import('@/view/shop/product-cate'),
      meta: {
        title: '产品分类'
      }
    },
    {
      path: 'product-unit',
      component: () => import('@/view/shop/product-unit'),
      meta: {
        title: '产品单位'
      }
    },
    {
      path: 'product-list',
      component: () => import('@/view/shop/product-list'),
      meta: {
        title: '产品列表'
      }
    },
    {
      path: 'product-list/add-product',
      component: () => import('@/view/shop/add-product'),
      meta: {
        title: '产品增改'
      }
    },
    {
      path: 'product-tuijian',
      component: () => import('@/view/shop/product-tuijian'),
      meta: {
        title: '产品推荐'
      }
    },
    {
      path: 'product-tuijian/choice-product',
      component: () => import('@/view/shop/choice-product'),
      meta: {
        title: '设置产品'
      }
    },
  ]
}
export default shopRouter
