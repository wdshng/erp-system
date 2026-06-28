import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 财务 Store
 * 管理发票及付款信息
 */
export const useFinanceStore = defineStore('finance', () => {
  // ========== State ==========
  /** 发票列表 */
  const invoices = ref([])

  // ========== Actions ==========
  /** 新增发票 */
  function addInvoice(invoice) {
    invoices.value.push({
      id: Date.now(),
      paid: false, // 默认未支付
      createdAt: new Date().toISOString(),
      ...invoice
    })
  }

  /** 支付发票 - 标记发票为已支付 */
  function payInvoice(invoiceId) {
    const invoice = invoices.value.find(i => i.id === invoiceId)
    if (invoice && !invoice.paid) {
      invoice.paid = true
      invoice.paidAt = new Date().toISOString()
    }
  }

  return {
    // State
    invoices,
    // Actions
    addInvoice,
    payInvoice
  }
})
