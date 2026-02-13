---
name: data-fetching
description: useFetch, useAsyncData, and $fetch for SSR-friendly data fetching
---

# 数据获取

Nuxt 提供面向 SSR 的数据获取组合式，可避免重复请求并处理水合。

## 概述

- `$fetch` - 基础请求工具（用于客户端事件）
- `useFetch` - 围绕 $fetch 的 SSR 安全封装（用于组件数据）
- `useAsyncData` - 任意异步函数的 SSR 安全封装

## useFetch

组件中获取数据的主要组合式：

```vue
<script setup lang="ts">
const { data, status, error, refresh, clear } = await useFetch('/api/posts')
</script>

<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <article v-for="post in data" :key="post.id">
      {{ post.title }}
    </article>
  </div>
</template>
```

### 带选项

```ts
const { data } = await useFetch('/api/posts', {
  // 查询参数
  query: { page: 1, limit: 10 },
  // 请求体（用于 POST/PUT）
  body: { title: 'New Post' },
  // HTTP 方法
  method: 'POST',
  // 仅选取特定字段
  pick: ['id', 'title'],
  // 转换响应
  transform: (posts) => posts.map(p => ({ ...p, slug: slugify(p.title) })),
  // 自定义缓存键
  key: 'posts-list',
  // 不在服务端请求
  server: false,
  // 不阻塞导航
  lazy: true,
  // 不立即请求
  immediate: false,
  // 默认值
  default: () => [],
})
```

### Reactive Parameters

```vue
<script setup lang="ts">
const page = ref(1)
const { data } = await useFetch('/api/posts', {
  query: { page }, // Automatically refetches when page changes
})
</script>
```

### Computed URL

```vue
<script setup lang="ts">
const id = ref(1)
const { data } = await useFetch(() => `/api/posts/${id.value}`)
// Refetches when id changes
</script>
```

## useAsyncData

用于封装任意异步函数：

```vue
<script setup lang="ts">
const { data, error } = await useAsyncData('user', () => {
  return myCustomFetch('/user/profile')
})
</script>
```

### 多个请求

```vue
<script setup lang="ts">
const { data } = await useAsyncData('cart', async () => {
  const [coupons, offers] = await Promise.all([
    $fetch('/api/coupons'),
    $fetch('/api/offers'),
  ])
  return { coupons, offers }
})
</script>
```

## $fetch

用于客户端事件（表单提交、按钮点击）：

```vue
<script setup lang="ts">
async function submitForm() {
  const result = await $fetch('/api/submit', {
    method: 'POST',
    body: { name: 'John' },
  })
}
</script>
```

**重要**：不要在 setup 中单独用 `$fetch` 获取初始数据，会请求两次（服务端+客户端）。请使用 `useFetch` 或 `useAsyncData`。

## 返回值

所有组合式返回：

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Ref<T>` | 获取的数据 |
| `error` | `Ref<Error>` | 请求失败时的错误 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'error'>` | 请求状态 |
| `refresh` | `() => Promise` | 重新请求数据 |
| `execute` | `() => Promise` | refresh 的别名 |
| `clear` | `() => void` | 重置数据和错误 |

## 懒加载请求

不阻塞导航：

```vue
<script setup lang="ts">
// 使用 lazy 选项
const { data, status } = await useFetch('/api/posts', { lazy: true })

// 或使用懒加载变体
const { data, status } = await useLazyFetch('/api/posts')
const { data, status } = await useLazyAsyncData('key', fetchFn)
</script>
```

## 刷新与监听

```vue
<script setup lang="ts">
const category = ref('tech')

const { data, refresh } = await useFetch('/api/posts', {
  query: { category },
  // category 变化时自动刷新
  watch: [category],
})

// 手动刷新
const refreshData = () => refresh()
</script>
```

## 缓存

数据按键缓存。在组件间共享数据：

```vue
<script setup lang="ts">
// 在组件 A 中
const { data } = await useFetch('/api/user', { key: 'current-user' })

// 在组件 B 中 - 使用缓存数据
const { data } = useNuxtData('current-user')
</script>
```

全局刷新缓存数据：

```ts
// 刷新指定键
await refreshNuxtData('current-user')

// 刷新全部数据
await refreshNuxtData()

// 清除缓存数据
clearNuxtData('current-user')
```

## 拦截器

```ts
const { data } = await useFetch('/api/auth', {
  onRequest({ options }) {
    options.headers.set('Authorization', `Bearer ${token}`)
  },
  onRequestError({ error }) {
    console.error('Request failed:', error)
  },
  onResponse({ response }) {
    // Process response
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      navigateTo('/login')
    }
  },
})
```

## 传递请求头（SSR）

`useFetch` 会自动将 cookies/headers 从客户端代理到服务端。对于 `$fetch`：

```vue
<script setup lang="ts">
const headers = useRequestHeaders(['cookie'])
const data = await $fetch('/api/user', { headers })
</script>
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/data-fetching
- https://nuxt.com/docs/api/composables/use-fetch
- https://nuxt.com/docs/api/composables/use-async-data
-->
