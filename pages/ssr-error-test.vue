<template>
  <div class="max-w-2xl mx-auto p-8 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">CSR 降级测试页</h1>
    <p class="text-gray-600">
      若你看到本页，说明 SSR 报错后已成功降级为客户端渲染。
    </p>
    <NuxtLink to="/" class="mt-6 inline-block text-blue-600 hover:underline">返回首页</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// 仅在服务端执行时抛错，用于验证 server/plugins/csr-fallback 的降级逻辑
if (import.meta.server) {
  throw new Error('SSR_ERROR_TEST: 模拟服务端渲染失败')
}
</script>
