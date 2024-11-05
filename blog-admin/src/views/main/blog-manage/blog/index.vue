<script lang="ts" setup>
import Category from './component/Category.vue'
import Blog from './component/Blog.vue'
import { Row } from '@/api/blog/blog'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const delItem = ref({} as Row)
const onUpdateCategory = (item: Row) => {
  Object.assign(delItem.value, item)
}
</script>
<template>
  <Category :del-item="delItem" />
  <Blog @update-category="onUpdateCategory" />
  <ElPopover
    placement="top"
    effect="dark"
    content="新建博客"
    :width="85"
    popper-class="custom-popover"
  >
    <template #reference>
      <div
        class="fixed w-[50px] h-[50px] bg-[#409eff] rounded-[50%] right-[40px] bottom-[50px] flex items-center justify-center cursor-pointer"
        @click="
          router.push({
            name: 'blog-manage-blog-add'
          })
        "
      >
        <span class="text-[25px] text-white">+</span>
      </div>
    </template>
  </ElPopover>
</template>
<style lang="less">
.custom-popover {
  min-width: unset !important; /* 修改最小宽度为 70px */
}
</style>
