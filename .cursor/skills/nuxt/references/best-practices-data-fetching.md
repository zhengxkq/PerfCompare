---
name: data-fetching-best-practices
description: Patterns and best practices for efficient data fetching in Nuxt
---

# 数据获取最佳实践

面向 SSR 友好、高性能 Nuxt 应用的有效数据获取模式。

## 选择合适的工具

| Scenario | Use |
|----------|-----|
| 组件初始数据 | `useFetch` 或 `useAsyncData` |
| 用户交互（点击、表单） | `$fetch` |
| 第三方 SDK/API | 带自定义函数的 `useAsyncData` |
| 多个并行请求 | 带 `Promise.all` 的 `useAsyncData` |

## await 与非 await 用法

`await` 关键字控制数据获取是否**阻塞导航**：

### 使用 `await` - 阻塞导航

```vue
<script setup lang="ts">
// Navigation waits until data is fetched (uses Vue Suspense)
const { data } = await useFetch('/api/posts')
// data.value is available immediately after this line
</script>
```

- **服务端**：获取数据并包含在 payload 中
- **客户端水合**：使用 payload 数据，无需重新请求
- **客户端导航**：阻塞直到数据就绪

### 不使用 `await` - 非阻塞（懒加载）

```vue
<script setup lang="ts">
// Navigation proceeds immediately, data fetches in background
const { data, status } = useFetch('/api/posts', { lazy: true })
// data.value may be undefined initially - check status!
</script>

<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else>{{ data }}</div>
</template>
```

等同于使用 `useLazyFetch`：

```vue
<script setup lang="ts">
const { data, status } = useLazyFetch('/api/posts')
</script>
```

### 何时使用哪种

| Pattern | Use Case |
|---------|----------|
| `await useFetch()` | SEO/首屏渲染所需的关键数据 |
| `useFetch({ lazy: true })` | 非关键数据，更好的感知性能 |
| `await useLazyFetch()` | 与 lazy 相同，await 仅确保初始化 |

## 避免重复请求

### ❌ 错误：在 setup 中单独使用 $fetch

```vue
<script setup lang="ts">
// 会请求两次：服务端一次，客户端一次
const data = await $fetch('/api/posts')
</script>
```

### ✅ 正确：使用 useFetch

```vue
<script setup lang="ts">
// 服务端请求，客户端水合（无重复请求）
const { data } = await useFetch('/api/posts')
</script>
```

## 使用显式缓存键

### ❌ 避免：自动生成的键

```vue
<script setup lang="ts">
// 键由文件/行号自动生成，可能引发问题
const { data } = await useAsyncData(() => fetchPosts())
</script>
```

### ✅ 更好：显式键

```vue
<script setup lang="ts">
// 显式键以实现可预测的缓存
const { data } = await useAsyncData(
  'posts',
  () => fetchPosts(),
)

// 参数化数据的动态键
const route = useRoute()
const { data: post } = await useAsyncData(
  `post-${route.params.id}`,
  () => fetchPost(route.params.id),
)
</script>
```

## 正确处理加载状态

```vue
<script setup lang="ts">
const { data, status, error } = await useFetch('/api/posts')
</script>

<template>
  <div v-if="status === 'pending'">
    <SkeletonLoader />
  </div>
  <div v-else-if="error">
    <ErrorMessage :error="error" />
  </div>
  <div v-else>
    <PostList :posts="data" />
  </div>
</template>
```

## 对非关键数据使用懒加载

```vue
<script setup lang="ts">
const id = useRoute().params.id

// 关键数据 - 阻塞导航
const { data: post } = await useFetch(`/api/posts/${id}`)

// 非关键数据 - 不阻塞导航
const { data: comments, status } = useFetch(`/api/posts/${id}/comments`, {
  lazy: true,
})

// 或使用 useLazyFetch
const { data: related } = useLazyFetch(`/api/posts/${id}/related`)
</script>

<template>
  <article>
    <h1>{{ post?.title }}</h1>
    <p>{{ post?.content }}</p>
  </article>

  <section v-if="status === 'pending'">Loading comments...</section>
  <CommentList v-else :comments="comments" />
</template>
```

