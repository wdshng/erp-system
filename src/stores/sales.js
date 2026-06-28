import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 销售订单 Store
 * 管理销售订单的增删改查及状态流转
 */
export const useSalesStore = defineStore('sales', () => {
  // ========== State ==========
  /** 销售订单列表 */
  const orders = ref([])

  // ========== Actions ==========
  /** 新增订单 */
  function addOrder(order) {
    orders.value.push({
      id: Date.now(),
      status: 'pending', // 待确认
      createdAt: new Date().toISOString(),
      ...order
    })
  }

  /** 确认订单 - 将订单状态变更为已确认 */
  function confirmOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'confirmed'
    }
  }

  /** 取消订单 - 将订单状态变更为已取消 */
  function cancelOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && (order.status === 'pending' || order.status === 'confirmed')) {
      order.status = 'cancelled'
    }
  }

  // ========== Getters ==========
  /** 按状态分类订单 */
  const orderByStatus = computed(() => {
    const grouped = {}
    orders.value.forEach(order => {
      if (!grouped[order.status]) {
        grouped[order.status] = []
      }
      grouped[order.status].push(order)
    })
    return grouped
  })

  return {
    // State
    orders,
    // Actions
    addOrder,
    confirmOrder,
    cancelOrder,
    // Getters
    orderByStatus
  }
})
