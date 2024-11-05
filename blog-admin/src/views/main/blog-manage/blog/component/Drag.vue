<script lang="ts" setup>
import { blogCategoryF, postBlogCategorySort } from '@/api/blog/blog_category'
import { showLoading } from '@/shared/loading'
import { PropType, ref } from 'vue'

const props = defineProps({
  categoryList: {
    type: Array as PropType<blogCategoryF[]>,
    default: () => []
  }
})

const emit = defineEmits(['updateCategoryList'])

const sourceNode = ref<EventTarget | null>(null)
const onDragstart = (e: DragEvent) => {
  const target = e.target as HTMLElement

  setTimeout(() => {
    target.classList.add('moving')
  }, 10)
  sourceNode.value = e.target
}

const sourceIndex = ref(0)
const targetIndex = ref(0)
const onDragenter = (e: DragEvent) => {
  e.preventDefault()
  if (e.target === sourceNode.value) {
    return
  }
  const target = e.target as HTMLElement
  const parentElement = target.parentElement
  if (parentElement) {
    const children = [...parentElement.children]
    sourceIndex.value = children.indexOf(sourceNode.value as any)
    targetIndex.value = children.indexOf(target)

    if (targetIndex.value > sourceIndex.value) {
      parentElement.insertBefore(
        sourceNode.value as any,
        target.nextElementSibling
      )
    } else {
      parentElement.insertBefore(sourceNode.value as any, target)
    }
  }
}

const onDragend = async (e: DragEvent) => {
  const categoryList = props.categoryList.filter((s) => s.category !== '全部')
  const target = e.target as HTMLElement
  const sort =
    categoryList.findIndex((s) => s.category === target.innerText) + 2
  const category = categoryList[targetIndex.value].category
  target.classList.remove('moving')
  if (category !== target.innerText) {
    const drapCategory = target.innerText
    const drapSort = targetIndex.value + 2
    emit('updateCategoryList', { category, sort, drapCategory, drapSort })
    try {
      showLoading(true, '.el-dialog__body')
      await postBlogCategorySort({
        drapCategory,
        drapSort,
        sort,
        category
      })
      showLoading(false)
      ElMessage.success('修改成功')
    } catch (err) {
      showLoading(false)
      ElMessage.error('修改失败')
    }
  }
}
</script>
<template>
  <ElScrollbar
    ref="scrollbarRef"
    max-height="500px"
    class="px-3 pb-[20px]"
  >
    <div
      draggable="true"
      class="mb-4 p-4 group-list"
      v-for="item in props.categoryList?.filter((s) => s.type !== 'all')"
      :key="item.id"
      @dragstart="onDragstart"
      @dragenter="onDragenter"
      @dragover="(e) => e.preventDefault()"
      @dragend="onDragend"
    >
      {{ item.category }}
    </div>
  </ElScrollbar>
</template>
<style lang="less" scoped>
.group-list {
  border-radius: 16px;
  user-select: none;
  cursor: move;
  background-color: #409eff;
  border: 1px solid var(--el-card-border-color);
  color: #fff;
}

// .group-list:hover {
//   color: #fff;
//   background: #409eff;
// }

.group-list.moving {
  background: transparent;
  color: transparent;
  border: 1px dashed #ccc;
}
</style>
