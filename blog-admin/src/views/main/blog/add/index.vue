<script lang="ts" setup>
import { nextTick, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { FormInstance, FormRules } from 'element-plus'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { postBlogAdd } from '@/api/blog/blog'
import { getCategory } from '@/api/blog/blog_category'
import { useRouter } from 'vue-router'

import { ossUploadFile } from '@/hook/useOss'

import '@wangeditor/editor/dist/css/style.css'
import { useWindow } from '@/pinia'

const router = useRouter()

const editorRef = shallowRef()
const toolbarConfig: Partial<IToolbarConfig> = {}

// onMounted(() => {
//   nextTick(() => {
//     console.log(editorRef.value?.getAllMenuKeys())
//   })
// })

const windowStore = useWindow()

type InsertFnType = (url: string, alt?: string, href?: string) => void

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  scroll: true,
  MENU_CONF: {
    uploadImage: {
      uploadImgMaxSize: 2 * 1024 * 1024,
      uploadFileName: 'file',
      async customUpload(file: File, insertFn: InsertFnType) {
        const result: any = await ossUploadFile(file)
        insertFn(result.url)
      }
    },
    insertImage: {
      onUpdatedImage(imageNode: any | null) {
        console.log('updated image', imageNode)
      }
    }
  }
}

const ruleFormRef = ref<FormInstance>()

const InputRef = ref()

const getData = () => ({
  title: '',
  tags: '',
  text: '',
  detail: '',
  img: '',
  categoryType: '',
  blogType: 0
})

const data = ref({
  ...getData()
})

type categoryListF = {
  code: string
  value: string
}
const query = ref({
  saveLoading: false,
  publishLoading: false,
  dynamicTags: [] as string[],
  inputVisible: false,
  inputValue: '',
  categoryList: [] as categoryListF[]
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入标题'
    }
  ],
  text: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入简介'
    }
  ],
  detail: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入内容'
    }
  ]
})

const errorMessage = ref()

/** 发布 */
const onAdd = (type: number) => {
  data.value.blogType = type
  if (query.value.saveLoading || query.value.publishLoading) return
  if (editorRef.value.isEmpty()) {
    errorMessage.value = '请输入内容'
  }
  ruleFormRef.value
    ?.validate()
    .then(async () => {
      if (!editorRef.value.isEmpty()) {
        if (query.value.dynamicTags.length > 0) {
          data.value.tags = query.value.dynamicTags.join(',')
        }
        try {
          type === 0
            ? (query.value.saveLoading = true)
            : (query.value.publishLoading = true)
          await postBlogAdd(data.value)
          ElMessage.success('新增成功')
          type === 0
            ? (query.value.saveLoading = false)
            : (query.value.publishLoading = false)
          router.go(-1)
          Object.assign(data.value, getData())
        } catch (err) {
          type === 0
            ? (query.value.saveLoading = false)
            : (query.value.publishLoading = false)
        }
      }
    })
    .catch(() => {})
}

const onEditorBlur = () => {
  if (editorRef.value.isEmpty()) {
    errorMessage.value = '请输入内容'
  } else {
    errorMessage.value = ''
  }
}

const handleAvatarSuccess = (response: any) => {
  if (response) {
    data.value.img = response.url
  }
  // data.value.img = response.data
}

const onDelete = () => {
  data.value.img = ''
}

const handleClose = (tag: string) => {
  query.value.dynamicTags.splice(query.value.dynamicTags.indexOf(tag), 1)
}

const handleInputConfirm = () => {
  if (query.value.inputValue) {
    query.value.dynamicTags.push(query.value.inputValue)
  }
  query.value.inputVisible = false
  query.value.inputValue = ''
}

