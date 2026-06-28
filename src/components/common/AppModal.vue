<script setup>
/**
 * AppModal.vue - 模态对话框组件
 * 提供遮罩层关闭、自定义宽度和底部插槽等功能
 */
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** 是否显示模态框 */
  visible: {
    type: Boolean,
    default: false,
  },
  /** 模态框标题 */
  title: {
    type: String,
    default: '',
  },
  /** 模态框宽度，支持 CSS 合法单位 */
  width: {
    type: String,
    default: '640px',
  },
})

const emit = defineEmits(['close'])

// 点击遮罩层关闭
const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

// 按 ESC 键关闭
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.visible) {
    emit('close')
  }
}

// 打开/关闭时锁定/解锁页面滚动
watch(
  () => props.visible,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :style="{ width }">
          <!-- 头部 -->
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="emit('close')">
              <span class="close-icon">&times;</span>
            </button>
          </div>

          <!-- 内容区域（默认插槽） -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- 底部按钮区域（具名插槽） -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===== 遮罩层 ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

/* ===== 模态框容器 ===== */
.modal-container {
  background: var(--bg2, #ffffff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== 头部 ===== */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--rule, #e2e8f0);
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink, #1a1a2e);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted, #6b7280);
  transition: background 0.2s;
}

.modal-close:hover {
  background: var(--bg, #f0f2f5);
}

.close-icon {
  font-size: 22px;
  line-height: 1;
}

/* ===== 内容区域 ===== */
.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* ===== 底部 ===== */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--rule, #e2e8f0);
  flex-shrink: 0;
}

/* ===== 过渡动画 ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>
