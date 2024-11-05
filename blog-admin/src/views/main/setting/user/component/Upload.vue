<script lang="ts" setup>
import { postUserDownloadTem } from '@/api/setting/users'
import UploadExcel, { fileListF } from '@/components/upload/UploadExcel.vue'
import { exportDownload } from '@/shared/upload'
import { UploadFile, UploadFiles, UploadProgressEvent } from 'element-plus'
import { ref } from 'vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'success'])

const init = ref(false)

const onSuccess = (
  response: any,
  uploadFile: UploadFile,
  _uploadFiles: UploadFiles
) => {
  loading.value = false
  uploadRef.value!.removeFile(uploadFile)
  if (fileList.value.every((s) => s.status === 'success')) {
    emit('success', response)
    init.value = true
  }
}

const fileList = ref<fileListF[]>([])
const loading = ref(false)

function change(uploadFile: UploadFile, _uploadFiles: UploadFiles) {
  // const item = fileList.value.find((s) => s.uid === uploadFile.uid)
  // if (item) {
  //   return
  // }
  const size = parseInt((uploadFile.size! / 1024).toFixed(2))
  if (!init.value && fileList.value.length > 0) {
    ElMessage.warning('最多只能上传一个文件')
    return
  } else if (size > 2048) {
    ElMessage.warning('上传文件不能超过2MB')
    return
  } else {
    if (fileList.value.every((s) => s.status === 'success') && init.value) {
      fileList.value = []
      init.value = false
      return
    }
    fileList.value.push({ ...uploadFile, process: uploadFile.percentage! })
  }
}

function onProgress(
  evt: UploadProgressEvent,
  uploadFile: UploadFile,
  _uploadFiles: UploadFiles
) {
  loading.value = true
  init.value = true
  fileList.value.forEach((s) => {
    if (s.uid === uploadFile.uid) {
      s.status =
        Math.round(evt.percent) > 0 && Math.round(evt.percent) < 100
          ? 'uploading'
          : 'success'
      s.process = Math.round(evt.percent)
    }
  })
}

const uploadRef = ref()

const onConfirm = () => {
  uploadRef.value!.uploadSubmit()
}

const onCancel = () => {
  fileList.value = []
  emit('cancel')
}

function onError(
  _error: Error,
  uploadFile: UploadFile,
  _uploadFiles: UploadFiles
) {
  ElNotification({
    title: '错误',
    message: '文件格式有误，请按照模板格式导入',
    type: 'error',
    duration: 2000
  })
  fileList.value.forEach((s) => {
    if (s.uid === uploadFile.uid) {
      s.status = uploadFile.status
    }
  })
  loading.value = false
}

const temClick = async () => {
  try {
    const res = await postUserDownloadTem()
    exportDownload(res)
  } catch (err) {
    console.log(err)
  }
}

const delClick = (file: fileListF) => {
  fileList.value.splice(fileList.value.indexOf(file), 1)
}
</script>
<template>
  <Modal
    :model-value="props.isShow"
    :loading="loading"
    title="导入"
    :close-on-click-modal="false"
    :show-close="false"
    destroy-on-close
    @confirm="onConfirm"
    @cancel="onCancel"
    width="800px"
    confirm-text="开始导入"
    :confirm-disabled="fileList.length > 0 ? false : true"
  >
    <UploadExcel
      ref="uploadRef"
      tip-text="仅允许导入xls、xlsx格式文件。"
      :files="fileList"
      api="api/upload_user/import"
      :limit="9"
      :auto-upload="false"
      @download-tem="temClick"
      @success="onSuccess"
      @change="change"
      @progress="onProgress"
      @error="onError"
      @del-click="delClick"
    ></UploadExcel>
  </Modal>
</template>