const showInput = () => {
  query.value.inputVisible = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

/** 获取分类 */
const getCategoryApi = async () => {
  const res = await getCategory()
  query.value.categoryList = res.data
}
getCategoryApi()

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<template>
  <ElAffix :offset="112">
    <ElCard ref="headerRef">
      <div class="flex justify-between items-center">
        <span class="text-[20px] font-medium">新增博客文章</span>
        <ElSpace>
          <ElButton
            @click="onAdd(0)"
            :loading="query.saveLoading"
          >
            保存
          </ElButton>
          <ElButton
            @click="onAdd(1)"
            type="primary"
            :loading="query.publishLoading"
          >
            发布
          </ElButton>
        </ElSpace>
      </div>
    </ElCard>
  </ElAffix>
  <ElCard class="mt-4 flex-1">
    <ElForm
      ref="ruleFormRef"
      :model="data"
      :rules="rules"
    >
      <div class="flex justify-between">
        <div>
          <ElFormItem v-if="windowStore.screenWidth <= 600">
            <UploadImage
              :image-url="data.img"
              :width="160"
              :height="120"
              :on-success="handleAvatarSuccess"
              @delete="onDelete"
              text="封面"
            />
          </ElFormItem>
          <ElFormItem prop="title">
            <ElInput
              class="title-custom"
              placeholder="请输入标题"
              v-model="data.title"
              maxlength="12"
            />
          </ElFormItem>
          <div
            :class="{
              'flex items-center': windowStore.screenWidth > 490
            }"
          >
            <ElFormItem
              style="width: 120px; margin-bottom: 12px"
              prop="category"
            >
              <ElSelect
                class="category-custom mt-3 mr-2"
                v-model="data.categoryType"
                placeholder="请输入分类"
                clearable
              >
                <ElOption
                  v-for="item in query.categoryList"
                  :label="item.value"
                  :value="item.code"
                />
              </ElSelect>
            </ElFormItem>
            <div
              v-if="windowStore.screenWidth > 490"
              class="w-[1px] h-[22px] border border-[#E8E9EB] mr-2"
            ></div>
            <div class="flex items-center flex-wrap gap-1">
              <ElTag
                v-for="tag in query.dynamicTags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </ElTag>
              <div v-if="query.dynamicTags.length < 4">
                <ElInput
                  style="width: 65px"
                  v-if="query.inputVisible"
                  ref="InputRef"
                  v-model="query.inputValue"
                  class="ml-1 w-20"
                  size="small"
                  maxlength="8"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
                />
                <ElButton
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput"
                  type="primary"
                  link
                >
                  添加标签
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <ElFormItem v-if="windowStore.screenWidth > 600">
          <UploadImage
            :image-url="data.img"
            :width="160"
            :height="120"
            :on-success="handleAvatarSuccess"
            @delete="onDelete"
            text="封面"
          />
        </ElFormItem>
      </div>
      <div>
        <ElFormItem prop="text">
          <ElInput
            type="textarea"
            class="textarea-custom mt-3"
            placeholder="请输入简介"
            autosize
            v-model="data.text"
            maxlength="200"
          ></ElInput>
        </ElFormItem>
      </div>
      <div class="z-50 mt-3">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="height: 500px"
          v-model="data.detail"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
          @onBlur="onEditorBlur"
        />
        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>
      </div>
    </ElForm>
  </ElCard>
</template>
<style lang="less" scoped>
:deep(.title-custom) {
  .el-input {
    &__inner {
      font-size: 20px;
    }
    &__wrapper {
      box-shadow: none;
      padding: 1px 0;
    }
  }
}

:deep(.category-custom) {
  .el-select {
    &__wrapper {
      box-shadow: none;
      padding: 1px 0;
    }
  }
}

:deep(.textarea-custom) {
  .el-textarea {
    &__inner {
      box-shadow: none;
      padding: 5px 0;
      border-radius: unset;
      border-bottom: 1px solid var(--Gray-Gray_2, #1e20251f);
      min-height: 70px !important;
    }
  }
}

:deep(.el-form-item) {
  &.is-error {
    .el-textarea__inner {
      box-shadow: none;
    }
    .el-input__wrapper {
      box-shadow: none;
    }
  }
}

.error-message {
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: 1;
  padding-top: 2px;
}
</style>
