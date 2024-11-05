<script lang="ts" setup>
import {
  DeviceOrvisitAndCount,
  getHomeInfo,
  getHomeIpInfo,
  homeInfo,
  postDeviceOrvisitAndCount,
  postVisitCount
} from '@/api/home'

import { seriesDataF } from '@/components/echarts/MapChart.vue'
import HeaderCount from './component/HeaderCount.vue'

import { showLoading } from '@/shared/loading'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const info = ref<homeInfo>({} as homeInfo)

const visitData = ref({
  visitType: 'past_week',
  times: [],
  dates: []
})

const deviceData = ref({
  type: 'past_week',
  info: {} as DeviceOrvisitAndCount
})

const getHomeInfoApi = async () => {
  try {
    const res = await getHomeInfo()
    Object.assign(info.value, res.data)
  } catch (err) {
    console.log(err)
  }
}

const postVisitCountApi = async () => {
  try {
    const res = await postVisitCount(visitData.value.visitType)
    visitData.value.times = res.data.times?.map((s: any) =>
      s?.replace(new Date().getFullYear().toString() + '-', '')
    )
    visitData.value.dates = res.data.visitCounts
  } catch (err) {
    console.log(err)
  }
}

const ipInfo = ref([] as seriesDataF[])
const getHomeIpInfoApi = async () => {
  try {
    const res = await getHomeIpInfo()
    const data = res.data
    ipInfo.value = data?.reduce(
      (
        acc: { name: any; value: any; count: number }[],
        item: { name: any; value: any }
      ): any => {
        const existingItem = acc?.find(
          (i: { name: any }) => i.name === item.name
        )
        if (existingItem) {
          existingItem.count++
        } else {
          acc.push({ name: item.name, value: item.value, count: 1 })
        }
        return acc
      },
      []
    )
  } catch (err) {}
}

const postDeviceOrvisitAndCountApi = async () => {
  try {
    const res = await postDeviceOrvisitAndCount(deviceData.value.type)
    Object.assign(deviceData.value.info, res.data)
  } catch (err) {
    console.log(err)
  }
}

const onVisitChange = (e: any) => {
  visitData.value.visitType = e
  postVisitCountApi()
}

const onDateChange = (e: any) => {
  deviceData.value.type = e
  postDeviceOrvisitAndCountApi()
}

const init = async () => {
  showLoading(true)
  await getHomeInfoApi()
  await postVisitCountApi()
  await getHomeIpInfoApi()
  await postDeviceOrvisitAndCountApi()
  showLoading(false)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  showLoading(false)
})
</script>
<template>
  <div class="m-[10px]">
    <HeaderCount :info="info" />

    <!-- 访问量 -->
    <div class="mt-[24px] flex flex-wrap gap-4">
      <ElCard class="chart_decorate card-box">
        <template #header>
          <span>访问量</span>
          <ElRadioGroup
            v-model="visitData.visitType"
            is-button
            @change="onVisitChange"
          >
            <ElRadioButton value="past_week">近一周</ElRadioButton>
            <ElRadioButton value="past_month">近一月</ElRadioButton>
          </ElRadioGroup>
        </template>
        <LineChart
          width="100%"
          :seriesData="visitData.dates"
          :xAxisData="visitData.times"
        />
      </ElCard>
      <ElCard class="chart_decorate card-box">
        <template #header>
          <span>访客来源</span>
        </template>
        <MapChart
          width="100%"
          :series-data="ipInfo"
        />
      </ElCard>
      <ElCard class="chart_decorate card-box">
        <template #header>
          <span>数据监测</span>
          <ElRadioGroup
            v-model="deviceData.type"
            is-button
            @change="onDateChange"
          >
            <ElRadioButton value="past_week">近一周</ElRadioButton>
            <ElRadioButton value="past_month">近一月</ElRadioButton>
          </ElRadioGroup>
        </template>
        <div class="flex items-center flex-wrap justify-around">
          <PieChart
            text="访问总数"
            :height="250"
            :width="250"
            :total="deviceData.info.visitInfo?.total"
            :series-data="deviceData.info.visitInfo?.group"
          />
          <PieChart
            text="设备总数"
            :height="250"
            :width="250"
            :total="deviceData.info.deviceInfo?.total"
            :series-data="deviceData.info.deviceInfo?.group"
          />
        </div>
      </ElCard>

      <ElCard class="card-box">
        <template #header>
          <span>评论</span>
        </template>
        <PieChart
          text="设备总数"
          :height="250"
          class="inline-block"
        />
      </ElCard>
    </div>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-radio-group) {
  background: #f0f0f1;
  border-radius: 8px;
  padding: 4px;
  .el-radio-button {
    &__inner {
      background: none;
      border: none;
      border-radius: 6px;
    }
  }
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background: #409eff;
  }
}

:deep(.chart_decorate) {
  .el-card {
    &__body {
      padding: 0;
    }
    &__header {
      height: 62px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.card-box {
  flex-grow: 1;
  flex-basis: 40%;
}

@media (max-width: 768px) {
  .card-box {
    flex-basis: 80%; /* 小屏幕上每行 2 个格子 */
  }
}
</style>
