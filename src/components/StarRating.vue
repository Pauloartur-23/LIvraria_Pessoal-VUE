<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  size: { type: Number, default: 16 }
})

const stars = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const difference = props.value - i
    if (difference >= 0.75) return 'mdi-star'
    if (difference >= 0.25) return 'mdi-star-half-full'
    return 'mdi-star-outline'
  })
})
</script>

<template>
  <span class="stars" :style="{ gap: `${size * 0.15}px` }" aria-label="Avaliação">
    <span
      v-for="(cls, i) in stars"
      :key="i"
      class="mdi"
      :class="cls"
      :style="{ fontSize: `${size}px` }"
    ></span>
  </span>
</template>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
  color: var(--color-accent);
  line-height: 1;
}
</style>
