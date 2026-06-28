<script setup>
/**
 * DashboardView.vue - 仪表盘页面
 * 展示 ERP 系统的核心业务指标、图表和最近活动时间线
 * 包含统计卡片、销售趋势图、订单状态饼图、产品排行和活动记录
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import {
  getSalesTrendOption,
  getOrderStatusOption,
  getTopProductsOption,
} from '@/data/chartConfig'
import StatCard from '@/components/common/StatCard.vue'

// ==================== 统计卡片数据 ====================
/** 顶部四个关键指标 */
const stats = [
  {
    label: '本月销售额',
    value: '¥1,284,560',
    change: '+12.5%',
    changeType: 'up',
    icon: '¥',
    iconBg: 'rgba(79, 70, 229, 0.1)',
    iconColor: 'var(--accent, #4f46e5)',
  },
  {
    label: '订单总数',
    value: '156',
    change: '+8.3%',
    changeType: 'up',
    icon: '#',
    iconBg: 'rgba(14, 165, 233, 0.1)',
    iconColor: 'var(--accent2, #0ea5e9)',
  },
  {
    label: '库存预警',
    value: '7',
    change: '+2',
    changeType: 'up',
    icon: '!',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: 'var(--accent4, #f59e0b)',
  },
  {
    label: '应收账款',
    value: '¥386,200',
    change: '-3.2%',
    changeType: 'down',
    icon: '$',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: 'var(--accent5, #ef4444)',
  },
]

// ==================== 图表 DOM 引用 ====================
/** 月度销售趋势图表 */
const salesTrendRef = ref(null)
/** 订单状态饼图 */
const orderStatusRef = ref(null)
/** 产品销售排行横向柱状图 */
const topProductsRef = ref(null)

// ==================== 图表实例数组 ====================
/** 保存所有图表实例，用于 resize 和销毁 */
const chartInstances = []

// ==================== 最近活动数据（硬编码） ====================
const recentActivities = [
  {
    id: 1,
    title: '新订单 SO-20260628-001 已创建',
    description: '客户：中联重工集团，金额：¥128,500',
    time: '10 分钟前',
    color: 'var(--accent, #4f46e5)',
  },
  {
    id: 2,
    title: '订单 SO-20260627-005 已发货',
    description: '物流单号：SF1234567890，承运商：顺丰速运',
    time: '2 小时前',
    color: 'var(--accent3, #10b981)',
  },
  {
    id: 3,
    title: '库存预警：深沟球轴承 6205 低于安全库存',
    description: '当前库存：180 件，安全库存：200 件',
    time: '3 小时前',
    color: 'var(--accent4, #f59e0b)',
  },
  {
    id: 4,
    title: '收款确认：¥45,750 已到账',
    description: '客户：武汉钢铁配套设备厂，发票号：INV-2026-0089',
    time: '5 小时前',
    color: 'var(--accent2, #0ea5e9)',
  },
  {
    id: 5,
    title: '产品 PLC控制器 S7-1200 价格更新',
    description: '新价格：¥3,200/台，调价幅度：-5%',
    time: '昨天 16:30',
    color: 'var(--accent5, #ef4444)',
  },
]

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化三个 ECharts 图表
  initCharts()
  // 监听窗口大小变化，自适应图表
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 移除 resize 监听
  window.removeEventListener('resize', handleResize)
  // 销毁所有图表实例，释放内存
  chartInstances.forEach((chart) => chart.dispose())
  chartInstances.length = 0
})

/**
 * 初始化所有 ECharts 图表
 * 使用 SVG 渲染器，保证高清显示
 */
function safeInit(domRef, optionFn) {
  if (!domRef || typeof optionFn !== 'function') return null
  try {
    const chart = echarts.init(domRef, null, { renderer: 'svg' })
    chart.setOption(optionFn())
    return chart
  } catch (e) {
    console.error('图表初始化失败:', e)
    return null
  }
}

