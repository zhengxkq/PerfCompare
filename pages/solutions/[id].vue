<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>
    
    <div v-else-if="!solution" class="text-center py-12">
      <p class="text-gray-600">未找到该优化方案</p>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">
        返回首页
      </NuxtLink>
    </div>
    
    <div v-else>
      <!-- 页面标题 -->
      <div class="mb-8">
        <NuxtLink to="/" class="text-blue-600 hover:underline mb-4 inline-block">
          ← 返回总览
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ solution.name }}</h1>
        <p class="text-gray-600">{{ solution.description }}</p>
      </div>
      
      <!-- 场景控制面板 - 全宽显示 -->
      <div class="mb-6">
        <ScenarioControlPanel />
      </div>
      
      <!-- 对比数据 - 两列布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 性能对比图表 -->
        <div class="lg:col-span-1">
          <PerformanceChart
            v-if="comparison"
            :baseline="comparison.baseline"
            :optimized="comparison.optimized"
            title="性能指标对比"
          />
        </div>
        
        <!-- 指标对比表格 -->
        <div class="lg:col-span-1">
          <MetricsComparison v-if="comparison" :comparison="comparison" />
        </div>
      </div>
      
      <!-- 方案说明 -->
      <div class="mt-6">
        <SolutionInfo :solution="solution" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { OptimizationSolution, ComparisonData } from '~/types'

const route = useRoute()
const { fetchSolutionById } = useSolutions()
const { scenario, getComparison } = usePerformance()

const loading = ref(true)
const solution = ref<OptimizationSolution | undefined>(undefined)
const comparison = ref<ComparisonData | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    
    // 先从API获取解决方案
    solution.value = await fetchSolutionById(id)
    
    if (solution.value) {
      comparison.value = await getComparison(solution.value)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 监听场景变化，重新加载数据
watch(scenario, (newScenario) => {
  console.log('scenario changed', newScenario)
  console.log('solution', solution.value)
  console.log('comparison', comparison.value)
  if (solution.value) {
    console.log('loading data')
    loadData()
  }
}, { deep: true })

useHead(() => ({
  title: solution.value ? `${solution.value.name} - 性能优化平台` : '优化方案详情'
}))
</script>

