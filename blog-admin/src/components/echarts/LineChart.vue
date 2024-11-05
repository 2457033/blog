<script setup lang="ts">
import echarts, { ECOption } from '@/shared/echarts'
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'

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
    type: Array as PropType<number[]>,
    default: []
  },
  xAxisData: {
    type: Array as PropType<any[]>,
    default: []
  }
})

const chartRef = ref()

function init() {
  if (echarts.getInstanceByDom(chartRef.value!)) {
    echarts.getInstanceByDom(chartRef.value!)?.dispose()
  }
  const myChart = echarts.init(chartRef.value!)
  const option: ECOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: props.seriesData,
        type: 'line',
        smooth: true
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
  () => [props.seriesData, props.xAxisData],
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
