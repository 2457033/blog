<script lang="ts" setup>
import { menusF, postMenusList } from '@/api/setting/menus'
import { Row, postRoleList } from '@/api/setting/role'
import { makeNumberProp, makeStringMap } from '@/shared/props'
import { nextTick, reactive, ref, watch } from 'vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  roleId: {
    type: String
  }
})

watch(
  () => props.isShow,
  (newVal) => {
    if (newVal) {
      postRoleListApi()
      postMenuAllApi()
    }
  }
)

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

const menusList = ref([] as menusF[])
const postMenuAllApi = async () => {
  try {
    const res = await postMenusList()
    menusList.value = res.data.row
  } catch (err) {
    console.log(err)
  }
}

const postRoleListApi = () => {
  nextTick(async () => {
    const loading = ElLoading.service({ target: '.el-dialog__body' })
    try {
      const res = await postRoleList({
        role: searchForm.role!,
        roleName: searchForm.roleName!,
        status: searchForm.status!,
        createStartTime: searchForm.createStartTime!,
        createEndTime: searchForm.createEndTime!,
        pageNum: searchForm.pageNum,
        pageSize: searchForm.pageSize
      })
      tableData.row = res.data.row?.filter(
        (s: { role: string }) => s.role !== 'admin'
      )
      tableData.total = res.data.total
      loading.close()
    } catch (err) {
      loading.close()
    }
  })
}

const roleId = ref('')

watch(
  () => props.roleId,
  (newVal) => {
    roleId.value = newVal!
  }
)

const emit = defineEmits(['close', 'confirm'])

const onConfirm = () => {
  emit('confirm', roleId.value)
}

const onCancel = () => {
  roleId.value = ''
  emit('close')
}
</script>
<template>
  <Modal
    :model-value="props.isShow"
    :loading="props.loading"
    title="绑定角色"
    :close-on-click-modal="false"
    :show-close="false"
    destroy-on-close
    @confirm="onConfirm"
    @cancel="onCancel"
    width="650px"
  >
    <div v-if="tableData.row.length > 0">
      <ElRadioGroup v-model="roleId">
        <div
          v-for="item in tableData.row"
          :key="item.id"
          class="ml-10"
        >
          <ElDropdown>
            <ElRadio :value="item.id">
              <span>{{ item.roleName }}</span>
              <ElIcon class="el-icon--right"><arrow-down /></ElIcon>
            </ElRadio>
            <template #dropdown>
              <div class="m-[20px]">
                <div class="mb-[10px]">角色的权限</div>
                <ElTree
                  ref="treeRef"
                  class="tree-border"
                  :data="menusList"
                  show-checkbox
                  node-key="id"
                  :props="{
                    label: 'title',
                    children: 'children',
                    disabled: 'title'
                  }"
                  :default-checked-keys="item.selectIds"
                />
              </div>
            </template>
          </ElDropdown>
        </div>
      </ElRadioGroup>
    </div>
    <div v-else>
      <span>暂无角色数据</span>
    </div>
  </Modal>
</template>
<style lang="less" scoped>
.el-radio {
  margin-right: 0 !important;
}
</style>
