<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { getCategoryList, iconAll, iconF, optionsF } from '.'
import { useWindow } from '@/pinia'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const visible = computed({
  get: () => {
    return props.visible
  },
  set: () => {
    // console.log(param)
    // count.value = param
  }
})

const windowStore = useWindow()

const emit = defineEmits(['close', 'confirm'])

const icons = ref([] as iconF[])

// 分页处理
const pageOptions = reactive({
  pageNum: 1,
  pageSize: 3,
  total: 0
})

const getIcons = async () => {
  if (!iconLoading) return
  iconLoading.value = true
  const res = await iconAll(categoryVal.value, searchVal.value)
  pageOptions.total = res.length
  let data = res
    .filter((s) => s.options.length > 0)
    .slice(
      (pageOptions.pageNum - 1) * pageOptions.pageSize,
      pageOptions.pageNum * pageOptions.pageSize
    )
  icons.value = icons.value.concat(data)
  iconLoading.value = false
}

const onOpened = () => {
  icons.value = []
  pageOptions.pageNum = 1
  getIcons()
}

const iconLoading = ref(false)

const searchVal = ref('')
const onInput = async (val: any) => {
  pageOptions.pageNum = 1
  icons.value = []
  searchVal.value = val
  getIcons()
}

const highlightText = (val: any) => {
  const regex = new RegExp(searchVal.value, 'gi')
  const highlightedContent = val.replace(
    regex,
    (match: any) => `<span class="text-red-600">${match}</span>`
  )
  return highlightedContent
}

const categoryVal = ref('all')
const categoryList = ref([] as iconF[])
const categoryListFun = () => {
  const arr = [] as iconF[]
  arr.push(
    {
      category: 'all',
      categoryCN: '全部',
      options: []
    },
    ...getCategoryList()
  )
  categoryList.value = arr
}

const onChange = (val: any) => {
  pageOptions.pageNum = 1
  icons.value = []
  categoryVal.value = val
  getIcons()
}

const onClose = () => {
  icons.value = []
  pageOptions.pageNum = 1
  emit('close')
}

const selectName = ref<string>()
// 图标点击
const rowClick = (option: optionsF) => {
  selectName.value = option.name
}

const noMore = ref(false)
// 滚动事件
const load = () => {
  if (pageOptions.pageNum * pageOptions.pageSize < pageOptions.total) {
    noMore.value = false
    pageOptions.pageNum += 1
    getIcons()
  } else {
    noMore.value = true
  }
}

// 取消
const onCancel = () => {
  icons.value = []
  pageOptions.pageNum = 1
  emit('close')
}

// 确认
const onConfirm = () => {
  emit('confirm', selectName.value)
  onCancel()
}

