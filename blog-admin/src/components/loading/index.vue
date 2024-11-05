<script lang="ts" setup>
const props = defineProps({
  /**
   * 图标大小
   * @type {Number || String}
   * @default 24
   */
  size: {
    type: Number || String,
    default: 24
  },
  /**
   * 图标颜色
   * @type {String}
   * @default '#333'
   */
  color: {
    type: String,
    default: '#333'
  }
})
</script>

<template>
  <div>
    <icon-rotation
      class="animation"
      theme="outline"
      :size="props.size"
      :fill="props.color"
    />
  </div>
</template>
<style lang="less">
.animation {
  animation: roll 1.5s linear infinite;
}

@keyframes roll {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
