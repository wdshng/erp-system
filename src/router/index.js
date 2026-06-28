import { createRouter, createWebHashHistory } from 'vue-router'

// 定义路由规则，全部使用懒加载
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '仪表盘', breadcrumb: '首页 / 仪表盘' }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('@/views/SalesOrderView.vue'),
    meta: { title: '销售订单', breadcrumb: '首页 / 销售管理 / 销售订单' }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/InventoryView.vue'),
    meta: { title: '库存管理', breadcrumb: '首页 / 仓库管理 / 库存管理' }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/CustomerView.vue'),
    meta: { title: '客户管理', breadcrumb: '首页 / 销售管理 / 客户管理' }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/FinanceView.vue'),
    meta: { title: '财务管理', breadcrumb: '首页 / 财务会计 / 财务管理' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/ReportView.vue'),
    meta: { title: '数据报表', breadcrumb: '首页 / 数据报表' }
  },
  {
    path: '/workflow',
    name: 'Workflow',
    component: () => import('@/views/WorkflowView.vue'),
    meta: { title: '业务流程', breadcrumb: '首页 / 系统管理 / 业务流程' }
  }
]

// 创建路由实例，使用 Hash 模式（兼容静态托管平台，无需服务器配置）
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} - ERP 销售与库存管理系统`
    : 'ERP 销售与库存管理系统'
  next()
})

export default router
