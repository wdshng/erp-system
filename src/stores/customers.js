import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 客户 Store
 * 管理客户基本信息
 */
export const useCustomersStore = defineStore('customers', () => {
  // ========== State ==========
  /** 客户列表 */
  const customers = ref([])

  // ========== Actions ==========
  /** 新增客户 */
  function addCustomer(customer) {
    customers.value.push({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...customer
    })
  }

  /** 删除客户 */
  function removeCustomer(customerId) {
    const index = customers.value.findIndex(c => c.id === customerId)
    if (index !== -1) {
      customers.value.splice(index, 1)
    }
  }

  /** 更新客户信息 */
  function updateCustomer(customerId, data) {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      Object.assign(customer, data)
    }
  }

  return {
    // State
    customers,
    // Actions
    addCustomer,
    removeCustomer,
    updateCustomer
  }
})
