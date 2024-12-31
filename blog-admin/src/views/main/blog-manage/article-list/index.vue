<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { postArticleList, Row } from '@/api/blog/article'
import { useRouter } from 'vue-router'

const router = useRouter()

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '请输入文章标题',
      trigger: 'blur'
    }
  ],
  text: [
    {
      required: true,
      message: '请输入文章内容',
      trigger: 'blur'
    }
  ],
  reason: [
    {
      required: true,
      message: '请输入撤回原因',
      trigger: 'blur'
    }
  ]
})

const columns = ref<Partial<TableColumnCtx<Row>>[]>([
  {
    prop: 'id',
    label: '文章ID'
  },
  {
    prop: 'title',
    label: '文章标题',
    width: '180'
  },
  {
    prop: 'nickName',
    label: '作者'
  },
  {
    prop: 'blogType',
    label: '状态',
    width: '100',
    align: 'center'
  },
  {
    prop: 'tags',
    label: '标签',
    width: '200'
  },
  {
    prop: 'visitCount',
    label: '访问量',
    align: 'center'
  },
  {
    prop: 'commonCount',
    label: '评论数',
    align: 'center'
  },
  {
    prop: 'likeCount',
    label: '点赞数',
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '180'
  }
])

const tableData = reactive<{
  row: Row[]
  loading: boolean
  total: number
}>({
  row: [],
  loading: false,
  total: 2
})

interface ModalForm {
  isShow: boolean
  loading: boolean
  title: string
  text: string
  tags: string[]
  type: string
  id: number
  reason: string
}

const modal = reactive<ModalForm>({
  isShow: false,
  loading: false,
  title: '',
  text: '',
  tags: [],
  type: '',
  id: 0,
  reason: ''
})

const searchForm = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  nickName: ''
})

const addArticle = () => {
  modal.isShow = true
  modal.type = 'add'
  modal.title = '新增文章'
}

const editModal = (row: Row) => {
  modal.isShow = true
  modal.type = 'edit'
  modal.title = '查看详情'
  modal.id = row.id
  modal.title = row.title
  modal.text = row.text
  modal.tags = row.tags
}

const withdrawModal = (row: Row) => {
  modal.isShow = true
  modal.type = 'withdraw'
  modal.title = '撤回文章'
  modal.id = row.id
}

const onConfirm = () => {
  ruleFormRef.value?.validate().then(async () => {
    try {
      modal.loading = true
      if (modal.type === 'withdraw') {
        // 处理撤回逻辑
        console.log('撤回原因:', modal.reason)
      }
      ElMessage.success('操作成功')
      modal.loading = false
      onCancel()
      getList()
    } catch (err) {
      console.log(err)
      modal.loading = false
    }
  })
}

const onCancel = () => {
  modal.isShow = false
  modal.loading = false
  modal.title = ''
  modal.text = ''
  modal.tags = []
  modal.type = ''
  modal.id = 0
  modal.reason = ''
}

const paginationChange = (currentPage: number, pageSize: number) => {
  searchForm.pageNum = currentPage
  searchForm.pageSize = pageSize
  getList()
}

const getList = async () => {
  try {
    tableData.loading = true
    const res = await postArticleList({
      pageSize: searchForm.pageSize,
      pageNum: searchForm.pageNum,
      title: searchForm.title,
      nickName: searchForm.nickName
    })
    tableData.row = res.data.row
    tableData.total = res.data.total
    tableData.loading = false
  } catch (err) {
    console.log(err)
    tableData.loading = false
  }
}

const onSearch = () => {
  searchForm.pageNum = 1
  getList()
}

const onReset = () => {
  searchForm.title = ''
  searchForm.nickName = ''
  getList()
}

const goDetail = (row: Row) => {
  router.push({
    name: 'blog-manage-article-list-detail',
    params: {
      id: row.id
    }
  })
}

onMounted(() => {
  getList()
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
              @click="addArticle"
            >
              新增文章
            </ElButton>
          </ElSpace>
        </ElCol>
      </ElRow>
      <ElForm
        @keyup.enter="onSearch"
        :inline="true"
      >
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.title"
            placeholder="请输入文章标题"
            clearable
            @keyup.enter="onSearch"
          >
          </ElInput>
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.nickName"
            placeholder="请输入作者昵称"
            clearable
            @keyup.enter="onSearch"
          >
          </ElInput>
        </ElFormItem>
      </ElForm>
      <ElRow>
        <ElCol>
          <ElSpace>
            <ElButton
              type="primary"
              @click="onSearch"
              >查询</ElButton
            >
            <ElButton @click="onReset">重置</ElButton>
          </ElSpace>
        </ElCol>
      </ElRow>
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
      @paginationChange="paginationChange"
      operateWidth="200"
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
            <div v-if="column.prop === 'tags'">
              <ElTag
                v-for="tag in row.tags"
                :key="tag"
                class="m-1"
                type="primary"
              >
                {{ tag }}
              </ElTag>
            </div>
            <span v-else-if="column.prop === 'blogType'">
              <ElTag
                v-if="row.blogType === 1"
                type="success"
              >
                已发布
              </ElTag>
              <ElTag
                v-else-if="row.blogType === 0"
                type="danger"
              >
                未发布
              </ElTag>
            </span>
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
          @click="goDetail(row)"
        >
          查看详情
        </ElButton>
        <ElButton
          v-if="row.blogType === 0"
          type="primary"
          link
          @click="editModal(row)"
        >
          发布
        </ElButton>
        <ElButton
          v-if="row.blogType === 1"
          type="primary"
          link
          @click="withdrawModal(row)"
        >
          撤回
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框修改或新增文章 -->
    <Modal
      :model-value="modal.isShow"
      :title="modal.title"
      :loading="modal.loading"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      @confirm="onConfirm"
      @cancel="onCancel"
      width="600px"
    >
      <ElForm
        ref="ruleFormRef"
        :model="modal"
        :rules="rules"
        status-icon
        label-width="115px"
        :validate-on-rule-change="false"
      >
        <template v-if="modal.type === 'add'">
          <ElFormItem
            label="文章标题："
            prop="title"
            required
          >
            <ElInput
              v-model="modal.title"
              placeholder="请输入文章标题"
              clearable
            />
          </ElFormItem>
          <ElFormItem
            label="文章标签："
            prop="tags"
          >
            <ElSelect
              v-model="modal.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
              style="width: 100%"
            />
          </ElFormItem>
          <ElFormItem
            label="文章内容："
            prop="text"
            required
          >
            <ElInput
              v-model="modal.text"
              type="textarea"
              :rows="10"
              placeholder="请输入文章内容"
            />
          </ElFormItem>
        </template>
        <template v-else-if="modal.type === 'withdraw'">
          <ElFormItem
            label="撤回原因："
            prop="reason"
            required
          >
            <ElInput
              v-model="modal.reason"
              type="textarea"
              :rows="4"
              placeholder="请输入撤回原因"
            />
          </ElFormItem>
        </template>
      </ElForm>
    </Modal>
  </Layout>
</template>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
