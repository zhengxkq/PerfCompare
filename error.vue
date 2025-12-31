<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ error.statusCode }}</h1>
      <p class="text-gray-600 mb-8">{{ error.statusMessage || '页面未找到' }}</p>
      <NuxtLink to="/" class="btn-primary">
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
  }
}>()
</script>

