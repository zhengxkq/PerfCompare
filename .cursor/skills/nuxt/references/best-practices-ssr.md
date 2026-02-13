---
name: ssr-best-practices
description: Avoiding SSR context leaks, hydration mismatches, and proper composable usage
---

# SSR 最佳实践

避免常见 SSR 陷阱的模式：上下文泄漏、水合不匹配、组合式错误。

## 「Nuxt 实例不可用」错误

在正确上下文之外调用 Nuxt 组合式时会发生此错误。

### ❌ 错误：在 setup 外调用组合式

```ts
// composables/bad.ts
// 在模块级别调用，无 Nuxt 上下文！
const config = useRuntimeConfig()

export function useMyComposable() {
  return config.public.apiBase
}
```

### ✅ 正确：在函数内调用组合式

```ts
// composables/good.ts
export function useMyComposable() {
  // 在组合式内部调用，有上下文
  const config = useRuntimeConfig()
  return config.public.apiBase
}
```

### 组合式的有效上下文

Nuxt 组合式可在以下位置使用：
- `<script setup>` blocks
- `setup()` function
- `defineNuxtPlugin()` callbacks
- `defineNuxtRouteMiddleware()` callbacks

```ts
// ✅ 插件
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig() // Works
})

// ✅ 中间件
export default defineNuxtRouteMiddleware(() => {
  const route = useRoute() // Works
})
```

## 避免请求间状态泄漏

### ❌ 错误：模块级状态

```ts
// composables/bad.ts
// 该状态在服务端所有请求间共享！
const globalState = ref({ user: null })

export function useUser() {
  return globalState
}
```

### ✅ Correct: Use useState

```ts
// composables/good.ts
export function useUser() {
  // useState 创建请求隔离的状态
  return useState('user', () => ({ user: null }))
}
```

### 为何重要

在服务端，模块级状态在请求间持久存在，会导致：
- 用户间数据泄漏
- 安全漏洞
- 内存泄漏

## 防止水合不匹配

当服务端 HTML 与客户端渲染不一致时会发生水合不匹配。

### ❌ 错误：在 setup 中使用浏览器 API

```vue
<script setup>
// 服务端没有 localStorage！
const theme = localStorage.getItem('theme') || 'light'
</script>
```

### ✅ 正确：使用 SSR 安全替代

```vue
<script setup>
// useCookie 在服务端和客户端均可用
const theme = useCookie('theme', { default: () => 'light' })
</script>
```

### ❌ 错误：随机/基于时间的值

```vue
<template>
  <div>{{ Math.random() }}</div>
  <div>{{ new Date().toLocaleTimeString() }}</div>
</template>
```

### ✅ 正确：用 useState 保证一致性

```vue
<script setup>
// 值在服务端生成一次，客户端水合
const randomValue = useState('random', () => Math.random())
</script>

<template>
  <div>{{ randomValue }}</div>
</template>
```

### ❌ 错误：基于客户端状态的条件渲染

```vue
<template>
  <!-- 服务端没有 window -->
  <div v-if="window?.innerWidth > 768">Desktop</div>
</template>
```

### ✅ 正确：使用 CSS 或 ClientOnly

```vue
<template>
  <!-- CSS 媒体查询在两端都可用 -->
  <div class="hidden md:block">Desktop</div>
  <div class="md:hidden">Mobile</div>

  <!-- 或对依赖 JS 的渲染使用 ClientOnly -->
  <ClientOnly>
    <ResponsiveComponent />
    <template #fallback>Loading...</template>
  </ClientOnly>
</template>
```

## 仅浏览器代码

### 使用 `import.meta.client`

```vue
<script setup>
if (import.meta.client) {
  // 仅在浏览器中运行
  window.addEventListener('scroll', handleScroll)
}
</script>
```

### 用 `onMounted` 访问 DOM

```vue
<script setup>
const el = ref<HTMLElement>()

onMounted(() => {
  // 安全 - 仅在水合后于客户端运行
  el.value?.focus()
  initThirdPartyLib()
})
</script>
```

### 浏览器库的动态导入

```vue
<script setup>
onMounted(async () => {
  const { Chart } = await import('chart.js')
  new Chart(canvas.value, config)
})
</script>
```

## 仅服务端代码

### 使用 `import.meta.server`

```vue
<script setup>
if (import.meta.server) {
  // Only runs on server
  const secrets = useRuntimeConfig().apiSecret
}
</script>
```

### 服务端组件

```vue
<!-- components/ServerData.server.vue -->
<script setup>
// 整个组件仅在服务端运行
const data = await fetchSensitiveData()
</script>

<template>
  <div>{{ data }}</div>
</template>
```

## 异步组合式模式

### ❌ 错误：在组合式前 await

```vue
<script setup>
await someAsyncOperation()
const route = useRoute() // 可能失败 - await 后上下文丢失
</script>
```

### ✅ 正确：先获取上下文

```vue
<script setup>
// 在任何 await 前获取所有组合式
const route = useRoute()
const config = useRuntimeConfig()

await someAsyncOperation()
// 现在可安全使用 route 和 config
</script>
```

## 插件最佳实践

### 仅客户端插件

```ts
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // 仅在客户端运行
  initAnalytics()
})
```

### 仅服务端插件

```ts
// plugins/server-init.server.ts
export default defineNuxtPlugin(() => {
  // Only runs on server
  initServerConnections()
})
```

### Provide/Inject 模式

```ts
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = createApiClient()

  return {
    provide: {
      api,
    },
  }
})
```

```vue
<script setup>
const { $api } = useNuxtApp()
const data = await $api.get('/users')
</script>
```

## 第三方库集成

### ❌ 错误：顶层导入

```vue
<script setup>
import SomeLibrary from 'browser-only-lib' // 破坏 SSR
</script>
```

### ✅ 正确：动态导入

```vue
<script setup>
let library: typeof import('browser-only-lib')

onMounted(async () => {
  library = await import('browser-only-lib')
  library.init()
})
</script>
```

### 使用 ClientOnly 组件

```vue
<template>
  <ClientOnly>
    <BrowserOnlyComponent />
    <template #fallback>
      <div class="skeleton">Loading...</div>
    </template>
  </ClientOnly>
</template>
```

## 调试 SSR 问题

### 检查渲染上下文

```vue
<script setup>
console.log('Server:', import.meta.server)
console.log('Client:', import.meta.client)
</script>
```

### 使用 Nuxt DevTools

DevTools 显示 payload 数据和水合状态。

### 常见错误信息

| Error | Cause |
|-------|-------|
| "Nuxt instance unavailable" | 在 setup 上下文外调用组合式 |
| "Hydration mismatch" | 服务端/客户端 HTML 不一致 |
| "window is not defined" | SSR 期间使用了浏览器 API |
| "document is not defined" | SSR 期间访问了 DOM |

<!-- 
Source references:
- https://nuxt.com/docs/guide/concepts/auto-imports#vue-and-nuxt-composables
- https://nuxt.com/docs/guide/best-practices/hydration
- https://nuxt.com/docs/getting-started/state-management#best-practices
-->
