<script setup lang="ts">
import { blogCategoryF } from '@/api/blog/blog_category'
import { useEvent } from '@/hook/useEvent'
import { onMounted, PropType, ref } from 'vue'

const props = defineProps({
  categoryList: {
    type: Array as PropType<blogCategoryF[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const type = ref('全部')

const scrollWheelRef = ref()

const onClick = (item: blogCategoryF) => {
  type.value = item.category
  const list = scrollWheelRef.value.getChildrenList() as HTMLElement[]
  const clientWidth = scrollWheelRef.value.getClientWidth()
  const { offsetLeft } = list.find(
    (s) => s.innerText?.split(' ')[0] === item.category
  ) as HTMLElement
  if (offsetLeft > clientWidth / 2) {
    scrollWheelRef.value?.setScrollLeft(offsetLeft)
  } else {
    scrollWheelRef.value?.setScrollLeft(offsetLeft - 150)
  }
  useEvent.emit('update-category', item.category)
}

onMounted(() => {})
</script>
<template>
  <ElSkeleton
    v-if="props.loading"
    animated
    :count="1"
    class="p-[10px]"
  >
    <template #template>
      <div class="flex justify-between">
        <ElSkeletonItem
          variant="h1"
          v-for="_item in 8"
          style="width: 10%"
        />
      </div>
    </template>
  </ElSkeleton>
  <ScrollWheel
    v-else
    ref="scrollWheelRef"
  >
    <ElSpace class="pl-[10px]">
      <ElTag
        v-for="item in props.categoryList"
        :key="item.id"
        round
        size="large"
        :type="type === item.category ? 'primary' : 'info'"
        @click="onClick(item)"
      >
        {{ item.category }} {{ item.count }}
      </ElTag>
    </ElSpace>
  </ScrollWheel>
</template>
<style lang="less" scoped></style>
