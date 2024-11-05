<script setup lang="ts">
import echarts, { ECOption } from '@/shared/echarts'
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import chinaMap from './custom.geo.json'

export type seriesDataF = {
  name: string
  value: number[]
  count: number
}

const props = defineProps({
  width: {
    type: [Number, String],
    default: 300
  },
  height: {
    type: [Number, String],
    default: 300
  },
  seriesData: {
    type: Array as PropType<seriesDataF[]> as any[],
    default: []
  }
  // xAxisData: {
  //   type: Array as PropType<any[]>,
  //   default: []
  // }
})

const chartRef = ref()

function init() {
  echarts.registerMap('china', chinaMap as any)
  if (echarts.getInstanceByDom(chartRef.value!)) {
    echarts.getInstanceByDom(chartRef.value!)?.dispose()
  }
  const myChart = echarts.init(chartRef.value)
  const option: ECOption = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return params.name + '<br>' + '人数：' + params.data.count
      }
    },
    geo: {
      map: 'china',
      roam: false,
      center: [105, 35],
      zoom: 1.6
    },
    series: [
      {
        name: '城市坐标',
        type: 'scatter', // 使用 scatter 类型来显示坐标点
        coordinateSystem: 'geo', // 使用 geo 坐标系
        symbolSize: 10, // 标记大小
        label: {
          show: true,
          formatter: '{b}', // 显示城市名称
          position: 'right'
        },
        itemStyle: {
          color: 'red' // 标记颜色
        },
        data: props.seriesData
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener('resize', function () {
    if (!myChart.isDisposed()) {
      myChart.resize()
    }
  })
}

watch(
  () => props.seriesData,
  () => {
    init()
  }
)
onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  const myChart = echarts.getInstanceByDom(chartRef.value!)
  if (myChart) {
    window.removeEventListener('resize', function () {
      myChart.resize()
    })
    myChart.dispose()
  }
})
</script>
<template>
  <div
    ref="chartRef"
    :style="{
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      height:
        typeof props.height === 'number' ? props.height + 'px' : props.height
    }"
  ></div>
</template>
<style lang="less" scoped></style>
