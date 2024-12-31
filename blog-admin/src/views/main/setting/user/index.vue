<script lang="ts" setup>
import {
  Row,
  getUsersDel,
  postUserExport,
  postUsersAdd,
  postUsersBind,
  postUsersList,
  postUsersUnBind,
  postUsersUpdate,
  postUsersUpdateStatus,
  usersListF
} from '@/api/setting/users'

import AssignRole from './component/AssignRole.vue'
import Upload from './component/Upload.vue'

import { makeNumberProp, makeStringMap } from '@/shared/props'
import { FormInstance, FormRules, TableColumnCtx } from 'element-plus'

import { onMounted, reactive, ref } from 'vue'
import { exportExcel } from '@/shared/upload'
import { userInfo } from '@/pinia'

const userStore = userInfo()

const getSearchForm = () => ({
  ...makeStringMap('userName', 'phone'),
  status: makeNumberProp(),
  pageNum: 1,
  pageSize: 10
})

const searchForm = reactive({
  ...getSearchForm()
})

const tableData = reactive({
  row: [] as usersListF[],
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
    label: '手机号码(仅供测试)',
    align: 'center',
    width: '175'
  },
  {
    prop: 'roleId',
    label: '绑定状态',
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

const sexList = reactive([
  {
    value: 'man',
    label: '男'
  },
  {
    value: 'woman',
    label: '女'
  },
  {
    value: 'unknown',
    label: '未知'
  }
])

// 弹窗内容
const getModalForm = () => ({
  ...makeStringMap(
    'userName',
    'password',
    'phone',
    'nickName',
    'sex',
    'remark',
    'id'
  ),
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
  userName: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur'
    },
    {
      min: 3,
      message: '不能小于3个字符',
      trigger: 'change'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      min: 11,
      max: 11,
      message: '手机号格式不正确',
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '不能小于6个字符',
      trigger: 'change'
    }
  ],
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    },
    {
      min: 3,
      message: '不能小于3个字符',
      trigger: 'change'
    }
  ]
})

