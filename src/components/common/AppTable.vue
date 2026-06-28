<script setup>
/**
 * AppTable.vue - 通用数据表格组件
 * 支持列配置、空数据提示和自定义单元格内容
 * 支持响应式横向滚动
 */
defineProps({
  /**
   * 列配置数组
   * 每项格式：{ key: String, label: String, width: String }
   * key    - 对应数据字段名
   * label  - 列头显示文字
   * width  - 列宽度（可选，如 '120px' 或 '20%'）
   */
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  /**
   * 表格数据数组
   */
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  /**
   * 无数据时的提示文字
   */
  emptyText: {
    type: String,
    default: '暂无数据',
  },
})
</script>

<template>
  <div class="table-wrapper">
    <table class="app-table">
      <!-- 表头 -->
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? { width: col.width } : {}"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- 表体 -->
      <tbody>
        <!-- 有数据时渲染行 -->
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? { width: col.width } : {}"
          >
            <!-- 优先使用自定义单元格插槽 -->
            <slot
              v-if="$slots.cell"
              name="cell"
              :column="col"
              :row="row"
              :value="row[col.key]"
            />
            <!-- 无自定义插槽时显示原始值 -->
            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>

        <!-- 无数据时显示空提示 -->
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="empty-cell">
            <div class="empty-wrapper">
              <span class="empty-icon">&#128196;</span>
              <span class="empty-text">{{ emptyText }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* ===== 表格滚动容器（支持响应式横向滚动） ===== */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--rule, #e2e8f0);
  border-radius: 10px;
  background: var(--bg2, #ffffff);
}

/* ===== 表格 ===== */
.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

/* ===== 表头 ===== */
.app-table thead {
  background: var(--bg, #f0f2f5);
}

.app-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: var(--muted, #6b7280);
  white-space: nowrap;
  border-bottom: 1px solid var(--rule, #e2e8f0);
}

/* ===== 表体单元格 ===== */
.app-table td {
  padding: 12px 16px;
  color: var(--ink, #1a1a2e);
  border-bottom: 1px solid var(--rule, #e2e8f0);
  vertical-align: middle;
}

/* 最后一行去除底部边框 */
.app-table tbody tr:last-child td {
  border-bottom: none;
}

/* 行悬停效果 */
.app-table tbody tr:hover {
  background: rgba(79, 70, 229, 0.03);
}

/* ===== 空数据提示 ===== */
.empty-cell {
  text-align: center;
  padding: 48px 16px !important;
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  font-size: 36px;
  opacity: 0.4;
}

.empty-text {
  font-size: 14px;
  color: var(--muted, #6b7280);
}
</style>
