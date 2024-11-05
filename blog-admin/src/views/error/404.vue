<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="main flex justify-center items-center">
    <ElCol
      :sm="12"
      :lg="6"
    >
      <ElResult
        icon="info"
        title="404"
      >
        <template #sub-title>
          <p>抱歉，无法找到该页面！！！</p>
        </template>
        <template #extra>
          <ElButton
            type="primary"
            @click="router.go(-1)"
          >
            返回上一页
          </ElButton>
        </template>
      </ElResult>
    </ElCol>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100vh;
  background-image: url('../../assets/404.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
