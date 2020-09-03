import Layout from '@/view/layout/Layout'
const wuyeRouter = {
  path: '/wuye',
  component: Layout,
  alwaysShow: true,
  redirect: '/wuye/wuye-info',
  name:'wuye',
  title: 'title',
  children: [
    {
      path: 'wuye-info',
      component: () => import('@/view/wuye/wuye-info'),
      meta: {
        title: '基本信息'
      }
    },
    {
      path: 'wuye-piaoju',
      component: () => import('@/view/wuye/wuye-piaoju'),
      meta: {
        title: '票据管理'
      }
    },
    {
      path: 'wuye-house',
      component: () => import('@/view/wuye/wuye-house'),
      meta: {
        title: '房屋管理'
      }
    },
    {
      path: 'wuye-loudong',
      component: () => import('@/view/wuye/wuye-loudong'),
      meta: {
        title: '楼栋管理'
      }
    },
    {
      path: 'wuye-fee',
      component: () => import('@/view/wuye/wuye-fee'),
      meta: {
        title: '物业费管理'
      }
    },
    {
      path: 'wuye-list',
      component: () => import('@/view/wuye/wuye-list'),
      meta: {
        title: '物业列表'
      }
    },


    {
      path: 'wuye-list',
      component: () => import('@/view/wuye/wuye-list'),
      meta: {
        title: '物业列表'
      }
    },
    {
      path: 'wuye-zhanghu',
      component: () => import('@/view/wuye/wuye-zhanghu'),
      meta: {
        title: '物业账户'
      }
    },
    {
      path: 'wuye-role',
      component: () => import('@/view/wuye/wuye-role'),
      meta: {
        title: '物业角色'
      }
    },
    {
      path: 'wuye-menu',
      component: () => import('@/view/wuye/wuye-menu'),
      meta: {
        title: '物业菜单'
      }
    },
    {
      path: 'wuye-list/wuye-renyuan',
      component: () => import('@/view/wuye/wuye-renyuan'),
      meta: {
        title: '物业人员'
      }
    },
  ]
}
export default wuyeRouter
