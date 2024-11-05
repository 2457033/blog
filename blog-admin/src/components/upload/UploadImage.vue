<script lang="ts" setup>
import { ossUploadFile } from '@/hook/useOss'
import { isHttpOrHttps } from '@/shared/verify'
import {
  UploadInstance,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus'
import { ref, useAttrs } from 'vue'

defineProps({
  imageUrl: {
    type: String
  },
  width: {
    type: Number,
    default: 178
  },
  height: {
    type: Number,
    default: 178
  },
  text: {
    type: String
  }
})

const emit = defineEmits(['delete'])

const attrs = useAttrs()

const { VITE_BASE_URL } = import.meta.env

const uploadRef = ref<UploadInstance>()

const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小超过2MB')
    return false
  }
  return true
}

// const handleAvatarSuccess = (
//   response: any,
//   _uploadFile: UploadFile,
//   _uploadFiles: any
// ) => {
//   imageUrl.value = response.data
// }

const status = ref()
// const process = ref()

const onDelete = () => {
  status.value = undefined
  emit('delete')
}

const httpRequest = async (options: UploadRequestOptions) => {
  status.value = 'uploading'
  const result: any = await ossUploadFile(options.file)
  options.onSuccess(result)
  status.value = ''
}
</script>
<template>
  <ElUpload
    ref="uploadRef"
    v-if="!imageUrl && !status"
    list-type="picture-card"
    :http-request="httpRequest"
    accept="image/*"
    :show-file-list="false"
    class="avatar-uploader"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :before-upload="beforeAvatarUpload"
    v-bind="attrs"
  >
    <div
      class="flex flex-col items-center"
      :class="{
        'mt-4': text
      }"
    >
      <ElIcon class="avatar-uploader-icon">
        <Plus />
      </ElIcon>
      <span v-if="text">{{ text }}</span>
    </div>
  </ElUpload>
  <div
    v-else
    class="image relative"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="status === 'uploading'"
    >
      <span>上传中</span>
      <Loading class="ml-1 mt-2" />
      <!-- <ElProgress :percentage="process" /> -->
    </div>
    <div
      class="w-ful h-full"
      v-else
    >
      <ElImage
        class="avatar w-full h-full"
        :src="isHttpOrHttps(imageUrl) ? imageUrl : VITE_BASE_URL + imageUrl"
        fit="scale-down"
      />
      <div class="active">
        <span @click="onDelete">
          <ElIcon><Delete /></ElIcon>
        </span>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100%;
  height: 100%;
}

.image {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.active {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: var(--el-overlay-color-lighter);
  transition: opacity var(--el-transition-duration);

  span {
    cursor: pointer;
  }
}

.image:hover .active {
  opacity: 1;
}
</style>
