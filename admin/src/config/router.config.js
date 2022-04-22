import { BasicLayout, UserLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const constantRouterMap = [
  {
    path: '/user',
    name: 'user',
    component: UserLayout,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/user/Login'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Welcome'),
        meta: { title: 'menu.dashboard.welcome', keepAlive: true, icon: 'dashboard', permission: ['dashboard'] },
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', keepAlive: true, icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.table', keepAlive: true, permission: ['table'] }
          }
        ]
      },
      // form
      // {
      //   path: '/form',
      //   name: 'form',
      //   meta: {
      //     keepAlive: true,
      //     title: 'menu.form.default',
      //     icon: 'video-camera',
      //   },
      //   component: RouteView,
      //   children: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basic-form',
      //       meta: {
      //         keepAlive: true,
      //         icon: 'smile',
      //         title: 'menu.form.basicform',
      //       },
      //       component: () => import(/* webpackChunkName: "about" */ '../views/form/basic-form'),
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'step-form',
      //       meta: {
      //         keepAlive: true,
      //         icon: 'smile',
      //         title: 'menu.form.stepform',
      //       },
      //       component: () => import(/* webpackChunkName: "about" */ '../views/form/step-form'),
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advanced-form',
      //       meta: {
      //         keepAlive: true,
      //         icon: 'smile',
      //         title: 'menu.form.advancedform',
      //       },
      //       component: () => import(/* webpackChunkName: "about" */ '../views/form/advanced-form'),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '*', redirect: '/404', hidden: true,
  },
]