const postUsersListApi = async () => {
  try {
    if (tableData.loading) return
    tableData.loading = true
    const res = await postUsersList({
      userName: searchForm.userName!,
      phone: searchForm.phone!,
      status: searchForm.status!,
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

const addUser = () => {
  modalForm.title = '新增用户'
  modalForm.type = 'add'
  modalForm.isShow = true
}

// 修改某个用户信息
const updateClick = (row: Row) => {
  Object.assign(modalForm, row)
  modalForm.title = '修改用户'
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
      await getUsersDel(row.id)
      ElMessage.success('删除成功')
      postUsersListApi()
    })
    .catch(() => {})
}

const onConfirm = () => {
  ruleFormRef.value?.validate().then(async () => {
    try {
      if (modalForm.loading) return
      modalForm.loading = true
      if (modalForm.type === 'update') {
        await postUsersUpdate({
          id: modalForm.id!,
          phone: modalForm.phone!,
          nickName: modalForm.nickName!,
          sex: modalForm.sex!,
          status: modalForm.status!,
          remark: modalForm.remark!
        })
        userStore.uptInfo(modalForm)
        ElMessage.success('修改成功')
      } else if (modalForm.type === 'add') {
        await postUsersAdd({
          userName: modalForm.userName!,
          password: modalForm.password!,
          phone: modalForm.phone!,
          nickName: modalForm.nickName!,
          sex: modalForm.sex!,
          status: modalForm.status!,
          remark: modalForm.remark!
        })
        ElMessage.success('新增成功')
      }
      modalForm.loading = false
      postUsersListApi()
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
      await postUsersUpdateStatus({
        status: row.status,
        id: row.id
      })
      ElMessage.success(`${status === 1 ? '停用' : '启用'}成功`)
    })
    .catch(() => {})
}

const onSerch = () => {
  postUsersListApi()
}

const onReset = () => {
  Object.assign(searchForm, getSearchForm())
  postUsersListApi()
}

// 分配角色
const bindData = reactive({
  userId: '',
  roleId: '',
  loading: false
})
const isShow = ref(false)
const allocationClick = (row: Row) => {
  bindData.userId = row.id
  bindData.roleId = row.roleId
  isShow.value = true
}

const assignClose = () => {
  bindData.userId = ''
  bindData.roleId = ''
  isShow.value = false
}

const assignConfirm = async (roleId: string) => {
  bindData.roleId = roleId
  try {
    if (bindData.loading) return
    bindData.loading = true
    await postUsersBind({
      userId: bindData.userId!,
      roleId: bindData.roleId
    })
    ElMessage.success('操作成功')
    postUsersListApi()
    assignClose()
    bindData.loading = false
  } catch (err) {
    bindData.loading = false
  }
}

const unBindClick = (row: Row) => {
  ElMessageBox.confirm(`确定要取消绑定吗?`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await postUsersUnBind({
          userId: row.id,
          roleId: row.roleId
        })
        ElMessage.success('操作成功')
        postUsersListApi()
      } catch (err) {}
    })
    .catch(() => {})
}

/** 导出 */
const exportLoading = ref(false)
const onExport = async () => {
  try {
    if (tableData.loading) return
    exportLoading.value = true
    const res = await postUserExport({
      userName: searchForm.userName!,
      phone: searchForm.phone!,
      status: searchForm.status!,
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize
    })
    exportExcel(res)
    exportLoading.value = false
  } catch (err) {
    exportLoading.value = false
  }
}

const importData = reactive({
  isShow: false,
  loading: false
})
const onImport = () => {
  importData.isShow = true
}

const onSuccess = (response: any) => {
  importData.isShow = false
  if (response.data) {
    ElNotification({
      title: '导入成功',
      message: response.data + '<br>请勿重复导入',
      type: 'warning',
      duration: 2000,
      dangerouslyUseHTMLString: true
    })
    postUsersListApi()
    return
  }
  ElMessage.success('导入成功')
  postUsersListApi()
}

const onPaginationChange = (currentPage: number, pageSize: number) => {
  searchForm.pageNum = currentPage
  searchForm.pageSize = pageSize
  postUsersListApi()
}

onMounted(() => {
  postUsersListApi()
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
              @click="addUser"
            >
              新增用户
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
            v-model="searchForm.userName"
            clearable
            placeholder="输入用户名"
            @keyup.enter="onSerch"
          />
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElInput
            v-model="searchForm.phone"
            clearable
            maxlength="11"
            placeholder="输入手机号"
          />
        </ElFormItem>
        <ElFormItem style="width: 280px">
          <ElSelect
            v-model="searchForm.status"
            clearable
            placeholder="选择用户状态"
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
            <ElButton
              :loading="exportLoading"
              color="#296DFF"
              @click="onImport"
            >
              导入
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
      @pagination-change="onPaginationChange"
      operate-width="250"
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
            <!-- <div v-if="column.prop === 'icon'">
            <ElIcon>
              <component
                v-if="row[column.prop!]"
                :is="row[column.prop!]"
              />
            </ElIcon>
          </div> -->
            <div v-if="column.prop === 'status'">
              <ElSwitch
                :model-value="row[column.prop!] === 1 ? true : false"
                size="large"
                @click="statusClick(row)"
              >
              </ElSwitch>
            </div>
            <div v-else-if="column.prop === 'roleId'">
              <ElTag
                :type="
                  row['roleId'] !== null && row['roleId'] !== undefined
                    ? 'success'
                    : 'warning'
                "
              >
                {{
                  row['roleId'] !== null && row['roleId'] !== undefined
                    ? '已绑定'
                    : '未绑定'
                }}
              </ElTag>
            </div>
            <div v-else>
              {{ row[column.prop!] }}
            </div>
          </template>
        </ElTableColumn>
      </template>
      <template #operate="{ row }">
        <div v-if="row.userName !== 'admin'">
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
            {{ row.roleId ? '切换绑定' : '绑定角色' }}
          </ElButton>
          <ElButton
            v-if="row.roleId"
            type="primary"
            link
            @click="unBindClick(row)"
          >
            取消绑定
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
          label="用户名称"
          prop="userName"
          required
          style="width: 17.1875rem"
          v-if="modalForm.type !== 'update'"
        >
          <ElInput
            v-model="modalForm.userName"
            placeholder="请输入用户名称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="用户昵称"
          prop="nickName"
          required
          style="width: 17.1875rem"
        >
          <ElInput
            v-model="modalForm.nickName"
            placeholder="请输入用户昵称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="手机号码"
          prop="phone"
          required
          style="width: 17.1875rem"
        >
          <ElInput
            v-model="modalForm.phone"
            placeholder="请输入用户名称"
            clearable
          ></ElInput>
        </ElFormItem>

        <ElFormItem
          label="用户密码"
          prop="password"
          required
          style="width: 17.1875rem"
          v-if="modalForm.type !== 'update'"
        >
          <ElInput
            v-model="modalForm.password"
            placeholder="请输入用户名称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="用户性别"
          prop="sex"
          style="width: 17.1875rem"
        >
          <ElSelect
            v-model="modalForm.sex"
            placeholder="请选择用户性别"
            clearable
          >
            <ElOption
              v-for="item in sexList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="状态"
          prop="status"
          style="width: 17.1875rem"
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
    <AssignRole
      :is-show="isShow"
      :role-id="bindData.roleId"
      @close="assignClose"
      @confirm="assignConfirm"
    />
    <Upload
      :is-show="importData.isShow"
      :loading="importData.loading"
      @cancel="importData.isShow = false"
      @success="onSuccess"
    />
  </Layout>
</template>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
