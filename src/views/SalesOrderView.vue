<script setup>
/**
 * SalesOrderView.vue - 销售订单页面
 * 包含工作流步骤条、筛选标签栏、订单列表表格
 * 支持新建订单、确认订单、查看订单详情
 */
import { ref, computed, reactive } from 'vue'
import { useSalesStore } from '@/stores/sales'
import AppTable from '@/components/common/AppTable.vue'
import AppModal from '@/components/common/AppModal.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

// ==================== Store ====================
const salesStore = useSalesStore()

// ==================== 工作流步骤 ====================
/** 销售订单工作流的六个步骤 */
const workflowSteps = [
  '创建订单',
  '确认订单',
  '库存锁定',
  '生成发货单',
  '确认发货',
  '开具发票',
]

// ==================== 筛选标签 ====================
/** 筛选标签列表 */
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'confirmed', label: '已确认' },
  { key: 'completed', label: '已完成' },
]

/** 当前选中的筛选标签 */
const activeFilter = ref('all')

// ==================== 表格列配置 ====================
/** 订单列表的列定义 */
const columns = [
  { key: 'orderNo', label: '订单编号', width: '140px' },
  { key: 'customer', label: '客户名称', width: '180px' },
  { key: 'date', label: '订单日期', width: '110px' },
  { key: 'amount', label: '订单金额', width: '120px' },
  { key: 'status', label: '状态', width: '100px' },
  { key: 'action', label: '操作', width: '160px' },
]

// ==================== 状态映射 ====================
/** 订单状态中文映射 */
const statusMap = {
  draft: '草稿',
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
}

/** 状态对应的 StatusBadge 类型 */
const badgeTypeMap = {
  draft: 'draft',
  pending: 'pending',
  confirmed: 'sale',
  completed: 'done',
  cancelled: 'cancel',
}

// ==================== 模拟订单数据 ====================
/**
 * 硬编码订单数据（后续可从 store 获取）
 * 包含各种状态的订单
 */
const mockOrders = ref([
  {
    id: 1001,
    orderNo: 'SO-2026-0601',
    customer: '中联重工集团',
    date: '2026-06-01',
    amount: '¥128,500',
    status: 'draft',
  },
  {
    id: 1002,
    orderNo: 'SO-2026-0602',
    customer: '武汉钢铁配套设备厂',
    date: '2026-06-03',
    amount: '¥86,200',
    status: 'draft',
  },
  {
    id: 1003,
    orderNo: 'SO-2026-0603',
    customer: '广州恒力液压科技',
    date: '2026-06-05',
    amount: '¥215,800',
    status: 'confirmed',
  },
  {
    id: 1004,
    orderNo: 'SO-2026-0604',
    customer: '华东精密机械有限公司',
    date: '2026-06-08',
    amount: '¥52,400',
    status: 'confirmed',
  },
  {
    id: 1005,
    orderNo: 'SO-2026-0605',
    customer: '天津北方阀门集团',
    date: '2026-06-10',
    amount: '¥174,600',
    status: 'completed',
  },
  {
    id: 1006,
    orderNo: 'SO-2026-0606',
    customer: '深圳鑫达电子科技',
    date: '2026-06-12',
    amount: '¥43,200',
    status: 'completed',
  },
  {
    id: 1007,
    orderNo: 'SO-2026-0607',
    customer: '重庆长江机械配件厂',
    date: '2026-06-15',
    amount: '¥96,800',
    status: 'completed',
  },
  {
    id: 1008,
    orderNo: 'SO-2026-0608',
    customer: '上海博瑞自动化',
    date: '2026-06-18',
    amount: '¥168,300',
    status: 'confirmed',
  },
])

// ==================== 筛选后的订单 ====================
/** 根据当前筛选标签过滤订单 */
const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') {
    return mockOrders.value
  }
  return mockOrders.value.filter((order) => order.status === activeFilter.value)
})

// ==================== 确认订单弹窗 ====================
/** 确认订单弹窗是否可见 */
const confirmModalVisible = ref(false)
/** 待确认的订单对象 */
const confirmingOrder = ref(null)

