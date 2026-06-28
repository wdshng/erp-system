<script setup>
/**
 * AppLayout.vue - 主布局组件
 * 包含左侧深色侧边栏、顶部导航栏和内容区域
 * 支持移动端侧边栏显示/隐藏
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 侧边栏是否在移动端显示
const sidebarVisible = ref(false)

// 切换侧边栏显示状态
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 点击遮罩关闭侧边栏（移动端）
const closeSidebar = () => {
  sidebarVisible.value = false
}

// 导航菜单分组配置
const navGroups = [
  {
    title: '主要功能',
    items: [
      { label: '仪表盘', path: '/dashboard', icon: '\u{1F4CA}' },
      { label: '销售订单', path: '/sales', icon: '\u{1F4DD}' },
      { label: '库存管理', path: '/inventory', icon: '\u{1F4E6}' },
      { label: '客户管理', path: '/customers', icon: '\u{1F465}' },
    ],
  },
  {
    title: '财务与报表',
    items: [
      { label: '财务管理', path: '/finance', icon: '\u{1F4B0}' },
      { label: '数据报表', path: '/reports', icon: '\u{1F4C8}' },
    ],
  },
  {
    title: '系统',
    items: [
      { label: '业务流程', path: '/workflow', icon: '\u{2699}\u{FE0F}' },
    ],
  },
]

// 根据路由路径获取当前页面标题
const pageTitle = computed(() => {
  const allItems = navGroups.flatMap((g) => g.items)
  const matched = allItems.find((item) => item.path === route.path)
  return matched ? matched.label : 'ERP System'
})

// 面包屑数据
const breadcrumbs = computed(() => {
  const crumbs = [{ label: '首页', path: '/dashboard' }]
  const allItems = navGroups.flatMap((g) => g.items)
  const matched = allItems.find((item) => item.path === route.path)
  if (matched) {
    crumbs.push({ label: matched.label, path: matched.path })
  }
  return crumbs
})
</script>

<template>
  <div class="app-layout">
    <!-- 移动端遮罩层 -->
    <div
      v-if="sidebarVisible"
      class="sidebar-overlay"
      @click="closeSidebar"
    />

    <!-- 左侧侧边栏 -->
    <aside class="sidebar" :class="{ visible: sidebarVisible }">
      <!-- Logo 区域 -->
      <div class="sidebar-logo">
        <div class="logo-icon">E</div>
        <div class="logo-text">
          <h1>ERP System</h1>
          <p>销售与库存管理 v2.0</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div
          v-for="group in navGroups"
          :key="group.title"
          class="nav-group"
        >
          <div class="nav-group-title">{{ group.title }}</div>
          <ul class="nav-list">
            <li v-for="item in group.items" :key="item.path">
              <router-link
                :to="item.path"
                :class="['nav-item', { active: $route.path === item.path }]"
                @click="closeSidebar"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-label">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- 右侧主内容区 -->
    <div class="main-wrapper">
      <!-- 顶部 Header -->
      <header class="header">
        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="toggleSidebar">
          <span class="menu-bar" />
          <span class="menu-bar" />
          <span class="menu-bar" />
        </button>

        <!-- 面包屑 -->
        <nav class="breadcrumb">
          <span
            v-for="(crumb, index) in breadcrumbs"
            :key="crumb.path"
            class="breadcrumb-item"
          >
            <router-link v-if="index === 0" :to="crumb.path">
              {{ crumb.label }}
            </router-link>
            <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-sep">
              /
            </span>
          </span>
        </nav>

        <h2 class="page-title">{{ pageTitle }}</h2>

        <!-- 右侧工具栏 -->
        <div class="header-actions">
          <!-- 搜索框 -->
          <div class="search-box">
            <span class="search-icon">&#128269;</span>
            <input type="text" placeholder="搜索..." />
          </div>

          <!-- 通知按钮 -->
          <button class="action-btn notification-btn">
            &#128276;
            <span class="badge">3</span>
          </button>

          <!-- 用户头像 -->
          <div class="user-avatar">
            <div class="avatar">U</div>
            <span class="user-name">管理员</span>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ===== 主布局容器 ===== */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg, #f0f2f5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--ink, #1a1a2e);
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: #1a1a2e;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

/* Logo 区域 */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--accent, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #fff;
  line-height: 1.3;
}

.logo-text p {
  font-size: 11px;
  margin: 2px 0 0;
  color: rgba(255, 255, 255, 0.5);
}

/* ===== 导航菜单 ===== */
.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-group-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  padding: 12px 20px 8px;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-item.active {
  color: #fff;
  background: rgba(79, 70, 229, 0.2);
  border-left-color: var(--accent, #4f46e5);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
}

/* ===== 主内容包裹层 ===== */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== 顶部 Header ===== */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 64px;
  background: var(--bg2, #ffffff);
  border-bottom: 1px solid var(--rule, #e2e8f0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--ink, #1a1a2e);
  border-radius: 1px;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.breadcrumb-item a {
  color: var(--muted, #6b7280);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: var(--accent, #4f46e5);
}

.breadcrumb-current {
  color: var(--ink, #1a1a2e);
  font-weight: 500;
}

.breadcrumb-sep {
  color: var(--muted, #6b7280);
  margin: 0 2px;
}

/* 页面标题 */
.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

/* 右侧工具栏 */
.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg, #f0f2f5);
  border-radius: 8px;
  border: 1px solid var(--rule, #e2e8f0);
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  width: 140px;
  color: var(--ink, #1a1a2e);
}

.search-box input::placeholder {
  color: var(--muted, #6b7280);
}

.search-icon {
  font-size: 14px;
  opacity: 0.6;
}

/* 操作按钮 */
.action-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--bg, #f0f2f5);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.action-btn:hover {
  background: var(--rule, #e2e8f0);
}

.notification-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent5, #ef4444);
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 用户头像 */
.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent, #4f46e5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink, #1a1a2e);
}

/* ===== 内容区域 ===== */
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* ===== 遮罩层 ===== */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

/* ===== 响应式布局 ===== */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.visible {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .header {
    padding: 0 16px;
  }

  .breadcrumb {
    display: none;
  }

  .search-box {
    display: none;
  }

  .user-name {
    display: none;
  }

  .content {
    padding: 16px;
  }
}

@media (max-width: 1024px) {
  .search-box input {
    width: 100px;
  }
}
</style>
