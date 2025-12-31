<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">优化方案库</h1>
    
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="solution in solutions"
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
        <p class="text-sm text-gray-500 mb-2">{{ solution.category }}</p>
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

<script setup lang="ts">
const { solutions, fetchSolutions, loading } = useSolutions()

onMounted(async () => {
  await fetchSolutions()
})

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
  title: '优化方案库 - 性能优化平台'
})
</script>

