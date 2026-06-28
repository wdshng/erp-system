<script setup>
/**
 * InventoryView.vue - 库存管理页面
 * 展示库存 KPI 指标、仓库库存分布图、库存周转率折线图以及产品库存清单表格
 * 支持低库存产品红色预警标识
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getStockDistOption, getTurnoverOption } from '@/data/chartConfig'
import { inventoryItems } from '@/data/mockData'
import { useInventoryStore } from '@/stores/inventory'
import StatCard from '@/components/common/StatCard.vue'
import AppTable from '@/components/common/AppTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

// ==================== 库存 Store ====================
const inventoryStore = useInventoryStore()

// ==================== KPI 卡片数据 ====================
/** 顶部三个库存关键指标 */
const stats = [
  {
    label: '总库存数量',
    value: '2,847',
    icon: '\u25A0',
    iconBg: 'rgba(79, 70, 229, 0.1)',
    iconColor: 'var(--accent, #4f46e5)',
  },
  {
    label: '在库产品种类',
    value: '128',
    icon: '\u25A0',
    iconBg: 'rgba(14, 165, 233, 0.1)',
    iconColor: 'var(--accent2, #0ea5e9)',
  },
  {
    label: '低库存预警',
    value: '7',
    icon: '\u25A0',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: 'var(--accent5, #ef4444)',
  },
]

// ==================== 表格列配置 ====================
/** 产品库存清单表格列定义 */
const tableColumns = [
  { key: 'id', label: '产品编号', width: '110px' },
  { key: 'name', label: '名称', width: '220px' },
  { key: 'category', label: '分类', width: '90px' },
  { key: 'sku', label: 'SKU', width: '170px' },
  { key: 'stock', label: '库存数量', width: '200px' },
  { key: 'virtual', label: '虚拟库存', width: '100px' },
  { key: 'safety', label: '安全库存', width: '100px' },
  { key: 'price', label: '单价', width: '100px' },
  { key: 'status', label: '状态', width: '100px' },
]

// ==================== 表格数据 ====================
/** 产品库存列表数据 */
const tableData = inventoryItems

// ==================== 图表 DOM 引用 ====================
/** 仓库库存分布图容器 */
const stockDistRef = ref(null)
/** 库存周转率折线图容器 */
const turnoverRef = ref(null)

// ==================== 图表实例 ====================
/** 保存图表实例，用于销毁和自适应 */
const chartInstances = []

// ==================== 格式化金额 ====================
/** 将数值格式化为人民币金额字符串 */
const formatPrice = (val) => {
  return '¥' + Number(val).toFixed(1)
}

// ==================== 计算库存进度条宽度 ====================
/** 根据库存量计算进度条宽度百分比（最大库存量 20000 为基准） */
const getStockPercent = (stock) => {
  return Math.min((stock / 20000) * 100, 100)
}

// ==================== 判断库存状态类型 ====================
/** 根据产品状态返回 StatusBadge 对应的 type */
const getStatusType = (status) => {
  return status === 'warning' ? 'cancel' : 'done'
}

// ==================== 判断进度条颜色 ====================
/** 低库存产品进度条使用红色，正常使用主题色 */
const getBarColor = (status) => {
  return status === 'warning'
    ? 'var(--accent5, #ef4444)'
    : 'var(--accent, #4f46e5)'
}

// ==================== 生命周期：初始化图表 ====================
onMounted(() => {
  // 安全初始化图表（try-catch 防止崩溃）
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
  const c1 = safeInit(stockDistRef.value, getStockDistOption)
  if (c1) chartInstances.push(c1)
  const c2 = safeInit(turnoverRef.value, getTurnoverOption)
  if (c2) chartInstances.push(c2)

  // 监听窗口大小变化，自适应图表
  window.addEventListener('resize', handleResize)
})

// ==================== 生命周期：销毁图表 ====================
onBeforeUnmount(() => {
  // 销毁所有图表实例
  chartInstances.forEach((chart) => chart.dispose())
  chartInstances.length = 0
  // 移除窗口大小监听
  window.removeEventListener('resize', handleResize)
})

// ==================== 窗口自适应处理 ====================
/** 窗口大小变化时重新调整图表尺寸 */
const handleResize = () => {
  chartInstances.forEach((chart) => chart.resize())
}
</script>

<template>
  <div class="inventory-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">库存管理</h2>
      <p class="page-desc">实时监控产品库存水平，管理库存预警</p>
    </div>

    <!-- 顶部 KPI 卡片区域 -->
    <div class="stats-row">
      <div
        v-for="(item, index) in stats"
        :key="index"
        class="stats-item"
      >
        <StatCard
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
          :iconBg="item.iconBg"
          :iconColor="item.iconColor"
        />
      </div>
    </div>

    <!-- 中间图表区域：两列布局 -->
    <div class="charts-row">
      <!-- 仓库库存分布图 -->
      <div class="chart-card">
        <h3 class="chart-title">仓库库存分布</h3>
        <div ref="stockDistRef" class="chart-container"></div>
      </div>

      <!-- 库存周转率折线图 -->
      <div class="chart-card">
        <h3 class="chart-title">库存周转率趋势</h3>
        <div ref="turnoverRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 底部产品库存清单表格 -->
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">产品库存清单</h3>
        <span class="table-count">共 {{ tableData.length }} 条记录</span>
      </div>
      <AppTable :columns="tableColumns" :data="tableData">
        <!-- 自定义单元格内容 -->
        <template #cell="{ column, row }">
          <!-- 库存数量列：显示数值 + 进度条 -->
          <template v-if="column.key === 'stock'">
            <div class="stock-cell">
              <span class="stock-value">{{ row.stock.toLocaleString() }}</span>
              <div class="stock-bar-wrap">
                <div
                  class="stock-bar"
                  :style="{
                    width: getStockPercent(row.stock) + '%',
                    background: getBarColor(row.status),
                  }"
                ></div>
              </div>
            </div>
          </template>

          <!-- 虚拟库存列：显示数值 -->
          <template v-else-if="column.key === 'virtual'">
            {{ row.virtual.toLocaleString() }}
          </template>

          <!-- 安全库存列：显示数值 -->
          <template v-else-if="column.key === 'safety'">
            {{ row.safety.toLocaleString() }}
          </template>

          <!-- 单价列：格式化为人民币金额 -->
          <template v-else-if="column.key === 'price'">
            {{ formatPrice(row.price) }}
          </template>

          <!-- 状态列：使用 StatusBadge 显示 -->
          <template v-else-if="column.key === 'status'">
            <StatusBadge :type="getStatusType(row.status)">
              {{ row.status === 'warning' ? '低库存' : '正常' }}
            </StatusBadge>
          </template>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面容器 ===== */
.inventory-view {
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

/* ===== KPI 卡片行 ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stats-item {
  min-width: 0;
}

/* ===== 图表区域 - 两列布局 ===== */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

/* ===== 图表卡片 ===== */
.chart-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 16px;
}

/* ===== 图表容器 ===== */
.chart-container {
  width: 100%;
  height: 320px;
}

/* ===== 表格卡片 ===== */
.table-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0;
}

.table-count {
  font-size: 13px;
  color: var(--muted, #6b7280);
}

/* ===== 库存单元格 ===== */
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

/* ===== 库存进度条 ===== */
.stock-bar-wrap {
  width: 100%;
  height: 6px;
  background: var(--bg, #f0f2f5);
  border-radius: 3px;
  overflow: hidden;
}

.stock-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* ===== 响应式适配 ===== */
@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
