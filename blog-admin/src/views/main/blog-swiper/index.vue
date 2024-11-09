<script lang="ts" setup>
import {
  ElMessage,
  FormInstance,
  FormRules,
  TableColumnCtx
} from 'element-plus'

import { onMounted, reactive, ref } from 'vue'

import { makeNumberProp, makeStringMap } from '@/shared/props'

import { useSystemTool } from '@/pinia'
import { storeToRefs } from 'pinia'

import {
  postBlogSwiperAdd,
  postBlogSwiperList,
  postBlogSwiperUpdate,
  getBlogSwiperDelete,
  Row,
  postBlogSwiperUpdateStatus
} from '@/api/blog/blog_swiper'

const systemToolStore = useSystemTool()
const { expandRowKeys } = storeToRefs(systemToolStore)

// const route = useRoute()
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  img: [
    {
      required: true,
      message: '请上传图片',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      message: '请输入排序',
      trigger: 'blur'
    }
  ],
  imgStatus: [
    {
      required: true,
      message: '请输入状态',
      trigger: 'blur'
    }
  ]
})

const columns = ref<Partial<TableColumnCtx<any>>[]>([
  {
    prop: 'id',
    label: '轮播id',
    width: '150'
  },
  {
    prop: 'img',
    label: '轮播图',
    align: 'center'
  },
  {
    prop: 'sort',
    label: '排序',
    align: 'center'
  },
  {
    prop: 'imgStatus',
    label: '轮播状态',
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '175'
  }
])

const tableData = reactive({
  row: [] as Row[],
  loading: false,
  total: 0
})

const getModalForm = () => ({
  isShow: false,
  loading: false,
  ...makeStringMap('img', 'type', 'title'),
  sort: makeNumberProp(),
  id: makeNumberProp(),
  imgStatus: makeNumberProp()
})

const getSearchForm = () => ({
  pageNum: 1,
  pageSize: 10
})

const searchForm = reactive({
  ...getSearchForm()
})

const modal = reactive({
  ...getModalForm()
})

const postBlogSwiperListApi = async () => {
  if (tableData.loading) return
  try {
    tableData.loading = true
    const res = await postBlogSwiperList(searchForm)
    tableData.row = res.data.row
    tableData.total = res.data.total
    tableData.loading = false
  } catch (err) {
    console.log(err)
    tableData.loading = false
  }
}

const addMenu = () => {
  modal.isShow = true
  modal.type = 'add'
}

const editModal = (row: Row) => {
  Object.assign(modal, row)
  modal.isShow = true
  modal.type = 'edit'
}

const onConfirm = () => {
  ruleFormRef.value?.validate().then(async () => {
    try {
      modal.loading = true
      if (modal.type === 'edit') {
        await postBlogSwiperUpdate({
          img: modal.img!,
          imgStatus: modal.imgStatus!,
          sort: modal.sort!,
          id: modal.id!
        })
      } else if (modal.type === 'add') {
        await postBlogSwiperAdd({
          img: modal.img!,
          imgStatus: modal.imgStatus!,
          sort: modal.sort!
        })
      }
      modal.loading = false
      ElMessage.success('操作成功')
      postBlogSwiperListApi()
      onCancel()
    } catch (err) {
      console.log(err)
      modal.loading = false
    }
  })
}

const onCancel = () => {
  Object.assign(modal, getModalForm())
}

const delModal = (row: Row) => {
  ElMessageBox.confirm('是否删除该图', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await getBlogSwiperDelete(row.id!)
      ElMessage.success('删除成功')
      postBlogSwiperListApi()
    } catch (err) {
      console.log(err)
    }
  })
}

const paginationChange = (currentPage: number, pageSize: number) => {
  searchForm.pageNum = currentPage
  searchForm.pageSize = pageSize
  postBlogSwiperListApi()
}

const handleAvatarSuccess = (response: any) => {
  if (response) {
    modal.img = response.url
  }
}

const onDelete = () => {
  modal.img = undefined
}

