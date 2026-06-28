<script setup>
/**
 * CustomerView.vue - 客户管理页面
 * 展示客户列表（含头像、联系方式、累计金额、订单数）
 * 支持新建客户弹窗表单
 */
import { ref, reactive } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import { customers as mockCustomers } from '@/data/mockData'
import AppModal from '@/components/common/AppModal.vue'

// ==================== 客户 Store ====================
const customersStore = useCustomersStore()

// ==================== 初始化客户数据 ====================
/** 如果 store 中没有客户数据，则从 mockData 加载 */
if (customersStore.customers.length === 0) {
  mockCustomers.forEach((c) => {
    customersStore.addCustomer({
      name: c.name,
      contact: c.contact,
      phone: c.phone,
      email: c.email,
      address: '',
      orders: c.orders,
      amount: c.amount,
      color: c.color,
    })
  })
}

// ==================== 新建客户弹窗控制 ====================
/** 控制新建客户弹窗的显示与隐藏 */
const showModal = ref(false)

// ==================== 新建客户表单数据 ====================
/** 客户表单响应式对象 */
const form = reactive({
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
})

// ==================== 格式化金额 ====================
/** 将数值格式化为带逗号的万元字符串 */
const formatAmount = (val) => {
  return '¥' + Number(val).toLocaleString()
}

// ==================== 打开新建客户弹窗 ====================
/** 重置表单并打开弹窗 */
const openCreateModal = () => {
  form.name = ''
  form.contact = ''
  form.phone = ''
  form.email = ''
  form.address = ''
  showModal.value = true
}

// ==================== 关闭弹窗 ====================
const closeModal = () => {
  showModal.value = false
}

// ==================== 提交新客户表单 ====================
/** 表单校验通过后调用 store 新增客户 */
const handleSubmit = () => {
  // 基本校验：客户名称和联系人为必填
  if (!form.name.trim() || !form.contact.trim()) {
    return
  }

  customersStore.addCustomer({
    name: form.name.trim(),
    contact: form.contact.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    orders: 0,
    amount: 0,
    color: getRandomColor(),
  })

  // 关闭弹窗
  closeModal()
}

// ==================== 生成随机头像颜色 ====================
/** 从预设颜色列表中随机选取一个颜色 */
const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#EC4899', '#F97316',
    '#6366F1', '#14B8A6',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div class="customer-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">客户管理</h2>
      <p class="page-desc">管理客户信息，跟踪累计采购金额与订单数</p>
    </div>

    <!-- 客户列表卡片 -->
    <div class="customer-card">
      <!-- 卡片头部：标题 + 新建按钮 -->
      <div class="card-header">
        <h3 class="card-title">客户列表</h3>
        <button class="btn-create" @click="openCreateModal">
          + 新建客户
        </button>
      </div>

      <!-- 客户列表内容 -->
      <div class="customer-list">
        <div
          v-for="customer in customersStore.customers"
          :key="customer.id"
          class="customer-item"
        >
          <!-- 客户头像：显示名称首字 + 背景色 -->
          <div
            class="customer-avatar"
            :style="{ background: customer.color || '#3B82F6' }"
          >
            {{ customer.name.charAt(0) }}
          </div>

          <!-- 客户信息区域 -->
          <div class="customer-info">
            <!-- 客户名称 -->
            <div class="customer-name">{{ customer.name }}</div>
            <!-- 联系人 | 电话 | 邮箱 -->
            <div class="customer-detail">
              <span class="detail-item">{{ customer.contact }}</span>
              <span class="detail-sep">|</span>
              <span class="detail-item">{{ customer.phone }}</span>
              <span class="detail-sep">|</span>
              <span class="detail-item">{{ customer.email }}</span>
            </div>
          </div>

          <!-- 累计金额 -->
          <div class="customer-amount">
            <div class="amount-label">累计金额</div>
            <div class="amount-value">{{ formatAmount(customer.amount) }}</div>
          </div>

          <!-- 订单数 -->
          <div class="customer-orders">
            <div class="orders-label">订单数</div>
            <div class="orders-value">{{ customer.orders }}</div>
          </div>
        </div>

        <!-- 空数据提示 -->
        <div v-if="customersStore.customers.length === 0" class="empty-tip">
          暂无客户数据
        </div>
      </div>
    </div>

    <!-- 新建客户弹窗 -->
    <AppModal
      :visible="showModal"
      title="新建客户"
      width="560px"
      @close="closeModal"
    >
      <!-- 表单内容 -->
      <div class="form-body">
        <div class="form-group">
          <label class="form-label">客户名称 <span class="required">*</span></label>
          <input
            v-model="form.name"
            type="text"
            class="form-input"
            placeholder="请输入客户名称"
          />
        </div>
        <div class="form-group">
          <label class="form-label">联系人 <span class="required">*</span></label>
          <input
            v-model="form.contact"
            type="text"
            class="form-input"
            placeholder="请输入联系人姓名"
          />
        </div>
        <div class="form-group">
          <label class="form-label">电话</label>
          <input
            v-model="form.phone"
            type="text"
            class="form-input"
            placeholder="请输入联系电话"
          />
        </div>
        <div class="form-group">
          <label class="form-label">邮箱</label>
          <input
            v-model="form.email"
            type="text"
            class="form-input"
            placeholder="请输入电子邮箱"
          />
        </div>
        <div class="form-group">
          <label class="form-label">地址</label>
          <input
            v-model="form.address"
            type="text"
            class="form-input"
            placeholder="请输入详细地址"
          />
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <button class="btn-cancel" @click="closeModal">取消</button>
        <button class="btn-confirm" @click="handleSubmit">确认新建</button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
