<script setup>
/**
 * ReportView.vue - 数据报表页面
 * 展示品类销售占比玫瑰图、月度利润趋势图和客户贡献度排名横向柱状图
 * 用于多维度分析企业销售与利润情况
 */
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
  getCategoryOption,
  getProfitOption,
  getCustomerRankOption,
} from '@/data/chartConfig'

// ==================== ECharts 图表 ====================
/** 品类销售占比图表 DOM 引用 */
const chartCategoryRef = ref(null)
/** 月度利润趋势图表 DOM 引用 */
const chartProfitRef = ref(null)
/** 客户贡献度排名图表 DOM 引用 */
const chartCustomerRankRef = ref(null)
/** 品类销售占比图表实例 */
let chartCategoryInstance = null
/** 月度利润趋势图表实例 */
let chartProfitInstance = null
/** 客户贡献度排名图表实例 */
let chartCustomerRankInstance = null

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
  chartCategoryInstance = safeInit(chartCategoryRef.value, getCategoryOption)
  chartProfitInstance = safeInit(chartProfitRef.value, getProfitOption)
  chartCustomerRankInstance = safeInit(chartCustomerRankRef.value, getCustomerRankOption)
}

/** 窗口大小变化时自适应 */
const handleResize = () => {
  chartCategoryInstance?.resize()
  chartProfitInstance?.resize()
  chartCustomerRankInstance?.resize()
}

// ==================== 生命周期 ====================
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例，释放内存
  chartCategoryInstance?.dispose()
  chartProfitInstance?.dispose()
  chartCustomerRankInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="report-view">
    <!-- ==================== 页面标题 ==================== -->
    <div class="page-header">
      <h2 class="page-title">数据报表</h2>
      <p class="page-subtitle">多维度分析销售与利润数据</p>
    </div>

    <!-- ==================== 两列图表区域 ==================== -->
    <div class="charts-grid">
      <!-- 品类销售占比玫瑰图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">品类销售占比</h3>
          <span class="chart-subtitle">南丁格尔玫瑰图展示各品类占比</span>
        </div>
        <div ref="chartCategoryRef" class="chart-container"></div>
      </div>
      <!-- 月度利润趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">月度利润趋势</h3>
          <span class="chart-subtitle">2026 年 1-6 月毛利润与毛利率走势</span>
        </div>
        <div ref="chartProfitRef" class="chart-container"></div>
      </div>
    </div>

    <!-- ==================== 全宽图表：客户贡献度排名 ==================== -->
    <div class="chart-card chart-card--full">
      <div class="chart-header">
        <h3 class="chart-title">客户贡献度排名</h3>
        <span class="chart-subtitle">累计采购金额前 8 客户排名</span>
      </div>
      <div ref="chartCustomerRankRef" class="chart-container chart-container--wide"></div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面基础样式 ===== */
.report-view {
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

/* ===== 两列图表网格 ===== */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* ===== 图表卡片 ===== */
.chart-card {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  padding: 20px;
  transition: box-shadow 0.2s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* 全宽图表卡片 */
.chart-card--full {
  width: 100%;
}

/* ===== 图表头部 ===== */
.chart-header {
  margin-bottom: 16px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 12px;
  color: var(--muted, #6b7280);
}

/* ===== 图表容器 ===== */
.chart-container {
  width: 100%;
  height: 380px;
}

/* 客户排名图表需要更大的高度 */
.chart-container--wide {
  height: 420px;
}

/* ===== 响应式布局 ===== */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
