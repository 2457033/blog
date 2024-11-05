<script lang="ts" setup>
import { useWindow } from '@/pinia'
import { ref } from 'vue'

const windowStore = useWindow()

const name = ref('全部')
const searchVal = ref('')
const tags = ref(['全部', 'Vue', 'Html', 'Css', 'React', 'Uniapp'])

const emit = defineEmits(['update-blog-tag', 'update-blog-search'])
const tagClick = (tag: string) => {
  name.value = tag
  emit('update-blog-tag', name.value)
}

const handleInputConfirm = () => {
  emit('update-blog-search', searchVal.value)
}
</script>
<template>
  <div
    :class="{
      'h-full w-[20%]': windowStore.screenWidth > 840,
      'mt-4': windowStore.screenWidth <= 840
    }"
  >
    <ElCard
      :class="{
        'h-[300px]': windowStore.screenWidth > 840
      }"
    >
      <ElFormItem
        label="搜索:"
        :style="
          windowStore.screenWidth > 840 && windowStore.screenWidth <= 1100
            ? 'display: flex;flex-direction: column;align-items: baseline;'
            : ''
        "
      >
        <ElInput
          v-model="searchVal"
          placeholder="请输入内容"
          suffix-icon="Search"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
      </ElFormItem>
      <div :class="{ 'flex items-baseline': windowStore.screenWidth <= 840 }">
        <div class="flex justify-between">
          <span class="text-4 font-semibold whitespace-nowrap">标签</span>
          <!-- <ElButton
            type="primary"
            link
          >
            <template #icon>
              <ElIcon><Setting /></ElIcon>
            </template>
            管理标签
          </ElButton> -->
        </div>
        <div
          :class="{
            'flex items-baseline ml-3 flex-wrap':
              windowStore.screenWidth <= 840,
            'ml-3': windowStore.screenWidth <= 425,
            'mt-2': windowStore.screenWidth > 840
          }"
        >
          <ElTag
            v-for="(tag, index) in tags"
            :key="index"
            class="m-1 cursor-pointer"
            :closable="false"
            :type="tag === name ? 'primary' : 'info'"
            @click="tagClick(tag)"
          >
            {{ tag }}
          </ElTag>
        </div>
      </div>
    </ElCard>
  </div>
</template>
<style lang="less"></style>
