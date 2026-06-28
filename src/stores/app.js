import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用全局 Store
 * 管理应用级别的全局状态，如侧边栏和当前页面
 */
export const useAppStore = defineStore('app', () => {
  // ========== State ==========
  /** 侧边栏是否展开 */
  const sidebarOpen = ref(true)
  /** 当前页面名称 */
  const currentPage = ref('dashboard')

  // ========== Actions ==========
  /** 切换侧边栏展开/收起 */
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  /** 设置当前页面 */
  function setCurrentPage(page) {
    currentPage.value = page
  }

  return {
    // State
    sidebarOpen,
    currentPage,
    // Actions
    toggleSidebar,
    setCurrentPage
  }
})
