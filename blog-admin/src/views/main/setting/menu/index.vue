<script lang="ts" setup>
import {
  ElMessage,
  ElTag,
  FormInstance,
  FormRules,
  TableColumnCtx
} from 'element-plus'

import { onMounted, reactive, ref } from 'vue'

import { makeNumberProp, makeStringMap } from '@/shared/props'

import iconSelect from './component/icon-select.vue'
import Drawer from './component/drawer.vue'

import { useSystemTool, useTagsStore } from '@/pinia'
import { storeToRefs } from 'pinia'

import { iconF, iconList } from './component'

import {
  menusF,
  postMenusAdd,
  postMenusAll,
  postMenusDelete,
  postMenusUpdate
} from '@/api/setting/menus'

const icons = ref([] as iconF[])

const systemToolStore = useSystemTool()
const { expandRowKeys } = storeToRefs(systemToolStore)
const { getExpandRowKeys } = systemToolStore

// const route = useRoute()

const tagsStore = useTagsStore()
const { updateDelTags } = tagsStore

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      message: '请输入菜单排序',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: 'blur'
    }
  ]
})

const menuTypeList = reactive([
  {
    key: 'directory',
    value: '目录'
  },
  {
    key: 'menu',
    value: '菜单'
  },
  {
    key: 'button',
    value: '按钮'
  }
])

const statusEnum = ref([
  {
    value: 'open',
    label: '开启'
  },
  {
    value: 'disabled',
    label: '禁用'
  }
])

const columns = ref<Partial<TableColumnCtx<any>>[]>([
  {
    prop: 'title',
    label: '菜单名称',
    width: '150'
  },
  {
    prop: 'icon',
    label: '图标',
    align: 'center'
  },
  {
    prop: 'sort',
    label: '排序'
  },
  {
    prop: 'permission',
    label: '权限标识',
    width: '150'
  },
  {
    prop: 'name',
    label: '组件路径',
    width: '150'
  },
  {
    prop: 'statusValue',
    label: '状态'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '175'
  }
])

const tableData = reactive({
  row: [] as menusF[],
  loading: false,
  total: 0
})

const getModalForm = () => ({
  isShow: false,
  loading: false,
  ...makeStringMap(
    'icon',
    'title',
    'name',
    'path',
    'id',
    'titleValue',
    'fId',
    'query',
    'permission'
  ),
  type: 'add',
  status: 'open',
  showMenu: 1,
  outChain: 0,
  cache: 1,
  menuType: 'directory',
  sort: makeNumberProp()
})

const getSearchForm = () => ({
  ...makeStringMap('title', 'status'),
  pageNum: 1,
  pageSize: 10
})

const searchForm = reactive({
  ...getSearchForm()
})

const modal = reactive({
  ...getModalForm()
})

const postMenusAllApi = async () => {
  if (tableData.loading) return
  try {
    tableData.loading = true
    const res = await postMenusAll({
      title: searchForm.title!,
      status: searchForm.status!,
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize
    })
    tableData.row = res.data.row
    tableData.total = res.data.total
    tableData.loading = false
  } catch (err) {
    console.log(err)
    tableData.loading = false
  }
}

const editModal = (row: menusF) => {
  Object.assign(modal, row)
  modal.type = 'edit'
  modal.titleValue = '修改菜单'
  modal.isShow = true
}

const addModal = (row: menusF) => {
  modal.fId = row.id
  modal.type = 'add'
  modal.titleValue = '新增菜单'
  modal.isShow = true
}

const addMenu = () => {
  modal.type = 'add'
  modal.titleValue = '新增菜单'
  modal.isShow = true
}

