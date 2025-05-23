import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/survey',
    children: [{
      path: '/survey',
      name: 'Survey',
      component: () => import('@/views/survey/index'),
      meta: { title: '系统概况', icon: require('@/assets/survey.png'), iconActive: require('@/assets/survey_active.png') }
    }]
  },

  {
    path: '/dashboard',
    component: Layout,
    // redirect: '/dashboard',
    children: [{
      path: '/dashboard/index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '应用管理', icon: require('@/assets/app.png'), iconActive: require('@/assets/app_active.png') }
    }]
  },

  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path: '/plan/index',
        name: 'Plan',
        component: () => import('@/views/plan/index'),
        meta: { title: '推广计划', icon: require('@/assets/plan.png'), iconActive: require('@/assets/plan_active.png') }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    children: [
      {
        path: '/data/index',
        name: 'Data',
        component: () => import('@/views/data/index'),
        meta: { title: '推广数据', icon: require('@/assets/data.png'), iconActive: require('@/assets/data_active.png') },
      }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    children: [
      {
        path: '/channel/index',
        name: 'Channel',
        component: () => import('@/views/channel/index'),
        meta: { title: '渠道管理', icon: require('@/assets/channel.png'), iconActive: require('@/assets/channel_active.png') }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: '/settings/index',
        name: 'Settings',
        component: () => import('@/views/settings/index'),
        meta: { title: '系统设置', icon: require('@/assets/settings.png'), iconActive: require('@/assets/settings_active.png') }
      }
    ]
  },
  {
    path: '/sem',
    component: Layout,
    name: 'Sem',
    redirect: '/sem/360',
    meta: { title: 'SEM推广', icon: 'sem' },
    children:[
      {
        path: '360',
        name: '360',
        component: () => import('@/views/sem/360/'),
        meta: { title: '360 ocpc' },
      },
      {
        path: 'baidu',
        name: 'baidu',
        component: () => import('@/views/sem/baidu/'),
        meta: { title: '百度 ocpc' },
      },
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
