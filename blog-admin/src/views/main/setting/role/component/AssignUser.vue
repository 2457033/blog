<script lang="ts" setup>
import {
  postBindUserList,
  postUnBindUserList,
  unBindUserRow
} from '@/api/setting/role'
import { TableColumnCtx } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  roleId: {
    type: String,
    default: ''
  }
})

// 监听弹窗类型
watch(
  () => props.isShow,
  (newVal) => {
    if (newVal) {
      if (props.type === 'bind') {
        postBindUserListApi()
      } else if (props.type === 'unBind') {
        postUnBindUserListApi()
      }
    }
  }
)

const getSearchForm = () => ({
  pageNum: 1,
  pageSize: 10
})

const searchForm = reactive({
  ...getSearchForm()
})

const tableData = reactive({
  row: [] as unBindUserRow[],
  loading: false,
  total: 0
})

const columns = ref<Partial<TableColumnCtx<any>>[]>([
  {
    prop: 'id',
    label: '用户编号',
    align: 'center',
    width: '120'
  },
  {
    prop: 'userName',
    label: '用户名称',
    align: 'center'
  },
  {
    prop: 'nickName',
    label: '用户昵称',
    align: 'center'
  },
  {
    prop: 'phone',
    label: '手机号码',
    align: 'center',
    width: '175'
  }
  // {
  //   prop: 'createTime',
  //   label: '创建时间',
  //   align: 'center',
  //   width: '200'
  // }
])

// 未分配用户
const postUnBindUserListApi = async () => {
  try {
    if (tableData.loading) return
    tableData.loading = true
    const res = await postUnBindUserList({
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize
    })
    tableData.row = res.data.row
    tableData.total = res.data.total
    tableData.loading = false
  } catch (err) {
    tableData.loading = false
  }
}

// 未分配用户
const postBindUserListApi = async () => {
  try {
    if (tableData.loading) return
    tableData.loading = true
    const res = await postBindUserList({
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize,
      roleId: props.roleId!
    })
    tableData.row = res.data.row
    tableData.total = res.data.total
    tableData.loading = false
  } catch (err) {
    tableData.loading = false
  }
}

const emit = defineEmits(['close', 'confirm'])

const multipleSelection = ref<string[]>([])

const handleSelectionChange = (val: unBindUserRow[]) => {
  const selectIds = val.map((s) => s.id)
  multipleSelection.value = selectIds
}

const onConfirm = () => {
  if (multipleSelection.value.length <= 0) {
    ElMessage.warning('请先勾选用户')
    return
  }
  emit('confirm', multipleSelection.value)
}

const onCancel = () => {
  multipleSelection.value = []
  emit('close')
}
</script>
<template>
  <Modal
    :model-value="props.isShow"
    :loading="props.loading"
    :title="props.title"
    :close-on-click-modal="false"
    :show-close="false"
    destroy-on-close
    @confirm="onConfirm"
    @cancel="onCancel"
    width="670px"
  >
    <div
      class="mb-[8px]"
      style="color: #3b82f6"
    >
      {{
        '(以下是' +
        (props.type === 'bind' ? '已分配' : '未分配') +
        '的用户' +
        ')'
      }}
    </div>
    <Table
      :data="tableData.row"
      border
      :total="tableData.total"
      v-loading="tableData.loading"
      :query-show="false"
      :empty-text="
        props.type === 'bind' ? '暂无分配的用户' : '暂无未分配的用户'
      "
      @selection-change="handleSelectionChange"
      :operateShow="false"
    >
      <template #list>
        <ElTableColumn
          type="selection"
          width="55"
        />
        <ElTableColumn
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align"
          :renderHeader="column.renderHeader"
        >
          <template #default="{ row }">
            <div>
              {{ row[column.prop!] }}
            </div>
          </template>
        </ElTableColumn>
      </template>
    </Table>
  </Modal>
</template>
<style lang="less" scoped></style>
