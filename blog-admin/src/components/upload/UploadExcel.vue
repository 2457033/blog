<script lang="ts" setup>
import { userInfo } from '@/pinia'
import { UploadFile, UploadInstance } from 'element-plus'
import {
  ComponentInternalInstance,
  PropType,
  getCurrentInstance,
  ref
} from 'vue'

const { VITE_BASE_URL } = import.meta.env

const userInfoStore = userInfo()
const { getToken } = userInfoStore

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const props = defineProps({
  // fileList: {
  //   type: Array as unknown as PropType<[]>,
  //   default: () => []
  // },
  // listType: {
  //   type: String as PropType<listTypeF>,
  //   default: 'text'
  // },
  tipText: {
    type: String,
    default: 'jpg/png files with a size less than 500kb'
  },
  api: {
    type: String
  },
  files: {
    type: Array as PropType<fileListF[]>,
    default: () => []
  }
})

const emit = defineEmits(['downloadTem', 'delClick'])

export interface fileListF extends UploadFile {
  process: Number
}

const customColorMethod = (percentage: number) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}

const uploadRef = ref<UploadInstance>()

function uploadSubmit() {
  uploadRef.value?.submit()
}

function removeFile(file: UploadFile) {
  uploadRef.value?.handleRemove(file)
}

defineExpose({
  uploadSubmit,
  removeFile
})

const temClick = () => {
  emit('downloadTem')
}

const delClick = (row: fileListF) => {
  emit('delClick', row)
}
</script>

<template>
  <ElUpload
    ref="uploadRef"
    v-bind="proxy!.$attrs"
    accept=".xls, .xlsx"
    class="upload-demo"
    drag
    :headers="{ Authorization: 'Bearer ' + getToken() }"
    :action="VITE_BASE_URL + props.api"
    :show-file-list="false"
  >
    <ElIcon class="el-icon--upload"><Plus /></ElIcon>
    <div class="el-upload__text">点击或拖拽文件到此处上传</div>
    <slot> </slot>
    <template #tip>
      <div class="el-upload__tip flex items-center">
        <span>{{ tipText }}</span>
        <ElButton
          type="primary"
          link
          size="large"
          style="font-size: 12px"
          @click="temClick"
        >
          下载模板
        </ElButton>
      </div>
    </template>
  </ElUpload>
  <ElTable
    class="mt-[10px]"
    :data="files"
    border
  >
    <ElTableColumn
      label="略缩图"
      align="center"
    >
      <template #default>
        <icon-excel
          theme="filled"
          size="24"
          fill="#7ed321"
        />
      </template>
    </ElTableColumn>
    <ElTableColumn
      label="文件名称"
      align="center"
      width="300"
    >
      <template #default="{ row }">
        <div>
          <span>{{ row.name }}</span>
          <ElProgress
            :percentage="row.process"
            :color="customColorMethod(row.process)"
          />
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn
      label="文件大小"
      align="center"
      width="120"
    >
      <template #default="{ row }">
        <span>{{ (row.size / 1024).toFixed(2) + 'KB' }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn
      label="状态"
      align="center"
    >
      <template #default="{ row }">
        <ElTag
          :type="
            row.status === 'ready'
              ? 'warning'
              : row.status === 'success'
              ? 'success'
              : row.status === 'uploading'
              ? 'primary'
              : 'danger'
          "
        >
          {{
            row.status === 'ready'
              ? '待上传'
              : row.status === 'success'
              ? '上传成功'
              : row.status === 'uploading'
              ? '上传中'
              : '上传失败'
          }}
        </ElTag>
      </template>
    </ElTableColumn>
    <ElTableColumn
      label="操作"
      fixed="right"
      align="center"
    >
      <template #default="{ row }">
        <ElButton
          type="danger"
          link
          @click="delClick(row)"
        >
          删除
        </ElButton>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
