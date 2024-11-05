<script setup lang="ts">
import { homeInfo } from '@/api/home'
import { PropType } from 'vue'

const props = defineProps({
  info: {
    type: Object as PropType<homeInfo>,
    default: () => {}
  }
})
</script>
<template>
  <div class="flex flex-wrap gap-4">
    <ElCard class="box-card crad-user h-[118px]">
      <div
        style="color: #1e2025b8"
        class="text-[14px]"
      >
        用户数量
      </div>
      <div class="text-[32px] mt-[10px] text-[#1E2025]">
        {{
          props.info.usersCount !== undefined && props.info.usersCount !== null
            ? props.info.usersCount
            : '--'
        }}
      </div>
    </ElCard>
    <ElCard class="box-card crad-file h-[118px]">
      <div
        style="color: #ffffffb8"
        class="text-white text-[14px]"
      >
        本地文件
      </div>
      <div class="text-[32px] mt-[10px] text-white">
        {{
          props.info.fileSize !== undefined && props.info.fileSize !== null
            ? props.info.fileSize + 'M'
            : '--'
        }}
      </div>
    </ElCard>
    <ElCard class="box-card crad-blog h-[118px]">
      <div
        style="color: #1e2025b8"
        class="text-white text-[14px]"
      >
        博客文章
      </div>
      <div class="text-[32px] mt-[10px] text-[#1e2025]">
        {{
          props.info.blogsCount !== undefined && props.info.blogsCount !== null
            ? props.info.blogsCount
            : '--'
        }}
      </div>
    </ElCard>
    <ElCard class="box-card crad-blog h-[118px]">
      <div
        style="color: #1e2025b8"
        class="text-white text-[14px]"
      >
        博客文章
      </div>
      <div class="text-[32px] mt-[10px] text-[#1e2025]">
        {{
          props.info.blogsCount !== undefined && props.info.blogsCount !== null
            ? props.info.blogsCount
            : '--'
        }}
      </div>
    </ElCard>
  </div>
</template>
<style lang="less" scoped>
:deep(.crad-user) {
  background: linear-gradient(180deg, #00c9f529 0%, #00c9f53d 100%);
}

:deep(.crad-file) {
  background: linear-gradient(180deg, #2b5aedcc 0%, #2b5aed 100%);
}

:deep(.crad-blog) {
  background: linear-gradient(180deg, #ff600829 0%, #ff60083d 100%);
}

:deep(.el-card) {
  border-radius: 8px;
}
.box-card {
  flex-basis: 20%;
  flex-grow: 1;
}

@media (min-width: 768px) {
  .box-card {
    flex-basis: 20%; /* 小屏幕上每行 2 个格子 */
  }
}

@media (min-width: 480px) and (max-width: 768px) {
  .box-card {
    flex-basis: 40%; /* 小屏幕上每行 2 个格子 */
  }
}

@media (max-width: 480px) {
  .box-card {
    flex-basis: 80%; /* 更小的屏幕上每行 1 个格子 */
  }
}
</style>
