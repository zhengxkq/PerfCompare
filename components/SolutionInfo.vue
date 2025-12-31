<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">{{ solution.name }}</h3>
    
    <div class="space-y-6">
      <!-- 原理说明 -->
      <div>
        <h4 class="text-md font-semibold mb-2">原理说明</h4>
        <p class="text-gray-700 text-sm leading-relaxed">{{ solution.principle }}</p>
      </div>
      
      <!-- 实施成本 -->
      <div>
        <h4 class="text-md font-semibold mb-2">实施成本</h4>
        <span :class="[
          'inline-block px-3 py-1 rounded-full text-sm font-medium',
          costClass
        ]">
          {{ costLabel }}
        </span>
      </div>
      
      <!-- 适用场景 -->
      <div>
        <h4 class="text-md font-semibold mb-2">适用场景</h4>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li v-for="scenario in solution.applicableScenarios" :key="scenario">
            {{ scenario }}
          </li>
        </ul>
      </div>
      
      <!-- 代码示例 -->
      <div>
        <h4 class="text-md font-semibold mb-2">代码示例</h4>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{{ solution.codeExample }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OptimizationSolution } from '~/types'
import { computed } from 'vue'

const props = defineProps<{
  solution: OptimizationSolution
}>()

const costLabel = computed(() => {
  const labels = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return labels[props.solution.implementationCost]
})

const costClass = computed(() => {
  const classes = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[props.solution.implementationCost]
})
</script>

