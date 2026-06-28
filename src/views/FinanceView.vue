<script setup>
/**
 * FinanceView.vue - 财务管理页面
 * 展示收款统计卡片、收款趋势图、发票状态饼图和发票列表表格
 * 支持新建发票弹窗和收款操作
 */
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useFinanceStore } from '@/stores/finance'
import { getPaymentOption, getInvoiceStatusOption } from '@/data/chartConfig'
import { invoices as mockInvoices } from '@/data/mockData'
import StatCard from '@/components/common/StatCard.vue'
import AppTable from '@/components/common/AppTable.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppToast from '@/components/common/AppToast.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

// ==================== Store 初始化 ====================
const financeStore = useFinanceStore()

// ==================== 统计卡片数据 ====================
/** 顶部四个关键财务指标 */
const stats = [
  {
    label: '本月收款总额',
    value: '¥968,400',
    change: '+8.2%',
    changeType: 'up',
    icon: '&#165;',
    iconBg: 'rgba(79, 70, 229, 0.1)',
    iconColor: 'var(--accent)',
  },
  {
    label: '未收款',
    value: '¥386,200',
    change: '-5.1%',
    changeType: 'down',
    icon: '&#9888;',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: 'var(--accent5)',
  },
  {
    label: '已开发票',
    value: '89',
    change: '+12',
    changeType: 'up',
    icon: '&#9998;',
    iconBg: 'rgba(14, 165, 233, 0.1)',
    iconColor: 'var(--accent2)',
  },
  {
    label: '预收款余额',
    value: '¥124,800',
    change: '+3.6%',
    changeType: 'up',
    icon: '&#9733;',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    iconColor: 'var(--accent3)',
  },
]

// ==================== 发票列表 ====================
/** 表格列配置 */
const columns = [
  { key: 'id', label: '发票编号', width: '140px' },
  { key: 'customer', label: '客户', width: '200px' },
  { key: 'order', label: '关联订单', width: '140px' },
  { key: 'amount', label: '金额', width: '120px' },
  { key: 'paid', label: '已付金额', width: '120px' },
  { key: 'state', label: '状态', width: '120px' },
  { key: 'action', label: '操作', width: '120px' },
]

/** 发票列表数据（本地模拟） */
const invoiceList = ref(mockInvoices)

// ==================== Toast 通知 ====================
/** 控制是否显示 Toast 通知 */
const toastVisible = ref(false)
/** Toast 消息内容 */
const toastMessage = ref('')

/**
 * 显示成功 Toast 通知
 * @param {string} msg - 通知消息
 */
const showToast = (msg) => {
  toastMessage.value = msg
  toastVisible.value = true
}

/** 关闭 Toast */
const closeToast = () => {
  toastVisible.value = false
}

// ==================== 收款操作 ====================
/**
 * 处理收款按钮点击
 * 待付款发票显示"收款"按钮，部分付款显示"部分收款"按钮
 * @param {Object} invoice - 发票对象
 */
const handlePayInvoice = (invoice) => {
  financeStore.payInvoice(invoice.id)
  // 更新本地列表状态为已付款
  const target = invoiceList.value.find(i => i.id === invoice.id)
  if (target) {
    target.state = 'paid'
    target.paid = target.amount
  }
  showToast(`发票 ${invoice.id} 收款成功！`)
}

/**
 * 判断发票是否可收款
 * @param {Object} invoice - 发票对象
 * @returns {boolean} 是否可收款
 */
const canPay = (invoice) => invoice.state === 'pending' || invoice.state === 'partial'

/**
 * 获取收款按钮文字
 * @param {Object} invoice - 发票对象
 * @returns {string} 按钮文字
 */
const getPayButtonText = (invoice) => {
  return invoice.state === 'pending' ? '收款' : '部分收款'
}

/**
 * 格式化金额显示
 * @param {number} amount - 金额数值
 * @returns {string} 格式化后的金额
 */
const formatAmount = (amount) => {
  return `¥${amount.toLocaleString('zh-CN')}`
}

/**
 * 获取发票状态对应的 StatusBadge 类型
 * @param {string} state - 发票状态
 * @returns {string} StatusBadge 类型标识
 */
const getBadgeType = (state) => {
  const map = {
    paid: 'paid',
    partial: 'partial',
    pending: 'pending',
  }
  return map[state] || 'draft'
}