const switchClick = (row: Row) => {
  ElMessageBox.confirm('是否修改此轮播图状态', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      row.loading = true
      await postBlogSwiperUpdateStatus({
        id: row.id!,
        imgStatus: row.imgStatus === 1 ? 0 : 1
      })
      ElMessage.success('修改成功')
      row.loading = false
      row.imgStatus === 1 ? (row.imgStatus = 0) : (row.imgStatus = 1)
    } catch (err) {
      console.log(err)
      row.loading = false
    }
  })
}

onMounted(() => {
  postBlogSwiperListApi()
})
</script>
<template>
  <Layout>
    <LayoutHeader>
      <ElRow :gutter="20">
        <ElCol>
          <ElSpace>
            <ElButton
              type="primary"
              @click="addMenu"
            >
              新增轮播图
            </ElButton>
          </ElSpace>
        </ElCol>
      </ElRow>
      <!-- <ElForm
        @keyup.enter="onSerch"
        :inline="true"
      >
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.title"
            placeholder="请输入菜单名称"
          />
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElSelect
            v-model="searchForm.status"
            placeholder="请选择菜单状态"
            clearable
          >
            <ElOption
              v-for="item in statusEnum"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm> -->
      <!-- <ElRow>
        <ElCol>
          <ElSpace>
            <ElButton
              type="primary"
              @click="onSerch"
              >查询</ElButton
            >
            <ElButton @click="onReset">重置</ElButton>
          </ElSpace>
        </ElCol>
      </ElRow> -->
    </LayoutHeader>
    <!-- 表格 -->
    <Table
      border
      stripe
      v-loading="tableData.loading"
      :data="tableData.row"
      :total="tableData.total"
      row-key="id"
      :current-page="searchForm.pageNum"
      :page-size="searchForm.pageSize"
      :expand-row-keys="expandRowKeys.flat()"
      @paginationChange="paginationChange"
      operate-width="180"
    >
      <template #list>
        <ElTableColumn
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align"
        >
          <template #default="{ row }">
            <div v-if="column.prop === 'img'">
              <ElImage
                :src="row[column.prop!]"
                hide-on-click-modal
                preview-teleported
                :preview-src-list="[row[column.prop!]]"
              />
            </div>
            <div v-else-if="column.prop === 'imgStatus'">
              <ElSwitch
                :model-value="row[column.prop] === 1 ? true : false"
                :loading="row['loading']"
                size="large"
                active-icon="Check"
                inactive-icon="Close"
                inline-prompt
                @click="switchClick(row)"
              />
            </div>
            <span v-else>
              {{ row[column.prop!] }}
            </span>
          </template>
        </ElTableColumn>
      </template>
      <template #operate="{ row }">
        <ElButton
          type="primary"
          link
          @click="editModal(row)"
        >
          编辑
        </ElButton>
        <ElButton
          type="danger"
          link
          @click="delModal(row)"
        >
          删除
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框修改或新增菜单 -->
    <Modal
      :model-value="modal.isShow"
      :title="modal.title"
      :loading="modal.loading"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      @confirm="onConfirm"
      @cancel="onCancel"
      width="550px"
    >
      <ElForm
        ref="ruleFormRef"
        :model="modal"
        :rules="rules"
        status-icon
        label-width="115px"
        inline
        :validate-on-rule-change="false"
      >
        <ElFormItem
          label="轮播图："
          prop="img"
          required
          style="width: 100%"
        >
          <UploadImage
            :image-url="modal.img"
            :width="250"
            :height="160"
            :on-success="handleAvatarSuccess"
            @delete="onDelete"
            text="上传图片"
          />
        </ElFormItem>
        <ElFormItem
          label="轮播图排序："
          prop="sort"
          required
          style="width: 350px"
        >
          <ElInput
            v-model="modal.sort"
            placeholder="请输入轮播图排序"
            type="number"
            :min="0"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="轮播图状态："
          prop="imgStatus"
          required
        >
          <ElRadioGroup v-model="modal.imgStatus">
            <ElRadio :value="1">开启</ElRadio>
            <ElRadio :value="0">禁用</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
    </Modal>
  </Layout>
</template>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
