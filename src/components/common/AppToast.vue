<script setup>
/**
 * AppToast.vue - 全局 Toast 通知组件
 * 使用 Teleport 挂载到 body，支持成功/错误两种类型
 * 3 秒后自动消失，带滑入/滑出动画
 */
import { ref, onMounted } from 'vue'

const props = defineProps({
  /** 通知消息文本 */
  message: {
    type: String,
    default: '',
  },
  /** 通知类型：success（成功）/ error（错误） */
  type: {
    type: String,
    default: 'success',
    validator: (val) => ['success', 'error'].includes(val),
  },
})

const emit = defineEmits(['close'])

// 控制显示/隐藏状态
const show = ref(false)

onMounted(() => {
  // 下一帧触发入场动画
  requestAnimationFrame(() => {
    show.value = true
  })

  // 3 秒后自动消失
  setTimeout(() => {
    show.value = false
    // 等待退场动画结束后再触发关闭
    setTimeout(() => {
      emit('close')
    }, 300)
  }, 3000)
})

// 手动关闭
const handleClose = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div v-if="show" :class="['app-toast', `toast--${type}`]">
        <!-- 图标 -->
        <span class="toast-icon">
          <template v-if="type === 'success'">&#10003;</template>
          <template v-else>&#10007;</template>
        </span>
        <!-- 消息内容 -->
        <span class="toast-message">{{ message }}</span>
        <!-- 关闭按钮 -->
        <button class="toast-close" @click="handleClose">&times;</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===== Toast 容器 ===== */
.app-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 280px;
  max-width: 420px;
  font-size: 14px;
}

/* 成功样式 */
.toast--success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

/* 错误样式 */
.toast--error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* 图标 */
.toast-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.toast--success .toast-icon {
  background: #22c55e;
  color: #fff;
}

.toast--error .toast-icon {
  background: #ef4444;
  color: #fff;
}

/* 消息内容 */
.toast-message {
  flex: 1;
  line-height: 1.4;
}

/* 关闭按钮 */
.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: inherit;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 0 2px;
}

.toast-close:hover {
  opacity: 1;
}

/* ===== 滑入/滑出动画 ===== */
.toast-slide-enter-active {
  transition: all 0.3s ease-out;
}

.toast-slide-leave-active {
  transition: all 0.3s ease-in;
}

.toast-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
