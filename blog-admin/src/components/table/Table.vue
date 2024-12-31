<script lang="ts" setup>
import { useWindow } from '@/pinia'
import { PropType, ref, watch } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 1
  },
  queryShow: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100]
  },
  layout: {
    type: String,
    default: 'prev, pager, next, sizes'
  },
  operateWidth: {
    type: String,
    default: 'auto'
  },
  operateAlign: {
    type: String,
    default: 'center'
  },
  operateLabel: {
    type: String,
    default: '操作'
  },
  operateFixed: {
    type: String || Boolean,
    default: 'right'
  },
  operateShow: {
    type: Boolean,
    default: true
  }
})

const windowStore = useWindow()

//const currentPage = computed({
//  get() {
//    return props.currentPage
//  },
//  set(val) {
//    return val
//  }
//})

watch(
  () => props.pageSize,
  (val) => {
    pageSizeCom.value = val
  }
)

watch(
  () => props.currentPage,
  (val) => {
    currentPageCom.value = val
  }
)

const pageSizeCom = ref(props.pageSize)
const currentPageCom = ref(props.currentPage)

const emit = defineEmits(['paginationChange'])

const onChange = (currentPage: number, pageSize: number) => {
  emit('paginationChange', currentPage, pageSize)
}
</script>
<template>
  <div class="w-full">
    <div
      class="mb-4"
      v-if="props.queryShow"
    >
      <ElRow :gutter="20">
        <ElCol>
          共查询到
          <span class="text-blue-500">{{ props.total }}</span>
          条数据
        </ElCol>
      </ElRow>
    </div>
    <ElTable
      v-bind="$attrs"
      :scrollbar-always-on="windowStore.screenWidth < 1100 ? true : false"
    >
      <slot name="list"></slot>
      <ElTableColumn
        v-if="operateShow"
        :align="operateAlign"
        :label="operateLabel"
        :width="operateWidth"
        :fixed="windowStore.screenWidth < 750 ? false : operateFixed"
      >
        <template #default="{ row }">
          <slot
            name="operate"
            :row="row"
          ></slot>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="mt-[20px]">
      <ElPagination
        background
        :layout="layout"
        :page-sizes="pageSizes"
        :total="props.total"
        @change="onChange"
      />
    </div>
  </div>
</template>
<style lang="less" scoped></style>