/**
 * 打开确认订单弹窗
 * @param {Object} order - 要确认的订单
 */
function openConfirmModal(order) {
  confirmingOrder.value = order
  confirmModalVisible.value = true
}

/** 确认订单操作 */
function handleConfirm() {
  if (confirmingOrder.value) {
    // 调用 store 的 confirmOrder 方法
    salesStore.confirmOrder(confirmingOrder.value.id)
    // 同步更新本地模拟数据的状态
    const target = mockOrders.value.find(
      (o) => o.id === confirmingOrder.value.id
    )
    if (target) {
      target.status = 'confirmed'
    }
  }
  confirmModalVisible.value = false
  confirmingOrder.value = null
}

/** 关闭确认弹窗 */
function closeConfirmModal() {
  confirmModalVisible.value = false
  confirmingOrder.value = null
}

// ==================== 查看订单详情 ====================
/**
 * 查看订单详情（简易提示，后续可扩展为详情弹窗）
 * @param {Object} order - 要查看的订单
 */
function viewOrder(order) {
  alert(`查看订单详情：${order.orderNo}\n客户：${order.customer}\n金额：${order.amount}`)
}

// ==================== 新建订单弹窗 ====================
/** 新建订单弹窗是否可见 */
const createModalVisible = ref(false)

/** 可选客户列表 */
const customerOptions = [
  '中联重工集团',
  '武汉钢铁配套设备厂',
  '广州恒力液压科技',
  '华东精密机械有限公司',
  '天津北方阀门集团',
  '深圳鑫达电子科技',
  '重庆长江机械配件厂',
  '上海博瑞自动化',
]

/** 可选产品列表（含单价） */
const productOptions = [
  { name: 'PLC控制器 S7-1200', price: 3200 },
  { name: '精密行星减速机 PLE-80', price: 5800 },
  { name: '伺服电机驱动器 1.5kW', price: 4500 },
  { name: '液压缸 HOB-63/35', price: 2800 },
  { name: '深沟球轴承 6205', price: 45 },
  { name: '高强度合金螺栓 M16', price: 12 },
  { name: '碳钢焊接弯头 DN80', price: 85 },
  { name: '304不锈钢六角螺母', price: 8 },
]

/** 新建订单表单数据 */
const newOrder = reactive({
  customer: '',
  date: '',
  lines: [
    { product: '', price: 0, qty: 1, subtotal: 0 },
  ],
})

/** 订单总金额 */
const orderTotal = computed(() => {
  return newOrder.lines.reduce((sum, line) => sum + line.subtotal, 0)
})

/**
 * 更新产品行的小计
 * @param {number} index - 产品行的索引
 */
function updateLineSubtotal(index) {
  const line = newOrder.lines[index]
  // 如果选择了产品，自动填充单价
  const selectedProduct = productOptions.find((p) => p.name === line.product)
  if (selectedProduct) {
    line.price = selectedProduct.price
  }
  line.subtotal = line.price * line.qty
}

/** 添加一行产品 */
function addProductLine() {
  newOrder.lines.push({ product: '', price: 0, qty: 1, subtotal: 0 })
}

/**
 * 删除指定产品行
 * @param {number} index - 要删除的行索引
 */
function removeProductLine(index) {
  if (newOrder.lines.length > 1) {
    newOrder.lines.splice(index, 1)
  }
}

/** 打开新建订单弹窗 */
function openCreateModal() {
  // 重置表单
  newOrder.customer = ''
  newOrder.date = new Date().toISOString().split('T')[0]
  newOrder.lines = [{ product: '', price: 0, qty: 1, subtotal: 0 }]
  createModalVisible.value = true
}

/** 提交新建订单 */
function submitNewOrder() {
  // 基本表单验证
  if (!newOrder.customer) {
    alert('请选择客户')
    return
  }
  if (!newOrder.date) {
    alert('请选择订单日期')
    return
  }
  if (!newOrder.lines[0].product) {
    alert('请至少添加一个产品')
    return
  }

  // 调用 store 添加订单
  salesStore.addOrder({
    customer: newOrder.customer,
    date: newOrder.date,
    amount: `¥${orderTotal.value.toLocaleString()}`,
    lines: [...newOrder.lines],
  })

  // 同时添加到本地模拟列表
  const newId = Date.now()
  mockOrders.value.unshift({
    id: newId,
    orderNo: `SO-${new Date().getFullYear()}-${String(newId).slice(-6)}`,
    customer: newOrder.customer,
    date: newOrder.date,
    amount: `¥${orderTotal.value.toLocaleString()}`,
    status: 'draft',
  })

  createModalVisible.value = false
}