// ==================== 新建发票弹窗 ====================
/** 控制新建发票弹窗显示 */
const modalVisible = ref(false)
/** 新建发票表单数据 */
const newInvoice = ref({
  customer: '',
  order: '',
  date: '',
  amount: '',
  paymentTerms: 'net30',
})

/** 付款条件选项 */
const paymentTermsOptions = [
  { value: 'net15', label: '货到15天' },
  { value: 'net30', label: '货到30天' },
  { value: 'net60', label: '货到60天' },
  { value: 'prepaid', label: '预付款' },
]

/** 打开新建发票弹窗 */
const openCreateModal = () => {
  newInvoice.value = {
    customer: '',
    order: '',
    date: '',
    amount: '',
    paymentTerms: 'net30',
  }
  modalVisible.value = true
}

/** 关闭新建发票弹窗 */
const closeCreateModal = () => {
  modalVisible.value = false
}

/** 提交新建发票 */
const handleSubmitCreate = () => {
  const invoice = {
    customer: newInvoice.value.customer,
    order: newInvoice.value.order,
    amount: Number(newInvoice.value.amount) || 0,
    paid: 0,
    state: 'pending',
  }
  financeStore.addInvoice(invoice)
  // 同步到本地列表
  invoiceList.value.push({
    id: `INV-2026-${String(invoiceList.value.length + 1).padStart(3, '0')}`,
    ...invoice,
  })
  modalVisible.value = false
  showToast('发票创建成功！')
}

// ==================== ECharts 图表 ====================
/** 收款趋势图表 DOM 引用 */
const chartPaymentRef = ref(null)
/** 发票状态饼图 DOM 引用 */
const chartInvoiceRef = ref(null)
/** 收款趋势图表实例 */
let chartPaymentInstance = null
/** 发票状态饼图实例 */
let chartInvoiceInstance = null

/** 安全初始化单个图表 */
function safeInit(domRef, optionFn) {
  if (!domRef || typeof optionFn !== 'function') return null
  try {
    const chart = echarts.init(domRef)
    chart.setOption(optionFn())
    return chart
  } catch (e) {
    console.error('图表初始化失败:', e)
    return null
  }
}

/** 初始化 ECharts 图表 */
const initCharts = () => {
  chartPaymentInstance = safeInit(chartPaymentRef.value, getPaymentOption)
  chartInvoiceInstance = safeInit(chartInvoiceRef.value, getInvoiceStatusOption)
}

/** 窗口大小变化时自适应 */
const handleResize = () => {
  chartPaymentInstance?.resize()
  chartInvoiceInstance?.resize()
}

