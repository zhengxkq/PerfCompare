<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">核心性能指标对比</h3>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              指标
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              优化前
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              优化后
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              改进
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="metric in coreMetrics" :key="metric.key">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ metric.label }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatValue(comparison.baseline[metric.key as keyof typeof comparison.baseline] as number, metric.unit) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatValue(comparison.optimized[metric.key as keyof typeof comparison.optimized] as number, metric.unit) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="[
                'font-medium',
                comparison.improvement[metric.key] > 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ comparison.improvement[metric.key] > 0 ? '+' : '' }}{{ comparison.improvement[metric.key] }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="mt-6">
      <h4 class="text-md font-semibold mb-3">资源指标</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="resource in resourceMetrics" :key="resource.key" class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">{{ resource.label }}</div>
          <div class="text-lg font-semibold mt-1">
            {{ formatValue(comparison.optimized[resource.key as keyof typeof comparison.optimized] as number, resource.unit) }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            改进: <span :class="comparison.improvement[resource.key] > 0 ? 'text-green-600' : 'text-red-600'">
              {{ comparison.improvement[resource.key] > 0 ? '+' : '' }}{{ comparison.improvement[resource.key] }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComparisonData } from '~/types'

const props = defineProps<{
  comparison: ComparisonData
}>()

const coreMetrics = [
  { key: 'lcp', label: 'LCP (最大内容绘制)', unit: 'ms' },
  { key: 'fcp', label: 'FCP (首次内容绘制)', unit: 'ms' },
  { key: 'fid', label: 'FID (首次输入延迟)', unit: 'ms' },
  { key: 'cls', label: 'CLS (累积布局偏移)', unit: '' },
  { key: 'ttfb', label: 'TTFB (首字节时间)', unit: 'ms' },
  { key: 'tti', label: 'TTI (可交互时间)', unit: 'ms' }
]

const resourceMetrics = [
  { key: 'totalSize', label: '页面总大小', unit: 'KB' },
  { key: 'requestCount', label: '请求数', unit: '' },
  { key: 'jsSize', label: 'JS体积', unit: 'KB' },
  { key: 'cssSize', label: 'CSS体积', unit: 'KB' }
]

const formatValue = (value: number, unit: string): string => {
  if (unit === 'ms') {
    return `${Math.round(value)}ms`
  } else if (unit === 'KB') {
    return `${Math.round(value)}KB`
  } else {
    return value.toFixed(2)
  }
}
</script>