categoryListFun()
</script>
<template>
  <ElDrawer
    v-model="visible"
    title="更多图标"
    direction="rtl"
    @opened="onOpened"
    @close="onClose"
    :size="windowStore.screenWidth < 944 ? '60%' : '30%'"
  >
    <!-- 搜索类型 -->
    <div>
      <ElSelect
        v-model="categoryVal"
        placeholder="请选择图标分类"
        @change="onChange"
      >
        <ElOption
          v-for="item in categoryList"
          :key="item.category"
          :label="item.categoryCN"
          :value="item.category"
        >
        </ElOption>
      </ElSelect>
      <ElInput
        class="mt-[20px]"
        v-model="searchVal"
        placeholder="搜索图标标识\图标名称"
        prefix-icon="Search"
        @input="onInput"
        clearable
      />
    </div>

    <!-- 图标加载显示出的 -->
    <ul
      v-infinite-scroll="load"
      :infinite-scroll-distance="20"
      class="overflow-auto mt-[20px] mx-[-15px] scrollbar"
      :style="
        windowStore.screenWidth >= 600
          ? { height: '600px' }
          : { height: '500px' }
      "
    >
      <li
        id="drawer"
        v-for="item in icons"
        :key="item.category"
        class="mx-[10px]"
      >
        <ElDivider
          v-if="item.options.length > 0"
          :ref="item.category + 'Ref'"
          content-position="left"
        >
          <span>{{ item.categoryCN }}</span>
        </ElDivider>
        <ElRow :gutter="12">
          <ElCol
            :span="windowStore.screenWidth < 600 ? 24 : 12"
            v-for="(option, index) in item.options"
            :key="option.id"
            @click="rowClick(option)"
          >
            <ElTooltip
              placement="top"
              :hide-after="0"
            >
              <template #content>
                <div class="flex flex-col">
                  <span>分类：{{ option.categoryCN }}</span>
                  <span>名称：{{ option.title }}</span>
                  <span>标识：{{ option.name }}</span>
                </div>
              </template>
              <ElCard
                shadow="hover"
                :class="{
                  'mt-[20px]':
                    windowStore.screenWidth >= 600
                      ? index !== 0 && index !== 1
                      : index !== 0,
                  select: option.name === selectName
                }"
                class="relative"
              >
                <!-- 选中的勾 -->
                <div
                  v-if="option.name === selectName"
                  class="absolute right-[6px] top-1"
                >
                  <ElIcon color="#4f8dff">
                    <icon-check />
                  </ElIcon>
                </div>
                <div class="flex items-center">
                  <ElIcon :size="20">
                    <component
                      v-if="option.name"
                      :is="'icon-' + option.name"
                    />
                  </ElIcon>
                  <div
                    class="flex flex-col ml-[12px] mr-[6px]"
                    style="width: -webkit-fill-available"
                  >
                    <span
                      class="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                      :innerHTML="highlightText(option.title)"
                    ></span>
                    <span
                      class="text-xs mt-1 text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis"
                      :innerHTML="highlightText(option.name)"
                    ></span>
                  </div>
                </div>
              </ElCard>
            </ElTooltip>
          </ElCol>
        </ElRow>
      </li>
      <div
        v-if="noMore && icons.length > 0"
        class="flex items-center justify-center mt-2"
      >
        <ElDivider>
          <span style="color: #999">暂无更多数据</span>
        </ElDivider>
      </div>
      <!-- 图标加载状态显示骨架 -->
      <div
        v-if="iconLoading"
        class="mx-[10px]"
      >
        <div>
          <ElDivider content-position="left">
            <ElSkeleton
              style="width: 50px"
              animated
            >
              <template #template>
                <ElSkeletonItem
                  variant="text"
                  class="text-sm"
                  style="width: 100%"
                />
              </template>
            </ElSkeleton>
          </ElDivider>
          <ElRow :gutter="12">
            <ElCol
              :span="windowStore.screenWidth < 600 ? 24 : 12"
              v-for="(item, index) in 3"
              :key="item"
            >
              <ElCard
                :class="{
                  'mt-[20px]':
                    windowStore.screenWidth >= 600
                      ? index !== 0 && index !== 1
                      : index !== 0
                }"
              >
                <div class="flex">
                  <ElSkeleton
                    style="width: 50px"
                    animated
                  >
                    <template #template>
                      <ElSkeletonItem
                        variant="circle"
                        style="width: 30px; height: 30px"
                      />
                    </template>
                  </ElSkeleton>
                  <ElSkeleton animated>
                    <template #template>
                      <div class="flex flex-col">
                        <ElSkeletonItem
                          variant="text"
                          class="text-sm"
                          style="width: 70%"
                        />
                        <ElSkeletonItem
                          variant="text"
                          class="text-xs mt-2"
                          style="width: 100%"
                        />
                      </div>
                    </template>
                  </ElSkeleton>
                </div>
              </ElCard>
            </ElCol>
          </ElRow>
        </div>
      </div>
      <div v-if="!iconLoading && icons.length <= 0">
        <ElEmpty
          id="scrollbarEl"
          :description="searchVal ? '暂无匹配数据' : '暂无数据'"
          :image-size="200"
        />
      </div>
    </ul>

    <!-- 确认与取消 -->
    <div class="mt-[20px]">
      <ElSpace :size="16">
        <ElButton
          size="large"
          type="primary"
          :disabled="!selectName"
          @click="onConfirm"
        >
          确认
        </ElButton>
        <ElButton
          size="large"
          @click="onCancel"
        >
          取消
        </ElButton>
      </ElSpace>
    </div>
  </ElDrawer>
</template>

<style lang="less" scoped>
.el-scrollbar {
  height: 615px !important;
  box-shadow: 0px -10px 10px -9px #aeb8c3 !important;
}

:deep(.el-card__body) {
  padding: 20px 20px 20px 15px !important;
  overflow: visible !important;
}

.select {
  border: 1px solid #4f8dff !important;
}

.scrollbar {
  &::-webkit-scrollbar {
    width: 6px; /* 滚动条的宽度 */
  }
  // &::-webkit-scrollbar-track {
  //   background: #f1f1f1; /* 滚动条轨道的颜色 */
  // }
  &::-webkit-scrollbar-thumb {
    background: var(
      --el-scrollbar-bg-color,
      var(--el-text-color-secondary)
    ); /* 滚动条滑块的颜色 */
    border-radius: 10px; /* 滚动条滑块的圆角 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #666; /* 滚动条滑块在hover时的颜色 */
    cursor: pointer;
  }
}
</style>
