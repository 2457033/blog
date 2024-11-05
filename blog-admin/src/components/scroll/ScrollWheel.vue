<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue'

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const showLeftShadow = ref(false)
const showRightShadow = ref(false)

const onScroll = ({ scrollLeft }: any) => {
  // scrollbarRef.value?.wrapRef?.removeEventListener('wheel', onWheelScroll)
  const scrollWidth = scrollbarRef.value?.wrapRef?.scrollWidth!
  const clientWidth = scrollbarRef.value?.wrapRef?.clientWidth!
  const maxScroll = scrollWidth - clientWidth
  if (scrollLeft > 0) {
    showLeftShadow.value = true
  } else {
    showLeftShadow.value = false
  }
  if (scrollLeft + 10 < maxScroll) {
    showRightShadow.value = true
  } else {
    showRightShadow.value = false
  }
}

/** 横向滚动 */
const moveNumber = ref(0)
const onWheelScroll = (e: WheelEvent) => {
  const scrollWidth = scrollbarRef.value?.wrapRef?.scrollWidth!
  const clientWidth = scrollbarRef.value?.wrapRef?.clientWidth!
  const maxScroll = scrollWidth - clientWidth
  if (moveNumber.value > maxScroll) {
    moveNumber.value = maxScroll
    return
  } else if (moveNumber.value < 0) {
    moveNumber.value = 0
    return
  } else {
    moveNumber.value = moveNumber.value + e.deltaY
  }
  scrollbarRef.value?.setScrollLeft(moveNumber.value)
}

/** 方法暴露出去 */
const getChildrenList = () => {
  const children: Partial<HTMLElement>[] = [
    ...scrollbarRef.value!.wrapRef?.children[0].children[0].children!
  ]
  return children
}

const getClientWidth = () => {
  const clientWidth = scrollbarRef.value?.wrapRef?.clientWidth!
  return clientWidth
}

const setScrollLeft = (value: number) => {
  scrollbarRef.value?.setScrollLeft(value)
}

defineExpose({
  getChildrenList,
  setScrollLeft,
  getClientWidth
})

onMounted(() => {
  scrollbarRef.value?.wrapRef?.addEventListener('wheel', onWheelScroll)
  window.addEventListener('resize', () => {
    scrollbarRef.value?.setScrollLeft(0)
  })
  onScroll({ scrollLeft: 0 })
})

onBeforeMount(() => {
  scrollbarRef.value?.wrapRef?.removeEventListener('wheel', onWheelScroll)
  window.removeEventListener('resize', () => {
    scrollbarRef.value?.setScrollLeft(0)
  })
})
</script>
<template>
  <ElScrollbar
    ref="scrollbarRef"
    class="py-[10px] tag-scroll"
    :class="{
      'shadow-left': showLeftShadow,
      'shadow-right': showRightShadow
    }"
    @scroll="onScroll"
    @wheel="onWheelScroll"
  >
    <slot></slot>
  </ElScrollbar>
</template>
<style lang="less">
.tag-scroll {
  .el-scrollbar__wrap {
    display: flex;
    align-items: center;
    // scroll-behavior: smooth;
  }
  &.shadow-left::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 20px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent);
    pointer-events: none;
  }
  // &.shadow-left {
  //   box-shadow: inset 10px 0 10px -10px rgba(0, 0, 0, 0.2);
  // }

  /* 右侧阴影 */
  &.shadow-right::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 20px;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.2), transparent);
    pointer-events: none;
  }
  // &.shadow-right {
  //   box-shadow: inset -12px 0px 8px -10px rgba(0, 0, 0, 0.2);
  // }
}
</style>
