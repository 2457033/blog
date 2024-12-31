<script lang="ts" setup>
import AssignUser from './component/AssignUser.vue'

import { makeNumberProp, makeStringMap } from '@/shared/props'
import { FormInstance, FormRules, TableColumnCtx } from 'element-plus'

import { onMounted, reactive, ref } from 'vue'

import {
  Row,
  getRoleDel,
  postBindUser,
  postRoleAdd,
  postRoleExport,
  postRoleList,
  postRoleUpdate,
  postRoleUpdateStatus,
  postUnBindUser
} from '@/api/setting/role'
import { menusF, getMenusList } from '@/api/setting/menus'
import { exportExcel } from '@/shared/upload'

const getSearchForm = () => ({
  ...makeStringMap('role', 'roleName', 'createStartTime', 'createEndTime'),
  status: makeNumberProp(),
  pageNum: 1,
  pageSize: 10
})

const searchForm = reactive({
  ...getSearchForm()
})

const tableData = reactive({
  row: [] as Row[],
  loading: false,
  total: 0
})

const columns = ref<Partial<TableColumnCtx<any>>[]>([
  {
    prop: 'id',
    label: '角色编号',
    align: 'center',
    width: '120'
  },
  {
    prop: 'roleName',
    label: '角色名称',
    align: 'center'
  },
  {
    prop: 'role',
    label: '权限字符',
    align: 'center'
  },
  {
    prop: 'sort',
    label: '显示顺序',
    align: 'center'
  },
  {
    prop: 'status',
    label: '状态',
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    align: 'center',
    width: '200'
  }
])

// 弹窗内容
const getModalForm = () => ({
  ...makeStringMap('roleName', 'role', 'remark', 'id'),
  sort: makeNumberProp(),
  selectIds: [],
  status: 1,
  loading: false,
  isShow: false,
  title: '新增菜单',
  type: 'add'
})

const modalForm = reactive({
  ...getModalForm()
})

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur'
    }
  ],
  role: [
    {
      required: true,
      message: '请输入权限字符',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      message: '请输入角色顺序',
      trigger: 'blur'
    }
  ]
})

const menusList = ref([] as menusF[])
const getMenuListApi = async () => {
  try {
    const res = await getMenusList()
    menusList.value = res.data.row
  } catch (err) {
    console.log(err)
  }
}

