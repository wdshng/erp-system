import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 库存 Store
 * 管理产品库存信息，支持低库存预警
 */
export const useInventoryStore = defineStore('inventory', () => {
  // ========== State ==========
  /** 产品列表 */
  const products = ref([])

  // ========== Actions ==========
  /** 添加产品 */
  function addProduct(product) {
    products.value.push({
      id: Date.now(),
      stock: 0, // 默认库存为 0
      ...product
    })
  }

  /** 更新库存数量 */
  function updateStock(productId, quantity) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.stock = Math.max(0, product.stock + quantity)
    }
  }

  // ========== Getters ==========
  /** 低库存产品列表 - 库存数量低于预警值 */
  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock <= (p.warningLevel || 10))
  })

  return {
    // State
    products,
    // Actions
    addProduct,
    updateStock,
    // Getters
    lowStockProducts
  }
})
