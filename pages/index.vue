<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>
    
    <template v-else>
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          前端性能优化场景化对比与决策平台
        </h1>
        <p class="text-gray-600">
          通过模拟真实场景，量化展示各优化方案的效果差异，为开发团队提供数据驱动的优化方案选型依据
        </p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="text-sm text-gray-600">优化方案总数</div>
        <div class="text-2xl font-bold mt-1">{{ solutions.length }}</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-600">方案分类</div>
        <div class="text-2xl font-bold mt-1">{{ categories.length }}</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-600">核心指标</div>
        <div class="text-2xl font-bold mt-1">8</div>
      </div>
      <div class="card">
        <div class="text-sm text-gray-600">场景配置</div>
        <div class="text-2xl font-bold mt-1">12</div>
      </div>
    </div>
    
    <!-- 按分类展示方案 -->
    <div v-for="category in categories" :key="category" class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ category }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="solution in getSolutionsByCategory(category)"
          :key="solution.id"
          :to="`/solutions/${solution.id}`"
          class="card hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ solution.name }}</h3>
            <span :class="[
              'px-2 py-1 rounded text-xs font-medium',
              getCostClass(solution.implementationCost)
            ]">
              {{ getCostLabel(solution.implementationCost) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ solution.description }}</p>
          <div class="flex items-center text-blue-600 text-sm font-medium">
            查看详情
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </NuxtLink>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { solutionsDataFallback } from '~/composables/useSolutions'
import type { OptimizationSolution } from '~/types'

// 服务端用 useAsyncData 拉取，首屏 HTML 即包含完整列表（完整 SSR）
const { data: solutionsData, pending } = await useAsyncData(
  'index-solutions',
  async () => {
    try {
      const data = await $fetch<OptimizationSolution[]>('/api/solutions')
      return (data?.length ?? 0) > 0 ? data : solutionsDataFallback
    } catch {
      return solutionsDataFallback
    }
  }
)

const solutions = computed(() => solutionsData.value ?? [])
const categories = computed(() =>
  Array.from(new Set(solutions.value.map((s) => s.category)))
)
const getSolutionsByCategory = (category: string) =>
  solutions.value.filter((s) => s.category === category)
const loading = computed(() => pending.value)

const getCostLabel = (cost: string) => {
  const labels: Record<string, string> = {
    low: '低成本',
    medium: '中成本',
    high: '高成本'
  }
  return labels[cost] || cost
}

const getCostClass = (cost: string) => {
  const classes: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[cost] || 'bg-gray-100 text-gray-800'
}

useHead({
  title: '性能优化平台 - 总览'
})
</script>

