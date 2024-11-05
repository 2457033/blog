<script setup lang="ts">
import {
  blogCategoryF,
  getBlogCategory,
  postBlogCategoryAdd
} from '@/api/blog/blog_category'
import { useWindow } from '@/pinia'
import { makeNumberProp } from '@/shared/props'
import { reactive, ref, watch } from 'vue'
import Drag from './Drag.vue'
import ScrollTag from './ScrollTag.vue'
import TagEdit from './TagEdit.vue'

const props = defineProps({
  delItem: {
    type: Object
  }
})

const emit = defineEmits(['updateBlogList'])

const isDel = ref(false)
const delItem = ref({} as any)
/** 监听删除的博客数据 */
watch(
  () => props.delItem,
  (newVal) => {
    Object.assign(delItem.value, newVal)
    isDel.value = newVal!.isDel
  },
  { deep: true }
)

/** 监听到后进行处理 */
watch(
  () => isDel.value,
  (newVal) => {
    if (newVal === true) {
      categoryList.value.forEach((s) => {
        if (s.category === delItem.value?.categoryType) {
          s.count += -1
        }
        if (s.type === 'all') {
          s.count += -1
        }
      })
      isDel.value = false
    }
  }
)

const windowStore = useWindow()

const loading = ref(false)
const categoryList = ref([] as blogCategoryF[])
const getBlogCategoryApi = async () => {
  try {
    loading.value = true
    const res = await getBlogCategory()
    categoryList.value = res.data
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

/** 新增 */
const addData = ref({
  category: undefined,
  loading: false,
  visible: false
})

/** 排序 */
const onAddClick = async () => {
  try {
    addData.value.loading = true
    await postBlogCategoryAdd(addData.value.category!)
    addData.value.loading = false
    onAddCancel()
    ElMessage.success('新增分类成功')
    getBlogCategoryApi()
  } catch (err) {
    addData.value.loading = false
  }
}

const onAddCancel = () => {
  addData.value.category = undefined
  addData.value.visible = false
}

// 弹窗内容
const getModalForm = () => ({
  sort: makeNumberProp(),
  loading: false,
  isShow: false,
  editType: 'edit'
})

const modalForm = reactive({
  ...getModalForm()
})

const onCancel = () => {
  modalForm.isShow = false
  modalForm.loading = false
  getBlogCategoryApi()
}

const onUpdate = () => {
  modalForm.isShow = false
}

const onUpdateCategoryList = (value: any) => {
  const index = categoryList.value.findIndex(
    (s) => s.category === value.category
  )
  categoryList.value[index].sort = value.sort
  const darpIndex = categoryList.value.findIndex(
    (s) => s.category === value.drapCategory
  )
  categoryList.value[darpIndex].sort = value.drapSort
  categoryList.value.sort((a, b) => a.sort - b.sort)
}

const onUpdateDrag = (value: any) => {
  const list = categoryList.value.filter((s) => s.category === '全部')
  categoryList.value = list.concat(value)
}

watch(
  () => categoryList.value.length,
  () => {
    if (categoryList.value.length <= 1) {
      modalForm.isShow = false
    }
  }
)
getBlogCategoryApi()
</script>
<template>
  <ElCard class="relative">
    <ElRow :gutter="20">
      <ElCol
        :span="
          windowStore.screenWidth > 775
            ? 21
            : windowStore.screenWidth <= 775 && windowStore.screenWidth > 575
            ? 20
            : 18
        "
        class="left_scroll"
      >
        <ScrollTag
          :loading="loading"
          :category-list="categoryList"
        />
      </ElCol>
      <ElCol
        :span="
          windowStore.screenWidth > 775
            ? 3
            : windowStore.screenWidth <= 775 && windowStore.screenWidth > 575
            ? 4
            : 6
        "
        class="right_edit"
      >
        <ElSpace class="edit p-[10px] h-full">
          <ElPopover
            :visible="addData.visible"
            trigger="click"
            title="添加分类"
            placement="left"
            width="200"
          >
            <template #reference>
              <ElButton
                type="primary"
                link
                @click="addData.visible = true"
              >
                <template #icon>
                  <icon-add-one />
                </template>
                新建
              </ElButton>
            </template>
            <div class="p-[10px]">
              <ElInput
                placeholder="请输入分类"
                v-model="addData.category"
                maxlength="8"
              />
              <ElSpace
                style="display: flex; justify-content: end; margin-top: 20px"
              >
                <ElButton @click="onAddCancel">取消</ElButton>
                <ElButton
                  type="primary"
                  @click="onAddClick"
                  :loading="addData.loading"
                >
                  确认
                </ElButton>
              </ElSpace>
            </div>
          </ElPopover>
          <ElButton
            v-if="categoryList.length > 1"
            type="primary"
            link
            @click="modalForm.isShow = true"
          >
            <template #icon>
              <ElIcon><Setting /></ElIcon>
            </template>
            管理分组
          </ElButton>
        </ElSpace>
      </ElCol>
    </ElRow>
  </ElCard>
  <Modal
    :model-value="modalForm.isShow"
    title="管理分组"
    :loading="modalForm.loading"
    :close-on-click-modal="false"
    :show-close="true"
    @close="onCancel"
    destroy-on-close
    @cancel="onCancel"
    :opera-show="false"
    width="650px"
  >
    <ElTabs v-model="modalForm.editType">
      <ElTabPane
        name="edit"
        label="编辑"
      >
        <TagEdit
          v-model:categoryList="categoryList"
          @update="onUpdate"
          @update-drag="onUpdateDrag"
        />
      </ElTabPane>
      <ElTabPane
        name="sort"
        label="排序"
      >
        <Drag
          :categoryList="categoryList"
          @updateCategoryList="onUpdateCategoryList"
        />
      </ElTabPane>
    </ElTabs>
  </Modal>
</template>
<style lang="less" scoped>
:deep(.el-card) {
  border-radius: 8px;
  &__body {
    padding: 0;
  }
}

:deep(.edit) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px !important;
  justify-content: right;
}

:deep(.left_scroll) {
  padding-right: 0;
}

:deep(.el-tag) {
  cursor: pointer;
}
</style>