const onConfirm = () => {
  ruleFormRef.value?.validate().then(async () => {
    if (modal.cache === 0) {
      updateDelTags(modal)
    }
    try {
      modal.loading = true
      if (modal.type === 'edit') {
        await postMenusUpdate({
          icon: modal.icon!,
          title: modal.title!,
          name: modal.name!,
          path: modal.path!,
          status: modal.status!,
          id: modal.id!,
          sort: modal.sort!,
          menuType: modal.menuType,
          showMenu: modal.showMenu,
          outChain: modal.outChain,
          permission: modal.permission!,
          cache: modal.cache,
          query: modal.query!
        })
      } else if (modal.type === 'add') {
        await postMenusAdd({
          icon: modal.icon!,
          title: modal.title!,
          name: modal.name!,
          path: modal.path!,
          status: modal.status!,
          sort: modal.sort!,
          fId: modal.fId!,
          menuType: modal.menuType,
          showMenu: modal.showMenu,
          outChain: modal.outChain,
          permission: modal.permission!,
          cache: modal.cache,
          query: modal.query!
        })
      }

      modal.loading = false
      ElMessage.success('操作成功')
      postMenusAllApi()
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

const delModal = (row: menusF) => {
  ElMessageBox.confirm('是否删除该菜单', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await postMenusDelete(row.id)
      ElMessage.success('删除成功')
      postMenusAllApi()
    } catch (err) {
      console.log(err)
    }
  })
}

const paginationChange = (currentPage: number, pageSize: number) => {
  searchForm.pageNum = currentPage
  searchForm.pageSize = pageSize
  postMenusAllApi()
}

const onSerch = () => {
  postMenusAllApi()
}

const onReset = () => {
  searchForm.pageSize = 10
  Object.assign(searchForm, getSearchForm())
  postMenusAllApi()
}

const expandChange = (row: menusF, expandedRows: boolean) => {
  getExpandRowKeys(row.id, expandedRows)
}

const iconLoading = ref(false)
const onVisibleChange = async (val: boolean) => {
  if (val) {
    try {
      iconLoading.value = true
      const res = await iconList()
      icons.value = res
      setTimeout(() => {
        iconLoading.value = false
      }, 200)
    } catch (err) {
      iconLoading.value = false
    }
  } else {
    icons.value = []
  }
}

const drawerShow = ref(false)
// 点击获取更多图标
const getIconMore = () => {
  if (drawerShow.value) return
  drawerShow.value = true
}

// drawer关闭回调
const onClose = () => {
  drawerShow.value = false
}

const onDrawerConfirm = (name: string) => {
  modal.icon = name
  ElMessage.success('选择成功')
}

onMounted(() => {
  postMenusAllApi()
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
              新增菜单
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
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      :current-page="searchForm.pageNum"
      :page-size="searchForm.pageSize"
      :expand-row-keys="expandRowKeys.flat()"
      @expand-change="expandChange"
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
            <div v-if="column.prop === 'icon'">
              <ElIcon :size="16">
                <component
                  v-if="row[column.prop!]"
                  :is="'icon-' + row[column.prop!]"
                />
              </ElIcon>
            </div>
            <div v-else-if="column.prop === 'statusValue'">
              <ElTag :type="row['status'] === 'open' ? 'success' : 'danger'">
                {{ row[column.prop!] }}
              </ElTag>
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
          type="primary"
          link
          @click="addModal(row)"
        >
          新增
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
      :title="modal.titleValue"
      :loading="modal.loading"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      @confirm="onConfirm"
      @cancel="onCancel"
      width="650px"
    >
      <ElForm
        ref="ruleFormRef"
        :model="modal"
        :rules="rules"
        status-icon
        label-width="95px"
        inline
        :validate-on-rule-change="false"
      >
        <ElFormItem
          label="菜单类型："
          prop="menuType"
          style="width: 100%"
        >
          <ElRadioGroup
            v-model="modal.menuType"
            class="ml-4"
          >
            <ElRadio
              v-for="item in menuTypeList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem
          label="菜单图标："
          prop="icon"
          v-if="modal.menuType !== 'button'"
          style="width: 95%"
        >
          <ElSelect
            v-model="modal.icon"
            placeholder="请选择菜单图标"
            @visible-change="onVisibleChange"
            :loading="iconLoading"
            filterable
            clearable
          >
            <template
              #prefix
              v-if="modal.icon"
            >
              <ElIcon size="16">
                <component
                  v-if="modal.icon"
                  :is="'icon-' + modal.icon"
                />
              </ElIcon>
            </template>
            <div class="relative ml-[15px] my-[10px]">
              <button
                class="text-blue-400"
                @click="getIconMore"
              >
                点击获取更多图标
              </button>
            </div>
            <icon-select :icons="icons" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="菜单名称："
          prop="title"
          required
          style="width: 275px"
        >
          <ElInput
            v-model="modal.title"
            placeholder="请输入菜单名称"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="菜单排序："
          prop="sort"
          required
          style="width: 275px"
        >
          <ElInput
            v-model="modal.sort"
            placeholder="请输入菜单排序"
            type="number"
            :min="0"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          v-if="modal.menuType !== 'button'"
          label="是否外链："
          prop="outChain"
        >
          <ElRadioGroup
            v-model="modal.outChain"
            class="ml-4"
          >
            <ElRadio :value="1"> 是 </ElRadio>
            <ElRadio :value="0"> 否 </ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem
          v-if="modal.menuType !== 'button'"
          label="路由地址："
          prop="name"
          required
          style="width: 275px"
        >
          <ElInput
            v-model="modal.name"
            placeholder="请输入路由地址"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="菜单路径："
          prop="path"
          v-if="modal.menuType !== 'button' && modal.menuType !== 'directory'"
          style="width: 275px"
        >
          <ElInput
            v-model="modal.path"
            placeholder="请输入菜单路径"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="权限字符："
          prop="permission"
          v-if="modal.menuType !== 'directory'"
          style="width: 275px"
        >
          <ElInput
            v-model="modal.permission"
            placeholder="请输入权限字符"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="路由参数："
          prop="query"
          v-if="modal.menuType !== 'button' && modal.menuType !== 'directory'"
          style="width: 275px"
        >
          <ElInput
            v-model="modal.query"
            placeholder="请输入路由参数"
            clearable
          ></ElInput>
        </ElFormItem>
        <ElFormItem
          label="是否缓存："
          prop="cache"
          v-if="modal.menuType !== 'button' && modal.menuType !== 'directory'"
          style="width: 275px"
        >
          <ElRadioGroup
            v-model="modal.cache"
            class="ml-4"
          >
            <ElRadio :value="1">缓存</ElRadio>
            <ElRadio :value="0">不缓存</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem
          v-if="modal.menuType !== 'button'"
          label="显示状态："
          prop="showMenu"
          style="width: 275px"
        >
          <ElRadioGroup
            v-model="modal.showMenu"
            class="ml-4"
          >
            <ElRadio :value="1">显示</ElRadio>
            <ElRadio :value="0">隐藏</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem
          label="菜单状态："
          prop="status"
          style="width: 275px"
        >
          <ElRadioGroup
            v-model="modal.status"
            class="ml-4"
          >
            <ElRadio value="open">正常</ElRadio>
            <ElRadio value="disable">停用</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
    </Modal>
    <Drawer
      :visible="drawerShow"
      @close="onClose"
      @confirm="onDrawerConfirm"
    />
  </Layout>
</template>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
