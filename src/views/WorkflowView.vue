<script setup>
/**
 * WorkflowView.vue - 业务流程页面
 * 展示 3 个核心业务流程图：订单确认、发货确认与库存扣减、客户收款与对账
 * 每个流程使用 ECharts graph 类型图表展示节点与连线关系
 */
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
  getFlow1Option,
  getFlow2Option,
  getFlow3Option,
} from '@/data/chartConfig'

// ==================== 图表 DOM 引用 ====================
const chartFlow1Ref = ref(null)
const chartFlow2Ref = ref(null)
const chartFlow3Ref = ref(null)

// ==================== 图表实例（非响应式） ====================
let chartFlow1Instance = null
let chartFlow2Instance = null
let chartFlow3Instance = null

/** 窗口 resize 回调（具名函数，便于移除） */
function handleResize() {
  chartFlow1Instance?.resize()
  chartFlow2Instance?.resize()
  chartFlow3Instance?.resize()
}

/** 安全初始化单个图表 */
function safeInit(domRef, optionFn) {
  if (domRef && typeof optionFn === 'function') {
    try {
      const chart = echarts.init(domRef)
      chart.setOption(optionFn())
      return chart
    } catch (e) {
      console.error('图表初始化失败:', e)
    }
  }
  return null
}

/** 初始化所有图表 */
function initCharts() {
  chartFlow1Instance = safeInit(chartFlow1Ref.value, getFlow1Option)
  chartFlow2Instance = safeInit(chartFlow2Ref.value, getFlow2Option)
  chartFlow3Instance = safeInit(chartFlow3Ref.value, getFlow3Option)
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 使用 nextTick 确保 DOM 渲染完成后再初始化图表
  setTimeout(() => {
    initCharts()
  }, 100)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartFlow1Instance?.dispose()
  chartFlow2Instance?.dispose()
  chartFlow3Instance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="workflow-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">业务流程</h2>
      <p class="page-subtitle">可视化展示 ERP 系统核心业务流程节点与流转关系</p>
    </div>

    <!-- 流程卡片列表（不再使用 v-for，避免 ref 绑定问题） -->
    <div class="flow-list">
      <!-- 流程1：订单确认流程 -->
      <div class="flow-card">
        <div class="flow-card__header">
          <div class="flow-card__icon" style="background: var(--accent, #4f46e5)">
            <span class="flow-card__icon-text">1</span>
          </div>
          <div class="flow-card__info">
            <h3 class="flow-card__title">订单确认流程</h3>
            <p class="flow-card__subtitle">销售员确认订单后的库存检查与锁定流程</p>
          </div>
        </div>
        <div class="flow-card__chart">
          <div ref="chartFlow1Ref" class="chart-container"></div>
        </div>
      </div>

      <!-- 流程2：发货确认与库存扣减流程 -->
      <div class="flow-card">
        <div class="flow-card__header">
          <div class="flow-card__icon" style="background: var(--accent2, #0ea5e9)">
            <span class="flow-card__icon-text">2</span>
          </div>
          <div class="flow-card__info">
            <h3 class="flow-card__title">发货确认与库存扣减流程</h3>
            <p class="flow-card__subtitle">仓管员确认发货后的库存扣减与成本核算流程</p>
          </div>
        </div>
        <div class="flow-card__chart">
          <div ref="chartFlow2Ref" class="chart-container"></div>
        </div>
      </div>

      <!-- 流程3：客户收款与对账流程 -->
      <div class="flow-card">
        <div class="flow-card__header">
          <div class="flow-card__icon" style="background: var(--accent3, #10b981)">
            <span class="flow-card__icon-text">3</span>
          </div>
          <div class="flow-card__info">
            <h3 class="flow-card__title">客户收款与对账流程</h3>
            <p class="flow-card__subtitle">收到客户货款后的发票核销流程</p>
          </div>
        </div>
        <div class="flow-card__chart">
          <div ref="chartFlow3Ref" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面基础样式 ===== */
.workflow-view {
  padding: 24px;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
  color: var(--ink, #1a1a2e);
}

/* ===== 页面标题区域 ===== */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--muted, #6b7280);
  margin: 0;
}

/* ===== 流程卡片列表 ===== */
.flow-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== 流程卡片 ===== */
.flow-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
  transition: box-shadow 0.2s ease;
}

.flow-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* ===== 流程卡片头部 ===== */
.flow-card__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.flow-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-card__icon-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.flow-card__info {
  flex: 1;
  min-width: 0;
}

.flow-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 2px 0;
}

.flow-card__subtitle {
  font-size: 13px;
  color: var(--muted, #6b7280);
  margin: 0;
}

/* ===== 图表容器 ===== */
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
