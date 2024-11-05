<script lang="ts" setup>
import {
  blogCategoryF,
  getBlogCategoryDel,
  postBlogCategoryEdit
} from '@/api/blog/blog_category'
import { PropType, ref, watch } from 'vue'

const props = defineProps({
  categoryList: {
    type: Array as PropType<blogCategoryF[]>,
    default: () => []
  },
  screenWidth: {
    type: Number,
    default: 0
  }
})

watch(
  () => props.categoryList,
  (newVal) => {
    if (newVal) {
      categoryList.value = JSON.parse(
        JSON.stringify(newVal.filter((s) => s.type !== 'all'))
      )
    }
  },
  { deep: true }
)

const categoryList = ref(
  JSON.parse(JSON.stringify(props.categoryList.filter((s) => s.type !== 'all')))
)

const emit = defineEmits(['update', 'update-drag'])

// 编辑
const onEdit = (item: blogCategoryF) => {
  item.isEdit = true
  item.value = item.category
}

// 取消
const onCancel = (item: blogCategoryF) => {
  item.isEdit = false
  item.value = item.category
  item.error = undefined
}

// 确认
const onConfirm = async (item: blogCategoryF) => {
  if (item.value === item.category) {
    item.error = '与该分类重名'
    return
  }
  const responese = categoryList.value.find(
    (s: { category: string | undefined }) => s.category === item.value
  )
  if (responese) {
    item.error = '已有该分类'
    return
  }
  try {
    item.loading = true
    await postBlogCategoryEdit({
      id: item.id,
      category: item.value
    })
    ElMessage.success('修改成功')
    item.category = item.value!
    item.error = undefined
    item.isEdit = false
    item.loading = false
    emit('update-drag', [...categoryList.value])
  } catch (err) {
    item.loading = false
  }
}

/** 删除 */
const onDelete = async (item: blogCategoryF) => {
  try {
    item.delLoading = true
    await getBlogCategoryDel(item.id)
    item.delLoading = false
    ElMessage.success('删除成功')
    categoryList.value.splice(categoryList.value.indexOf(item), 1)
    emit('update-drag', [...categoryList.value])
    if (props.categoryList.length <= 1) {
      emit('update')
    }
  } catch (err) {
    item.delLoading = false
  }
}
</script>
<template>
  <ElScrollbar max-height="500px">
    <ElCard
      class="p-4 mb-4"
      v-for="item in categoryList"
      :key="item.id"
    >
      <div class="flex justify-between items-baseline flex-wrap">
        <span v-if="!item.isEdit">{{ item.category }}</span>
        <ElFormItem
          label="标签："
          required
          v-else
          :error="item.error"
        >
          <ElInput
            :style="{
              width: props.screenWidth > 425 ? 400 + 'px' : 250 + 'px'
            }"
            v-model="item.value"
          ></ElInput>
        </ElFormItem>
        <ElSpace v-if="!item.isEdit">
          <ElButton
            link
            type="primary"
            @click="onEdit(item)"
          >
            编辑
          </ElButton>
          <ElButton
            :loading="item.delLoading"
            link
            type="danger"
            @click="onDelete(item)"
          >
            删除
          </ElButton>
        </ElSpace>
        <ElSpace v-else>
          <ElButton
            link
            type="primary"
            @click="onConfirm(item)"
            :loading="item.loading"
          >
            确认
          </ElButton>
          <ElButton
            link
            @click="onCancel(item)"
          >
            取消
          </ElButton>
        </ElSpace>
      </div>
    </ElCard>
  </ElScrollbar>
</template>
<style lang="less" scoped></style>