/* ===== 页面容器 ===== */
.customer-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
}

/* ===== 页面头部 ===== */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  margin: 0 0 4px;
}

.page-desc {
  font-size: 14px;
  color: var(--muted, #6b7280);
  margin: 0;
}

/* ===== 客户列表卡片 ===== */
.customer-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
}

/* ===== 卡片头部 ===== */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0;
}

/* ===== 新建客户按钮 ===== */
.btn-create {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: var(--accent, #4f46e5);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-create:hover {
  background: #4338ca;
}

/* ===== 客户列表 ===== */
.customer-list {
  display: flex;
  flex-direction: column;
}

/* ===== 单个客户行 ===== */
.customer-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.customer-item:hover {
  background: var(--bg, #f0f2f5);
  border-color: var(--rule, #e2e8f0);
}

/* ===== 客户头像 ===== */
.customer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

/* ===== 客户信息区域 ===== */
.customer-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.customer-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-sep {
  flex-shrink: 0;
  color: var(--rule, #e2e8f0);
}

/* ===== 累计金额 ===== */
.customer-amount {
  text-align: right;
  min-width: 140px;
}

.amount-label {
  font-size: 12px;
  color: var(--muted, #6b7280);
  margin-bottom: 2px;
}

.amount-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent, #4f46e5);
}

/* ===== 订单数 ===== */
.customer-orders {
  text-align: center;
  min-width: 80px;
}

.orders-label {
  font-size: 12px;
  color: var(--muted, #6b7280);
  margin-bottom: 2px;
}

.orders-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
}

/* ===== 空数据提示 ===== */
.empty-tip {
  text-align: center;
  padding: 48px 16px;
  font-size: 14px;
  color: var(--muted, #6b7280);
}

/* ===== 表单区域 ===== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink, #1a1a2e);
}

.required {
  color: var(--accent5, #ef4444);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink, #1a1a2e);
  background: var(--bg, #f0f2f5);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
  color: var(--muted, #6b7280);
}

/* ===== 底部按钮 ===== */
.btn-cancel {
  padding: 8px 20px;
  background: var(--bg, #f0f2f5);
  color: var(--ink, #1a1a2e);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-cancel:hover {
  background: var(--rule, #e2e8f0);
}

.btn-confirm {
  padding: 8px 20px;
  background: var(--accent, #4f46e5);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-confirm:hover {
  background: #4338ca;
}

/* ===== 响应式适配 ===== */
@media (max-width: 768px) {
  .customer-item {
    flex-wrap: wrap;
    gap: 12px;
  }

  .customer-amount {
    min-width: auto;
    text-align: left;
  }

  .customer-orders {
    min-width: auto;
    text-align: left;
  }
}
</style>
