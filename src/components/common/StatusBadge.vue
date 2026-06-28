<script setup>
/**
 * StatusBadge.vue - 状态标签组件
 * 根据传入的 type 渲染不同颜色的圆角标签
 * 用于展示订单、付款、库存等各类状态
 */
import { computed } from 'vue'

const props = defineProps({
  /**
   * 状态类型
   * draft   - 草稿 (灰色)
   * sale    - 在售 (蓝色)
   * done    - 已完成 (绿色)
   * cancel  - 已取消 (红色)
   * paid    - 已付款 (绿色)
   * partial - 部分付款 (橙色)
   * pending - 待处理 (黄色)
   */
  type: {
    type: String,
    required: true,
    default: 'draft',
  },
})

// 状态类型与文字映射
const typeLabels = {
  draft: '草稿',
  sale: '在售',
  done: '已完成',
  cancel: '已取消',
  paid: '已付款',
  partial: '部分付款',
  pending: '待处理',
}

// 状态类型与样式类映射
const typeClass = computed(() => {
  const map = {
    draft: 'badge--draft',
    sale: 'badge--sale',
    done: 'badge--done',
    cancel: 'badge--cancel',
    paid: 'badge--paid',
    partial: 'badge--partial',
    pending: 'badge--pending',
  }
  return map[props.type] || 'badge--draft'
})

// 显示文字
const label = computed(() => typeLabels[props.type] || props.type)
</script>

<template>
  <span :class="['status-badge', typeClass]">
    {{ label }}
  </span>
</template>

<style scoped>
/* ===== 状态标签基础样式 ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
}

/* 草稿 - 灰色 */
.badge--draft {
  background: #f1f5f9;
  color: #64748b;
}

/* 在售 - 蓝色 */
.badge--sale {
  background: #eff6ff;
  color: #3b82f6;
}

/* 已完成 / 已付款 - 绿色 */
.badge--done,
.badge--paid {
  background: #f0fdf4;
  color: #22c55e;
}

/* 已取消 - 红色 */
.badge--cancel {
  background: #fef2f2;
  color: #ef4444;
}

/* 部分付款 - 橙色 */
.badge--partial {
  background: #fff7ed;
  color: #f97316;
}

/* 待处理 - 黄色 */
.badge--pending {
  background: #fefce8;
  color: #eab308;
}
</style>
