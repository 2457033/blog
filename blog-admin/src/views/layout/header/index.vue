<script lang="ts" setup>
import { useSystemTool } from '@/pinia'
import { storeToRefs } from 'pinia'
import User from './User.vue'
import Breadcrumb from './Breadcrumb.vue'
import Tags from './Tags.vue'

const props = defineProps({
  screenWidth: {
    type: Number
  }
})

const systemToolStore = useSystemTool()

const { isCollapse } = storeToRefs(systemToolStore)

const collapseClick = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<template>
  <div class="w-full h-full flex flex-col">
    <div class="border-b w-full h-[70px] flex items-center">
      <div
        class="ml-2 cursor-pointer"
        @click="collapseClick"
      >
        <ElIcon :size="25">
          <Fold v-if="props.screenWidth! > 992 ? !isCollapse : isCollapse" />
          <Expand v-else />
        </ElIcon>
      </div>
      <Breadcrumb :screen-width="props.screenWidth!" />
      <User />
    </div>
    <div class="boxShow">
      <Tags />
    </div>
  </div>
</template>

<style lang="less" scoped>
.hight {
  font-weight: bold !important;
  cursor: pointer !important;
}

.boxShow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04) !important;
}
</style>