// ==================== 生命周期 ====================
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例，释放内存
  chartPaymentInstance?.dispose()
  chartInvoiceInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="finance-view">
    <!-- ==================== 页面标题 ==================== -->
    <div class="page-header">
      <h2 class="page-title">财务管理</h2>
      <button class="btn-primary" @click="openCreateModal">+ 新建发票</button>
    </div>

    <!-- ==================== 统计卡片 ==================== -->
    <div class="stats-grid">
      <StatCard
        v-for="item in stats"
        :key="item.label"
        :label="item.label"
        :value="item.value"
        :change="item.change"
        :change-type="item.changeType"
        :icon="item.icon"
        :icon-bg="item.iconBg"
        :icon-color="item.iconColor"
      />
    </div>

    <!-- ==================== 图表区域 ==================== -->
    <div class="charts-grid">
      <!-- 收款趋势图 -->
      <div class="chart-card">
        <h3 class="chart-title">收款趋势</h3>
        <div ref="chartPaymentRef" class="chart-container"></div>
      </div>
      <!-- 发票状态饼图 -->
      <div class="chart-card">
        <h3 class="chart-title">发票状态分布</h3>
        <div ref="chartInvoiceRef" class="chart-container"></div>
      </div>
    </div>

    <!-- ==================== 发票列表 ==================== -->
    <div class="table-section">
      <h3 class="section-title">发票列表</h3>
      <AppTable :columns="columns" :data="invoiceList" empty-text="暂无发票记录">
        <!-- 自定义单元格内容 -->
        <template #cell="{ column, row }">
          <!-- 金额列：格式化显示 -->
          <template v-if="column.key === 'amount'">
            <span class="amount-text">{{ formatAmount(row.amount) }}</span>
          </template>
          <!-- 已付金额列：格式化显示 -->
          <template v-else-if="column.key === 'paid'">
            <span class="amount-text">{{ formatAmount(row.paid) }}</span>
          </template>
          <!-- 状态列：使用 StatusBadge 组件 -->
          <template v-else-if="column.key === 'state'">
            <StatusBadge :type="getBadgeType(row.state)" />
          </template>
          <!-- 操作列：收款按钮 -->
          <template v-else-if="column.key === 'action'">
            <button
              v-if="canPay(row)"
              class="btn-pay"
              @click="handlePayInvoice(row)"
            >
              {{ getPayButtonText(row) }}
            </button>
            <span v-else class="action-done">--</span>
          </template>
          <!-- 其他列：显示原始值 -->
          <template v-else>
            {{ row[column.key] }}
          </template>
        </template>
      </AppTable>
    </div>

    <!-- ==================== 新建发票弹窗 ==================== -->
    <AppModal :visible="modalVisible" title="新建发票" width="560px" @close="closeCreateModal">
      <div class="form-body">
        <div class="form-group">
          <label class="form-label">关联订单</label>
          <select v-model="newInvoice.order" class="form-input">
            <option value="">请选择关联订单</option>
            <option value="SO-2026-0001">SO-2026-0001 - 华东精密机械有限公司</option>
            <option value="SO-2026-0002">SO-2026-0002 - 深圳鑫达电子科技</option>
            <option value="SO-2026-0004">SO-2026-0004 - 北京智造装备有限公司</option>
            <option value="SO-2026-0006">SO-2026-0006 - 成都航发精密铸造</option>
            <option value="SO-2026-0008">SO-2026-0008 - 武汉钢铁配套设备厂</option>
            <option value="SO-2026-0011">SO-2026-0011 - 苏州精密模具有限公司</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">客户名称</label>
          <input
            v-model="newInvoice.customer"
            type="text"
            class="form-input"
            placeholder="请输入客户名称"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">开票日期</label>
            <input
              v-model="newInvoice.date"
              type="date"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">发票金额</label>
            <input
              v-model="newInvoice.amount"
              type="number"
              class="form-input"
              placeholder="请输入金额"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">付款条件</label>
          <select v-model="newInvoice.paymentTerms" class="form-input">
            <option
              v-for="opt in paymentTermsOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
      <!-- 底部按钮 -->
      <template #footer>
        <button class="btn-cancel" @click="closeCreateModal">取消</button>
        <button class="btn-primary" @click="handleSubmitCreate">确认创建</button>
      </template>
    </AppModal>

    <!-- ==================== Toast 通知 ==================== -->
    <AppToast
      v-if="toastVisible"
      :message="toastMessage"
      type="success"
      @close="closeToast"
    />
  </div>
</template>

<style scoped>
/* ===== 页面基础样式 ===== */
.finance-view {
  padding: 24px;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
  color: var(--ink, #1a1a2e);
}

/* ===== 页面标题区域 ===== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  margin: 0;
}

/* ===== 主操作按钮 ===== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--accent, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

/* ===== 统计卡片网格 ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* ===== 图表区域网格 ===== */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 16px 0;
}

.chart-container {
  width: 100%;
  height: 320px;
}

/* ===== 表格区域 ===== */
.table-section {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 16px 0;
}

/* ===== 金额文本 ===== */
.amount-text {
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  font-variant-numeric: tabular-nums;
}

/* ===== 收款按钮 ===== */
.btn-pay {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 14px;
  background: var(--accent3, #10b981);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-pay:hover {
  background: #059669;
}

/* ===== 已完成操作占位 ===== */
.action-done {
  color: var(--muted, #6b7280);
  font-size: 13px;
}

/* ===== 弹窗表单 ===== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

.form-input {
  padding: 9px 12px;
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink, #1a1a2e);
  background: var(--bg, #f0f2f5);
  transition: border-color 0.2s;
  outline: none;
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* ===== 取消按钮 ===== */
.btn-cancel {
  padding: 9px 20px;
  background: var(--bg, #f0f2f5);
  color: var(--muted, #6b7280);
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

/* ===== 响应式布局 ===== */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
