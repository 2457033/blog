<script lang="ts" setup>
import {
  getBlogDelete,
  postBlogList,
  postBlogUpdateBlogType,
  Row
} from '@/api/blog/blog'
import { useEvent } from '@/hook/useEvent'
import { showLoading } from '@/shared/loading'
import { isHttpOrHttps } from '@/shared/verify'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import BlogSearch from './BlogSearch.vue'
import { useWindow } from '@/pinia'

const { VITE_BASE_URL } = import.meta.env

const windowStore = useWindow()

const emit = defineEmits(['updateCategory'])

const router = useRouter()

const blogData = ref({
  pageSize: 10,
  pageNum: 1,
  loading: false,
  type: '全部',
  list: [] as Row[],
  total: 0,
  tagType: '',
  searchVal: ''
})

const postBlogListApi = async () => {
  try {
    showLoading(true, '.blog-list')
    const res = await postBlogList({
      type: blogData.value.type,
      pageNum: blogData.value.pageNum,
      pageSize: blogData.value.pageSize,
      tagType: blogData.value.tagType,
      searchVal: blogData.value.searchVal
    })
    blogData.value.list = res.data.row
    showLoading(false)
  } catch (err) {
    showLoading(false)
  }
}

/** 发布或撤回 */
const onPublishOrWithdraw = (item: Row) => {
  ElMessageBox.confirm(
    `确认要${item.blogType === 0 ? '发布' : '撤回'}此条博客吗？`,
    '',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false
    }
  )
    .then(async () => {
      try {
        const blogType = item.blogType === 0 ? 1 : 0
        await postBlogUpdateBlogType({
          id: item.id,
          blogType: blogType
        })
        ElMessage.success(`${blogType === 0 ? '撤回' : '发布'}成功`)
        item.blogType = blogType
      } catch (err) {}
    })
    .catch(() => {})
}

