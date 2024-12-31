<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ArticleDetail, getArticleDetail } from '@/api/blog/article'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const loading = ref(false)

const form = ref({} as ArticleDetail)

const tagOptions = ref([
  'JavaScript',
  'TypeScript',
  'Vue',
  'React',
  'Node.js',
  'HTML',
  'CSS'
])

const getDetail = async () => {
  const id = Number(route.params.id)
  try {
    loading.value = true
    const res = await getArticleDetail(id)
    Object.assign(form.value, res.data)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <Layout>
    <div
      class="article-detail p-4"
      v-loading="loading"
    >
      <ElRow :gutter="20">
        <ElCol :span="16">
          <ElForm
            ref="formRef"
            :model="form"
            label-width="80px"
          >
            <ElFormItem label="文章标题">
              <div>{{ form.title }}</div>
            </ElFormItem>
            <ElFormItem label="文章标签">
              <div v-if="form.tags?.length <= 0">--</div>
              <ElTag
                v-else
                v-for="tag in form.tags"
                :key="tag"
                class="mx-1"
              >
                {{ tag }}
              </ElTag>
            </ElFormItem>
            <ElFormItem label="文章内容">
              <div
                class="min-h-[500px] bg-gray-50 p-4 rounded w-full"
                v-html="form.detail"
              ></div>
            </ElFormItem>
          </ElForm>
        </ElCol>

        <ElCol :span="8">
          <ElCard class="box-card">
            <template #header>
              <div class="card-header">
                <span class="text-red-500">举报信息</span>
              </div>
            </template>
            <div class="text-gray-600">
              {{ form.reportReason }}
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </div>
    <ElAffix
      position="bottom"
      :offset="0"
    >
      <ElCard>
        <div class="flex justify-center items-center">
          <ElButton
            type="primary"
            v-if="form.blogType === 0"
          >
            发布
          </ElButton>
          <ElButton
            type="primary"
            v-else-if="form.blogType === 1"
          >
            撤回
          </ElButton>
          <ElButton @click="router.back()">返回</ElButton>
        </div>
      </ElCard>
    </ElAffix>
  </Layout>
</template>
