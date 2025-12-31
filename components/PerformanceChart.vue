<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import type { PerformanceMetrics } from '~/types'

let ChartJS: any = null
let chartInstance: any = null

const props = defineProps<{
  baseline: PerformanceMetrics
  optimized: PerformanceMetrics
  title?: string
  metrics?: string[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)

const defaultMetrics = ['lcp', 'fcp', 'fid', 'cls', 'ttfb', 'tti']
const metrics = computed(() => props.metrics || defaultMetrics)

const getChartData = () => {
  const metricList = metrics.value
  return {
    labels: metricList.map(m => m.toUpperCase()),
    datasets: [
      {
        label: '优化前',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        data: metricList.map(m => {
          const value = props.baseline[m as keyof PerformanceMetrics] as number
          // 标准化显示（毫秒转秒，或保持原值）
          return m === 'cls' ? value * 100 : value
        })
      },
      {
        label: '优化后',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        data: metricList.map(m => {
          const value = props.optimized[m as keyof PerformanceMetrics] as number
          return m === 'cls' ? value * 100 : value
        })
      }
    ]
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const initChart = async () => {
  if (!process.client || !chartCanvas.value) return
  
  // 客户端动态导入Chart.js
  const chartModule = await import('chart.js')
  ChartJS = chartModule.Chart
  const {
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
  } = chartModule
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  const ctx = chartCanvas.value.getContext('2d')
  if (ctx && ChartJS) {
    // 如果已存在实例，先销毁
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    chartInstance = new ChartJS(ctx, {
      type: 'bar',
      data: getChartData(),
      options: chartOptions
    })
  }
}

onMounted(() => {
  // 延迟初始化，确保DOM已渲染
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

watch(() => [props.baseline, props.optimized], async () => {
  if (!chartInstance && process.client && chartCanvas.value) {
    await initChart()
    return
  }
  
  if (chartInstance) {
    const metricList = metrics.value
    chartInstance.data.labels = metricList.map(m => m.toUpperCase())
    chartInstance.data.datasets[0].data = metricList.map(m => {
      const value = props.baseline[m as keyof PerformanceMetrics] as number
      return m === 'cls' ? value * 100 : value
    })
    chartInstance.data.datasets[1].data = metricList.map(m => {
      const value = props.optimized[m as keyof PerformanceMetrics] as number
      return m === 'cls' ? value * 100 : value
    })
    chartInstance.update()
  }
}, { deep: true, immediate: false })
</script>