const postRoleListApi = async () => {
  try {
    if (tableData.loading) return
    tableData.loading = true
    const res = await postRoleList({
      role: searchForm.role!,
      roleName: searchForm.roleName!,
      status: searchForm.status!,
      createStartTime: searchForm.createStartTime!,
      createEndTime: searchForm.createEndTime!,
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

const addRole = async () => {
  await getMenuListApi()
  modalForm.title = '新增角色'
  modalForm.type = 'add'
  modalForm.isShow = true
}

// 修改某个用户信息
const updateClick = async (row: Row) => {
  await getMenuListApi()
  Object.assign(modalForm, row)
  modalForm.title = '修改角色'
  modalForm.type = 'update'
  modalForm.isShow = true
}

// 修改某个用户信息
const delClick = (row: Row) => {
  ElMessageBox.confirm(`确定删除该用户吗?`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await getRoleDel(row.id)
      ElMessage.success('删除成功')
      postRoleListApi()
    })
    .catch(() => {})
}

const onConfirm = () => {
  ruleFormRef.value?.validate().then(async () => {
    try {
      if (modalForm.loading) return
      modalForm.loading = true
      const selectIds: any = treeRef.value?.getCheckedKeys()
      const halfSelecteIds: any = treeRef.value?.getHalfCheckedKeys()
      if (modalForm.type === 'update') {
        await postRoleUpdate({
          id: modalForm.id!,
          roleName: modalForm.roleName!,
          role: modalForm.role!,
          sort: modalForm.sort!,
          status: modalForm.status!,
          selectIds,
          halfSelecteIds,
          remark: modalForm.remark!
        })
        ElMessage.success('修改成功')
      } else if (modalForm.type === 'add') {
        await postRoleAdd({
          roleName: modalForm.roleName!,
          role: modalForm.role!,
          sort: modalForm.sort!,
          status: modalForm.status!,
          selectIds,
          halfSelecteIds,
          remark: modalForm.remark!
        })
        ElMessage.success('新增成功')
      }
      modalForm.loading = false
      postRoleListApi()
      onCancel()
    } catch (err) {
      modalForm.loading = false
    }
  })
}

const onCancel = () => {
  Object.assign(modalForm, getModalForm())
}

// 状态修改
const statusClick = (row: Row) => {
  ElMessageBox.confirm(
    `确定${row.status === 1 ? '停用' : '启用'}该用户吗?`,
    '',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const status = row.status
      if (row.status === 1) {
        row.status = 0
      } else {
        row.status = 1
      }
      await postRoleUpdateStatus({
        status: row.status,
        id: row.id
      })
      ElMessage.success(`${status === 1 ? '停用' : '启用'}成功`)
    })
    .catch(() => {})
}

const onSerch = () => {
  postRoleListApi()
}

const onReset = () => {
  Object.assign(searchForm, getSearchForm())
  dateTime.value = ''
  postRoleListApi()
}

const dateTime = ref('')
const dateTimePickChange = () => {
  searchForm.createStartTime = dateTime.value[0]
  searchForm.createEndTime = dateTime.value[1]
  postRoleListApi()
}

const treeRef = ref<InstanceType<typeof ElTree>>()

// 分配用户
const getBindData = () => ({
  userIds: [] as string[],
  roleId: '',
  loading: false,
  type: '',
  title: ''
})
const bindData = reactive({
  ...getBindData()
})
const isShow = ref(false)

// 分配按钮
const allocationClick = (row: Row) => {
  bindData.roleId = row.id
  bindData.type = 'unBind'
  bindData.title = '分配用户'
  // bindData.roleId = row.roleId
  isShow.value = true
}

const unBindClick = (row: Row) => {
  bindData.roleId = row.id
  bindData.type = 'bind'
  bindData.title = '取消分配'
  isShow.value = true
}

const assignConfirm = async (multipleSelection: string[]) => {
  try {
    bindData.loading = true
    if (bindData.type === 'unBind') {
      await postBindUser({
        userIds: multipleSelection,
        roleId: bindData.roleId
      })
    } else if (bindData.type === 'bind') {
      await postUnBindUser({
        userIds: multipleSelection,
        roleId: bindData.roleId
      })
    }
    ElMessage.success('操作成功')
    isShow.value = false
    bindData.loading = false
  } catch (err) {
    bindData.loading = false
  }
}

const assignClose = () => {
  Object.assign(bindData, getBindData())
  isShow.value = false
}

/** 导出 */
const exportLoading = ref(false)
const onExport = async () => {
  try {
    if (tableData.loading) return
    exportLoading.value = true
    const res = await postRoleExport({
      role: searchForm.role!,
      roleName: searchForm.roleName!,
      status: searchForm.status!,
      createStartTime: searchForm.createStartTime!,
      createEndTime: searchForm.createEndTime!,
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize
    })
    exportExcel(res)
    exportLoading.value = false
  } catch (err) {
    exportLoading.value = false
  }
}

onMounted(() => {
  postRoleListApi()
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
              @click="addRole"
            >
              新增角色
            </ElButton>
          </ElSpace>
        </ElCol>
      </ElRow>
      <ElForm
        @keyup.enter="onSerch"
        :inline="true"
      >
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.roleName"
            clearable
            placeholder="输入角色名称"
            @keyup.enter="onSerch"
          />
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.role"
            clearable
            placeholder="输入权限字符"
          />
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElSelect
            v-model="searchForm.status"
            clearable
            placeholder="选择角色状态"
          >
            <ElOption
              :value="1"
              label="启用"
            />
            <ElOption
              :value="0"
              label="停用"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem style="width: 350px">
          <ElDatePicker
            v-model="dateTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 2, 1, 23, 59, 59)
            ]"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateTimePickChange"
          >
          </ElDatePicker>
        </ElFormItem>
      </ElForm>
      <ElRow>
        <ElCol>
          <ElSpace>
            <ElButton
              type="primary"
              @click="onSerch"
              >查询</ElButton
            >
            <ElButton @click="onReset">重置</ElButton>
            <ElButton
              :loading="exportLoading"
              color="#296DFF"
              @click="onExport"
            >
              导出
            </ElButton>
          </ElSpace>
        </ElCol>
      </ElRow>
    </LayoutHeader>
    <Table
      :data="tableData.row"
      border
      :total="tableData.total"
      v-loading="tableData.loading"
      :current-page="searchForm.pageNum"
      :page-size="searchForm.pageSize"
      operate-width="280"
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
          :renderHeader="column.renderHeader"
        >
          <template #default="{ row }">
            <div v-if="column.prop === 'status'">
              <ElSwitch
                :model-value="row[column.prop!] === 1 ? true : false"
                size="large"
                @click="statusClick(row)"
              >
              </ElSwitch>
            </div>
            <div v-else>
              {{ row[column.prop!] }}
            </div>
          </template>
        </ElTableColumn>
      </template>
      <template #operate="{ row }">
        <div v-if="row.role !== 'admin'">
          <ElButton
            type="primary"
            link
            @click="updateClick(row)"
          >
            编辑
          </ElButton>
          <ElButton
            type="primary"
            link
            @click="allocationClick(row)"
          >
            分配用户
          </ElButton>
          <ElButton
            type="primary"
            link
            @click="unBindClick(row)"
          >
            取消分配
          </ElButton>
          <ElButton
            type="danger"
            link
            @click="delClick(row)"
          >
            删除
          </ElButton>
        </div>
      </template>
    </Table>
    <Modal
      :model-value="modalForm.isShow"
      :title="modalForm.title"
      :loading="modalForm.loading"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      @confirm="onConfirm"
      @cancel="onCancel"
      width="650px"
    >
      <ElForm
        ref="ruleFormRef"
        :model="modalForm"
        :rules="rules"
        status-icon
        label-width="95px"
        inline
        :validate-on-rule-change="false"
      >
        <ElFormItem
          label="角色名称"
          prop="roleName"
          required
          style="width: 275px"
        >
          <ElInput
            v-model="modalForm.roleName"
            placeholder="请输入角色名称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="权限字符"
          prop="role"
          required
          style="width: 275px"
        >
          <ElInput
            v-model="modalForm.role"
            placeholder="请输入用户昵称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="角色顺序"
          prop="sort"
          required
          style="width: 275px"
        >
          <ElInputNumber
            v-model="modalForm.sort"
            :min="0"
            cl
            controls-position="right"
          />
        </ElFormItem>
        <ElFormItem
          label="状态"
          prop="status"
          style="width: 275px"
        >
          <ElRadioGroup
            v-model="modalForm.status"
            class="ml-4"
          >
            <ElRadio :value="1">启用</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem
          label="菜单权限"
          style="width: 275px"
        >
          <ElTree
            ref="treeRef"
            class="tree-border"
            :data="menusList"
            show-checkbox
            node-key="id"
            :props="{ label: 'title', children: 'children' }"
            :default-checked-keys="modalForm.selectIds"
          />
        </ElFormItem>
        <ElFormItem
          label="备注"
          prop="remark"
          style="width: 95%"
        >
          <ElInput
            v-model="modalForm.remark"
            :rows="2"
            type="textarea"
            placeholder="请输入备注"
          />
        </ElFormItem>
      </ElForm>
    </Modal>
    <AssignUser
      :role-id="bindData.roleId"
      :title="bindData.title"
      :type="bindData.type"
      :is-show="isShow"
      :loading="bindData.loading"
      @close="assignClose"
      @confirm="assignConfirm"
    />
  </Layout>
</template>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}

.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
  width: 100%;
}
</style>