/** 删除 */
const onBlogDel = (item: Row) => {
  ElMessageBox.confirm(`确认要删除此条博客吗？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false
  })
    .then(async () => {
      try {
        await getBlogDelete(item.id)
        ElMessage.success('删除成功')
        item.isDel = true
        emit('updateCategory', item)
        blogData.value.list.splice(blogData.value.list.indexOf(item), 1)
      } catch (err) {}
    })
    .catch(() => {})
}

/**  */
useEvent.von('update-category', (data) => {
  blogData.value.type = data
  postBlogListApi()
})

const highlightText = (data: any, val: any, name: string) => {
  const regex = new RegExp(data, 'gi')
  const highlightedContent = val.replace(
    regex,
    (match: any) => `<span class="${name}">${match}</span>`
  )
  return highlightedContent
}

const onUpdateBlog = (value: string) => {
  blogData.value.tagType = value === '全部' ? '' : value
  postBlogListApi()
}

const onUpdateSearch = (value: string) => {
  blogData.value.searchVal = value
  postBlogListApi()
}

onMounted(() => postBlogListApi())
</script>
<template>
  <BlogSearch
    v-if="windowStore.screenWidth <= 840"
    @update-blog-tag="onUpdateBlog"
    @update-blog-search="onUpdateSearch"
  />
  <div class="flex flex-wrap gap-4 mt-4">
    <div class="flex-grow basis-0 min-w-0 blog-list">
      <div v-if="blogData.list.length > 0">
        <ElCard
          class="blog mb-4"
          v-for="item in blogData.list"
          :key="item.id"
        >
          <div class="flex items-start max-h-[120px]">
            <div v-if="windowStore.screenWidth > 500">
              <div
                class="w-[160px] h-[120px] relative"
                v-if="item.img"
              >
                <ElImage
                  class="w-[160px] h-[120px] rounded-[8px] border border-[#dcdfe6] border-solid"
                  fit="scale-down"
                  :src="
                    isHttpOrHttps(item.img)
                      ? item.img
                      : VITE_BASE_URL + item.img
                  "
                />
                <div
                  v-if="item.blogType === 0"
                  class="absolute bottom-0 left-0 bg-[#2B5AED] w-[160px] h-[36px] rounded-b-[8px] opacity-85 flex items-center justify-center text-[#fff] text-[14px] leading-[22px] tracking-[2px]"
                >
                  未发布
                </div>
              </div>
            </div>
            <div
              class="relative flex flex-col justify-between my-[2px] h-full flex-grow"
              :class="{
                'ml-6': item.img && windowStore.screenWidth > 500
              }"
            >
              <div class="cursor-pointer move-into">
                <div class="flex items-center">
                  <span
                    class="text-[#1e2025] font-[500] text-[20px] leading-8 cur-hover"
                    :innerHTML="
                      highlightText(
                        blogData.searchVal,
                        item.title,
                        'text-yellow-400'
                      )
                    "
                  >
                    <!-- {{ item.title }} -->
                  </span>
                  <ElTag
                    class="ml-2"
                    color="#2b5aed"
                    v-if="!item.img && item.blogType === 0"
                  >
                    <span class="text-white">未发布</span>
                  </ElTag>
                </div>
                <div
                  class="text-ellipsis cur-hover mt-2"
                  :innerHTML="
                    highlightText(blogData.searchVal, item.text, 'text-red-600')
                  "
                >
                  <!-- {{ item.text }} -->
                </div>
              </div>
            </div>
          </div>
          <div v-if="windowStore.screenWidth <= 500">
            <div
              class="w-[160px] h-[120px] relative mt-2"
              v-if="item.img"
            >
              <ElImage
                class="w-[160px] h-[120px] rounded-[8px] border border-[#dcdfe6] border-solid"
                fit="scale-down"
                :src="
                  isHttpOrHttps(item.img) ? item.img : VITE_BASE_URL + item.img
                "
              />
              <div
                v-if="item.blogType === 0"
                class="absolute bottom-0 left-0 bg-[#2B5AED] w-[160px] h-[36px] rounded-b-[8px] opacity-85 flex items-center justify-center text-[#fff] text-[14px] leading-[22px] tracking-[2px]"
              >
                未发布
              </div>
            </div>
          </div>
          <div
            class="text-[14px] text-[#1e20257a] flex justify-between flex-wrap mt-3 gap-2"
          >
            <!-- 分类 -->
            <div class="flex">
              <span>
                {{ item.categoryType ? item.categoryType : '未分类' }}
              </span>
              <div class="w-[180px]">
                <span v-if="item.tags.length > 0">
                  <span class="mx-1">/</span>
                  <span
                    v-for="(tag, index) in item?.tags"
                    :class="{
                      'ml-1': index !== 0
                    }"
                    :innerHTML="
                      highlightText(blogData.tagType, tag, 'text-yellow-400')
                    "
                  >
                    <!-- {{ tag }} -->
                  </span>
                </span>
              </div>
            </div>
            <!-- 时间 -->
            <div>
              <span>{{ item.createTime.split(' ')[0] }}</span>
            </div>
            <div class="flex">
              <!-- 访问量 -->
              <ElPopover
                placement="top"
                content="访问量"
                popper-class="custom-popover"
                effect="dark"
                :width="70"
              >
                <template #reference>
                  <div class="cursor-pointer count-hover">
                    <icon-preview-open />
                    <span class="ml-[2px]">{{ item.visitCount }}</span>
                  </div>
                </template>
              </ElPopover>
              <!-- 点赞 -->
              <ElPopover
                placement="top"
                content="点赞量"
                popper-class="custom-popover"
                effect="dark"
                :width="70"
              >
                <template #reference>
                  <div class="ml-6 cursor-pointer count-hover">
                    <icon-thumbs-up />
                    <span class="ml-[2px]">{{ item.likeCount }}</span>
                  </div>
                </template>
              </ElPopover>
              <!-- 评论 -->
              <ElPopover
                placement="top"
                content="评论量"
                popper-class="custom-popover"
                effect="dark"
                :width="70"
              >
                <template #reference>
                  <div class="ml-6 cursor-pointer count-hover">
                    <icon-comment />
                    <span class="ml-[2px]">{{ item.conmonCount }}</span>
                  </div>
                </template>
              </ElPopover>
            </div>

            <div class="flex">
              <ElPopover
                placement="top"
                :style="{ minWidth: '70px', width: '70px' }"
                popper-class="custom-popover"
                :width="55"
                :content="item.blogType === 0 ? '发布' : '撤回'"
                effect="dark"
              >
                <template #reference>
                  <div
                    class="edit-hover cursor-pointer"
                    @click="onPublishOrWithdraw(item)"
                  >
                    <icon-send
                      v-if="item.blogType === 0"
                      size="18"
                    />
                    <icon-return
                      v-else
                      size="18"
                    />
                  </div>
                </template>
              </ElPopover>
              <ElPopover
                placement="top"
                content="编辑"
                popper-class="custom-popover"
                effect="dark"
                :width="55"
              >
                <template #reference>
                  <div
                    class="ml-6 cursor-pointer edit-hover"
                    @click="
                      router.push({
                        name: 'blog-manage-blog-detail',
                        params: {
                          id: item.id
                        }
                      })
                    "
                  >
                    <icon-edit size="18" />
                  </div>
                </template>
              </ElPopover>
              <ElPopover
                placement="top"
                content="删除"
                popper-class="custom-popover"
                effect="dark"
                :width="55"
              >
                <template #reference>
                  <div
                    class="ml-6 cursor-pointer edit-hover-del"
                    @click="onBlogDel(item)"
                  >
                    <icon-delete size="18" />
                  </div>
                </template>
              </ElPopover>
            </div>
          </div>
        </ElCard>
        <ElPagination
          class="flex justify-end"
          background
          layout="prev, pager, next"
          :total="blogData.total"
          :hide-on-single-page="blogData.list.length > 5 ? false : true"
        />
      </div>
      <div v-else>
        <ElEmpty></ElEmpty>
      </div>
    </div>
    <BlogSearch
      v-if="windowStore.screenWidth > 840"
      @update-blog-tag="onUpdateBlog"
      @update-blog-search="onUpdateSearch"
    />
  </div>
</template>
<style lang="less">
:deep(.blog) {
  border-radius: 8px;
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 设置显示两行 */
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-popover {
  min-width: unset !important; /* 修改最小宽度为 70px */
}

.edit-hover:hover {
  color: #409eff;
}

.edit-hover-del:hover {
  color: #f56c6c;
}

.count-hover:hover {
  color: #409eff;
}
</style>