## 缩小 Payload 体积

### 用 `pick` 做简单过滤

```vue
<script setup lang="ts">
const { data } = await useFetch('/api/users', {
  // 仅将以下字段包含在 payload 中
  pick: ['id', 'name', 'avatar'],
})
</script>
```

### 用 `transform` 做复杂转换

```vue
<script setup lang="ts">
const { data } = await useFetch('/api/posts', {
  transform: (posts) => {
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.content.slice(0, 100),
      date: new Date(post.createdAt).toLocaleDateString(),
    }))
  },
})
</script>
```

## 并行请求

### 用 useAsyncData 获取独立数据

```vue
<script setup lang="ts">
const { data } = await useAsyncData(
  'dashboard',
  async (_nuxtApp, { signal }) => {
    const [user, posts, stats] = await Promise.all([
      $fetch('/api/user', { signal }),
      $fetch('/api/posts', { signal }),
      $fetch('/api/stats', { signal }),
    ])
    return { user, posts, stats }
  },
)
</script>
```

### 多个 useFetch 调用

```vue
<script setup lang="ts">
// 这些会自动并行执行
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
])
</script>
```

## 高效刷新模式

### 监听响应式依赖

```vue
<script setup lang="ts">
const page = ref(1)
const category = ref('all')

const { data } = await useFetch('/api/posts', {
  query: { page, category },
  // 这些变化时自动刷新
  watch: [page, category],
})
</script>
```

### 手动刷新

```vue
<script setup lang="ts">
const { data, refresh, status } = await useFetch('/api/posts')

async function refreshPosts() {
  await refresh()
}
</script>
```

### 条件请求

```vue
<script setup lang="ts">
const userId = ref<string | null>(null)

const { data, execute } = useFetch(() => `/api/users/${userId.value}`, {
  immediate: false, // 在 userId 设置前不请求
})

// 之后，当 userId 可用时
function loadUser(id: string) {
  userId.value = id
  execute()
}
</script>
```

## 仅服务端请求

```vue
<script setup lang="ts">
// 仅在服务端请求，客户端导航时跳过
const { data } = await useFetch('/api/static-content', {
  server: true,
  lazy: true,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
})
</script>
```

## 错误处理

```vue
<script setup lang="ts">
const { data, error, refresh } = await useFetch('/api/posts')

// 如需事件式处理，监听错误
watch(error, (err) => {
  if (err) {
    console.error('Fetch failed:', err)
    // Show toast, redirect, etc.
  }
}, { immediate: true })
</script>

<template>
  <div v-if="error">
    <p>Failed to load: {{ error.message }}</p>
    <button @click="refresh()">Retry</button>
  </div>
</template>
```

## 跨组件共享数据

```vue
<!-- ComponentA.vue -->
<script setup lang="ts">
const { data } = await useFetch('/api/user', { key: 'current-user' })
</script>

<!-- ComponentB.vue -->
<script setup lang="ts">
// 访问缓存数据，无需重新请求
const { data: user } = useNuxtData('current-user')

// 或刷新它
const { refresh } = await useFetch('/api/user', { key: 'current-user' })
</script>
```

## 避免在 useAsyncData 中产生副作用

### ❌ 错误：在 useAsyncData 中产生副作用

```vue
<script setup lang="ts">
// 不要触发 Pinia 的 action 或副作用
await useAsyncData(() => store.fetchUser()) // Can cause issues
</script>
```

### ✅ 正确：用 callOnce 处理副作用

```vue
<script setup lang="ts">
await callOnce(async () => {
  await store.fetchUser()
})
</script>
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/data-fetching
- https://nuxt.com/docs/api/composables/use-fetch
- https://nuxt.com/docs/api/composables/use-async-data
- https://nuxt.com/docs/api/composables/use-lazy-fetch
-->
