<script setup>
/**
 * StatCard.vue - 统计卡片组件
 * 用于仪表盘展示关键业务指标
 * 包含图标、数值、标签和变化趋势
 */
defineProps({
  /** 指标标签（如"总销售额"） */
  label: {
    type: String,
    required: true,
  },
  /** 指标数值（如"¥128,560"） */
  value: {
    type: String,
    required: true,
  },
  /** 变化幅度（如"+12.5%"） */
  change: {
    type: String,
    default: '',
  },
  /** 变化方向：up（上升）/ down（下降） */
  changeType: {
    type: String,
    default: 'up',
    validator: (val) => ['up', 'down'].includes(val),
  },
  /** 图标文字（支持 Unicode 字符） */
  icon: {
    type: String,
    default: '',
  },
  /** 图标背景颜色 */
  iconBg: {
    type: String,
    default: '#eff6ff',
  },
  /** 图标文字颜色 */
  iconColor: {
    type: String,
    default: '#3b82f6',
  },
})
</script>

<template>
  <div class="stat-card">
    <!-- 左侧图标区域 -->
    <div
      class="stat-icon"
      :style="{
        background: iconBg,
        color: iconColor,
      }"
    >
      <span class="icon-text" v-html="icon"></span>
    </div>

    <!-- 右侧内容区域 -->
    <div class="stat-content">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
      <!-- 变化趋势 -->
      <div v-if="change" :class="['stat-change', `stat-change--${changeType}`]">
        <span class="change-arrow">
          <template v-if="changeType === 'up'">&#9650;</template>
          <template v-else>&#9660;</template>
        </span>
        <span class="change-text">{{ change }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 统计卡片容器 ===== */
.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--rule, #e2e8f0);
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* ===== 图标 ===== */
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-text {
  font-size: 22px;
  line-height: 1;
}

/* ===== 内容区域 ===== */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  color: var(--muted, #6b7280);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink, #1a1a2e);
  line-height: 1.3;
}

/* ===== 变化趋势 ===== */
.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
}

/* 上升趋势 - 绿色 */
.stat-change--up {
  color: var(--accent3, #10b981);
}

/* 下降趋势 - 红色 */
.stat-change--down {
  color: var(--accent5, #ef4444);
}

.change-arrow {
  font-size: 10px;
  line-height: 1;
}
</style>