function initCharts() {
  const c1 = safeInit(salesTrendRef.value, getSalesTrendOption)
  if (c1) chartInstances.push(c1)
  const c2 = safeInit(orderStatusRef.value, getOrderStatusOption)
  if (c2) chartInstances.push(c2)
  const c3 = safeInit(topProductsRef.value, getTopProductsOption)
  if (c3) chartInstances.push(c3)
}

/**
 * 窗口 resize 事件处理
 * 所有图表实例同步调整尺寸
 */
function handleResize() {
  chartInstances.forEach((chart) => chart.resize())
}
</script>

<template>
  <div class="dashboard-page">
    <!-- ====== 页面标题 ====== -->
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <p class="page-desc">欢迎回来，以下是您的业务概览</p>
    </div>

    <!-- ====== 顶部统计卡片 ====== -->
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

    <!-- ====== 中间图表区：销售趋势 + 订单状态 ====== -->
    <div class="charts-row">
      <!-- 月度销售趋势图 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">月度销售趋势</h3>
        </div>
        <div ref="salesTrendRef" class="chart-box chart-sales-trend" />
      </div>

      <!-- 订单状态饼图 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">订单状态分布</h3>
        </div>
        <div ref="orderStatusRef" class="chart-box chart-order-status" />
      </div>
    </div>

    <!-- ====== 下方区域：产品排行 + 最近活动 ====== -->
    <div class="charts-row">
      <!-- 产品销售排行 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">产品销售排行</h3>
        </div>
        <div ref="topProductsRef" class="chart-box chart-top-products" />
      </div>

      <!-- 最近活动时间线 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3 class="chart-card__title">最近活动</h3>
        </div>
        <div class="timeline-wrapper">
          <div class="timeline">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="timeline-item"
            >
              <!-- 时间线圆点 -->
              <div class="timeline-dot" :style="{ background: activity.color }" />
              <!-- 时间线内容 -->
              <div class="timeline-content">
                <div class="timeline-title">{{ activity.title }}</div>
                <div class="timeline-desc">{{ activity.description }}</div>
                <div class="timeline-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面基础样式 ===== */
.dashboard-page {
  padding: 24px;
  font-family: 'InstrumentSans', 'Microsoft YaHei', sans-serif;
  color: var(--ink, #1a1a2e);
  background: var(--bg, #f0f2f5);
  min-height: 100vh;
}

/* ===== 页面标题区域 ===== */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  margin: 0 0 4px 0;
}

.page-desc {
  font-size: 14px;
  color: var(--muted, #6b7280);
  margin: 0;
}

/* ===== 统计卡片网格 ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== 图表行（两列布局） ===== */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

/* ===== 图表卡片 ===== */
.chart-card {
  background: var(--bg2, #ffffff);
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 12px;
  overflow: hidden;
}

.chart-card__header {
  padding: 16px 20px 0;
}

.chart-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 12px 0;
}

/* ===== 图表容器 ===== */
.chart-box {
  width: 100%;
  height: 320px;
  padding: 0 8px 8px;
  box-sizing: border-box;
}

/* ===== 最近活动时间线 ===== */
.timeline-wrapper {
  padding: 0 20px 20px;
  overflow-y: auto;
  max-height: 320px;
}

.timeline {
  position: relative;
  padding-left: 24px;
}

/* 时间线左侧竖线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--rule, #e2e8f0);
  border-radius: 1px;
}

/* 单条时间线记录 */
.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* 时间线圆点 */
.timeline-dot {
  position: absolute;
  left: -20px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--bg2, #ffffff);
  box-shadow: 0 0 0 2px var(--rule, #e2e8f0);
}

/* 时间线内容 */
.timeline-content {
  flex: 1;
}

.timeline-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin-bottom: 4px;
  line-height: 1.4;
}

.timeline-desc {
  font-size: 12px;
  color: var(--muted, #6b7280);
  margin-bottom: 2px;
  line-height: 1.4;
}

.timeline-time {
  font-size: 11px;
  color: var(--muted, #6b7280);
  opacity: 0.7;
}
</style>