/** 关闭新建订单弹窗 */
function closeCreateModal() {
  createModalVisible.value = false
}

// ==================== 辅助格式化 ====================
/** 格式化金额显示 */
function formatPrice(price) {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div class="sales-order-page">
    <!-- ====== 页面标题区域 ====== -->
    <div class="page-header">
      <h1 class="page-title">销售订单</h1>
      <button class="btn btn--primary" @click="openCreateModal">
        + 新建订单
      </button>
    </div>

    <!-- ====== 工作流步骤条 ====== -->
    <div class="workflow-steps">
      <div
        v-for="(step, index) in workflowSteps"
        :key="index"
        class="step-item"
        :class="{ 'step-item--active': index <= 1 }"
      >
        <!-- 步骤序号圆点 -->
        <div class="step-dot" />
        <!-- 步骤文字 -->
        <span class="step-label">{{ step }}</span>
        <!-- 步骤间连线（最后一个不显示） -->
        <div v-if="index < workflowSteps.length - 1" class="step-line" />
      </div>
    </div>

    <!-- ====== 筛选标签栏 ====== -->
    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        :class="['filter-tab', { 'filter-tab--active': activeFilter === tab.key }]"
        @click="activeFilter = tab.key"
      >
        {{ tab.label }}
        <!-- 当前筛选下的订单数量 -->
        <span v-if="tab.key === 'all'" class="filter-count">
          {{ mockOrders.length }}
        </span>
      </button>
    </div>

    <!-- ====== 订单列表表格 ====== -->
    <AppTable
      :columns="columns"
      :data="filteredOrders"
      empty-text="暂无符合条件的订单"
    >
      <!-- 自定义单元格插槽 -->
      <template #cell="{ column, row }">
        <!-- 状态列：渲染 StatusBadge -->
        <template v-if="column.key === 'status'">
          <StatusBadge :type="badgeTypeMap[row.status] || 'draft'" />
        </template>

        <!-- 操作列：确认/查看按钮 -->
        <template v-else-if="column.key === 'action'">
          <div class="action-btns">
            <!-- 草稿订单显示确认和查看按钮 -->
            <template v-if="row.status === 'draft'">
              <button
                class="btn btn--sm btn--accent"
                @click="openConfirmModal(row)"
              >
                确认
              </button>
              <button class="btn btn--sm btn--outline" @click="viewOrder(row)">
                查看
              </button>
            </template>
            <!-- 其他状态只显示查看按钮 -->
            <template v-else>
              <button class="btn btn--sm btn--outline" @click="viewOrder(row)">
                查看
              </button>
            </template>
          </div>
        </template>

        <!-- 金额列：加粗显示 -->
        <template v-else-if="column.key === 'amount'">
          <span class="amount-text">{{ row[column.key] }}</span>
        </template>

        <!-- 其他列：直接显示 -->
        <template v-else>
          {{ row[column.key] }}
        </template>
      </template>
    </AppTable>

    <!-- ====== 确认订单弹窗 ====== -->
    <AppModal
      :visible="confirmModalVisible"
      title="确认订单"
      width="480px"
      @close="closeConfirmModal"
    >
      <div class="confirm-body">
        <p class="confirm-text">
          确定要确认订单
          <strong>{{ confirmingOrder?.orderNo }}</strong> 吗？
        </p>
        <p class="confirm-sub">
          客户：{{ confirmingOrder?.customer }}<br />
          金额：{{ confirmingOrder?.amount }}
        </p>
        <p class="confirm-warn">确认后订单将进入下一流程阶段。</p>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <button class="btn btn--outline" @click="closeConfirmModal">
          取消
        </button>
        <button class="btn btn--primary" @click="handleConfirm">
          确认订单
        </button>
      </template>
    </AppModal>

    <!-- ====== 新建订单弹窗 ====== -->
    <AppModal
      :visible="createModalVisible"
      title="新建销售订单"
      width="720px"
      @close="closeCreateModal"
    >
      <div class="create-form">
        <!-- 基本信息 -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">客户名称</label>
            <select v-model="newOrder.customer" class="form-select">
              <option value="">请选择客户</option>
              <option
                v-for="name in customerOptions"
                :key="name"
                :value="name"
              >
                {{ name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">订单日期</label>
            <input v-model="newOrder.date" type="date" class="form-input" />
          </div>
        </div>

        <!-- 产品行列表 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">产品明细</span>
            <button class="btn btn--sm btn--link" @click="addProductLine">
              + 添加产品
            </button>
          </div>

          <!-- 产品行表格 -->
          <div class="product-lines">
            <div class="product-line-header">
              <div class="pl-col pl-col--product">产品名称</div>
              <div class="pl-col pl-col--price">单价 (元)</div>
              <div class="pl-col pl-col--qty">数量</div>
              <div class="pl-col pl-col--subtotal">小计 (元)</div>
              <div class="pl-col pl-col--action" />
            </div>

            <div
              v-for="(line, index) in newOrder.lines"
              :key="index"
              class="product-line-row"
            >
              <!-- 产品选择 -->
              <div class="pl-col pl-col--product">
                <select
                  v-model="line.product"
                  class="form-select form-select--sm"
                  @change="updateLineSubtotal(index)"
                >
                  <option value="">请选择产品</option>
                  <option
                    v-for="p in productOptions"
                    :key="p.name"
                    :value="p.name"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <!-- 单价 -->
              <div class="pl-col pl-col--price">
                <input
                  v-model.number="line.price"
                  type="number"
                  class="form-input form-input--sm"
                  min="0"
                  @input="updateLineSubtotal(index)"
                />
              </div>

              <!-- 数量 -->
              <div class="pl-col pl-col--qty">
                <input
                  v-model.number="line.qty"
                  type="number"
                  class="form-input form-input--sm"
                  min="1"
                  @input="updateLineSubtotal(index)"
                />
              </div>

              <!-- 小计 -->
              <div class="pl-col pl-col--subtotal">
                <span class="subtotal-value">
                  ¥{{ formatPrice(line.subtotal) }}
                </span>
              </div>

              <!-- 删除按钮 -->
              <div class="pl-col pl-col--action">
                <button
                  class="btn-delete"
                  :disabled="newOrder.lines.length === 1"
                  @click="removeProductLine(index)"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <!-- 合计 -->
          <div class="order-total-row">
            <span class="total-label">订单总计</span>
            <span class="total-value">¥{{ formatPrice(orderTotal) }}</span>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <button class="btn btn--outline" @click="closeCreateModal">
          取消
        </button>
        <button class="btn btn--primary" @click="submitNewOrder">
          创建订单
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
/* ===== 页面基础样式 ===== */
.sales-order-page {
  padding: 24px;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
  color: var(--ink, #1a1a2e);
  background: var(--bg, #f0f2f5);
  min-height: 100vh;
}

/* ===== 页面标题区域 ===== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  margin: 0;
}

/* ===== 通用按钮 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

/* 主色按钮 */
.btn--primary {
  background: var(--accent, #4f46e5);
  color: #ffffff;
  border-color: var(--accent, #4f46e5);
}

.btn--primary:hover {
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

/* 强调色按钮 */
.btn--accent {
  background: var(--accent, #4f46e5);
  color: #ffffff;
  border-color: var(--accent, #4f46e5);
}

.btn--accent:hover {
  opacity: 0.9;
}

/* 描边按钮 */
.btn--outline {
  background: transparent;
  color: var(--ink, #1a1a2e);
  border-color: var(--rule, #e2e8f0);
}

.btn--outline:hover {
  border-color: var(--accent, #4f46e5);
  color: var(--accent, #4f46e5);
}

/* 小号按钮 */
.btn--sm {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 6px;
}

/* 链接按钮 */
.btn--link {
  background: transparent;
  color: var(--accent, #4f46e5);
  border: none;
  padding: 4px 8px;
  font-size: 13px;
}

.btn--link:hover {
  text-decoration: underline;
}

/* ===== 工作流步骤条 ===== */
.workflow-steps {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 20px 24px;
  background: var(--bg2, #ffffff);
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 步骤序号圆点 */
.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--rule, #e2e8f0);
  color: var(--muted, #6b7280);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* 已激活的步骤圆点 */
.step-item--active .step-dot {
  background: var(--accent, #4f46e5);
  color: #ffffff;
}

/* 步骤文字 */
.step-label {
  font-size: 13px;
  color: var(--muted, #6b7280);
  transition: color 0.3s ease;
}

.step-item--active .step-label {
  color: var(--ink, #1a1a2e);
  font-weight: 500;
}

/* 步骤间连线 */
.step-line {
  width: 40px;
  height: 2px;
  background: var(--rule, #e2e8f0);
  margin: 0 8px;
  flex-shrink: 0;
  border-radius: 1px;
}

/* ===== 筛选标签栏 ===== */
.filter-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 8px;
  background: var(--bg2, #ffffff);
  color: var(--muted, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.filter-tab:hover {
  border-color: var(--accent, #4f46e5);
  color: var(--accent, #4f46e5);
}

/* 选中状态 */
.filter-tab--active {
  background: var(--accent, #4f46e5);
  color: #ffffff;
  border-color: var(--accent, #4f46e5);
}

.filter-tab--active:hover {
  color: #ffffff;
  opacity: 0.9;
}

/* 筛选数量角标 */
.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.filter-tab:not(.filter-tab--active) .filter-count {
  background: var(--rule, #e2e8f0);
  color: var(--muted, #6b7280);
}

/* ===== 金额显示 ===== */
.amount-text {
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

/* ===== 操作按钮组 ===== */
.action-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== 确认弹窗内容 ===== */
.confirm-body {
  text-align: center;
  padding: 8px 0;
}

.confirm-text {
  font-size: 15px;
  color: var(--ink, #1a1a2e);
  margin-bottom: 12px;
}

.confirm-sub {
  font-size: 13px;
  color: var(--muted, #6b7280);
  line-height: 1.6;
  margin-bottom: 12px;
}

.confirm-warn {
  font-size: 12px;
  color: var(--accent4, #f59e0b);
}

/* ===== 新建订单表单 ===== */
.create-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-input,
.form-select {
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 8px;
  background: var(--bg2, #ffffff);
  color: var(--ink, #1a1a2e);
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input--sm,
.form-select--sm {
  padding: 6px 8px;
  font-size: 12px;
}

/* ===== 产品明细区域 ===== */
.form-section {
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 10px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg, #f0f2f5);
  border-bottom: 1px solid var(--rule, #e2e8f0);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

/* ===== 产品行表格 ===== */
.product-lines {
  padding: 0 16px;
}

.product-line-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--rule, #e2e8f0);
  font-size: 12px;
  font-weight: 600;
  color: var(--muted, #6b7280);
}

.product-line-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--rule, #e2e8f0);
}

.product-line-row:last-child {
  border-bottom: none;
}

/* 产品行各列宽度 */
.pl-col {
  display: flex;
  align-items: center;
}

.pl-col--product {
  flex: 3;
  padding-right: 12px;
}

.pl-col--price {
  flex: 1.5;
  padding-right: 12px;
}

.pl-col--qty {
  flex: 1;
  padding-right: 12px;
}

.pl-col--subtotal {
  flex: 1.5;
  padding-right: 12px;
  justify-content: flex-end;
}

.pl-col--action {
  flex: 0 0 32px;
  justify-content: center;
}

/* 小计值 */
.subtotal-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  white-space: nowrap;
}

/* 删除按钮 */
.btn-delete {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted, #6b7280);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-delete:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent5, #ef4444);
}

.btn-delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== 合计行 ===== */
.order-total-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 14px 16px;
  background: var(--bg, #f0f2f5);
  border-top: 1px solid var(--rule, #e2e8f0);
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

.total-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent, #4f46e5);
}
</style>
