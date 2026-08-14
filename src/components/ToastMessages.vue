<script setup>
import { useCartStore } from '../stores/store'

const cartStore = useCartStore()

const icons = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  info: 'mdi-information'
}
</script>

<template>
  <div class="toast-wrap">
    <transition-group name="toast">
      <div
        v-for="toast in cartStore.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <span class="mdi" :class="icons[toast.type]"></span>
        <p>{{ toast.message }}</p>
        <button class="toast-close" aria-label="Fechar" @click="cartStore.removeToast(toast.id)">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-wrap {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-success);
  border-radius: var(--radius);
  box-shadow: var(--shadow-xl);
  padding: 14px 16px;
}

.toast > .mdi {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.toast.success > .mdi {
  color: var(--color-success);
}

.toast.error {
  border-left-color: var(--color-danger);
}

.toast.error > .mdi {
  color: var(--color-danger);
}

.toast.info {
  border-left-color: var(--color-primary);
}

.toast.info > .mdi {
  color: var(--color-primary);
}

.toast p {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-ink);
  line-height: 1.4;
}

.toast-close {
  color: var(--color-muted);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.toast-close:hover {
  background: var(--color-surface-2);
  color: var(--color-ink);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
