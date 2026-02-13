---
name: routing
description: File-based routing, dynamic routes, navigation, and middleware in Nuxt
---

# 路由

Nuxt 基于 vue-router 使用文件系统路由，`app/pages/` 下的文件会自动生成路由。

## 基础路由

```
pages/
├── index.vue      → /
├── about.vue      → /about
└── posts/
    ├── index.vue  → /posts
    └── [id].vue   → /posts/:id
```

## 动态路由

使用方括号表示动态片段：

```
pages/
├── users/
│   └── [id].vue       → /users/:id
├── posts/
│   └── [...slug].vue  → /posts/* (catch-all)
└── [[optional]].vue   → /:optional? (可选参数)
```

访问路由参数：

```vue
<script setup lang="ts">
const route = useRoute()
// /posts/123 → route.params.id = '123'
console.log(route.params.id)
</script>
```

## 导航

### NuxtLink 组件

```vue
<template>
  <nav>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/about">About</NuxtLink>
    <NuxtLink :to="{ name: 'posts-id', params: { id: 1 } }">Post 1</NuxtLink>
  </nav>
</template>
```

NuxtLink 会在链接进入视口时自动预取对应页面。

### 编程式导航

```vue
<script setup lang="ts">
const router = useRouter()

function goToPost(id: number) {
  navigateTo(`/posts/${id}`)
  // or
  router.push({ name: 'posts-id', params: { id } })
}
</script>
```

## 路由中间件

### 命名中间件

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = false // Your auth logic

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})
```

在页面中应用：

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  // or multiple: middleware: ['auth', 'admin']
})
</script>
```

### 全局中间件

文件名带 `.global` 后缀：

```ts
// middleware/logging.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Navigating to:', to.path)
})
```

### 内联中间件

```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      // Inline middleware logic
    },
  ],
})
</script>
```

## 页面元信息

配置页面级选项：

```vue
<script setup lang="ts">
definePageMeta({
  title: 'My Page',
  layout: 'custom',
  middleware: 'auth',
  validate: (route) => {
    // Return false for 404, or object with status/statusText
    return /^\d+$/.test(route.params.id as string)
  },
})
</script>
```

## 路由校验

```vue
<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    // Must return boolean or object with status
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>
```

## 布局

在 `app/layouts/` 下定义布局：

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header>Header</header>
    <slot />
    <footer>Footer</footer>
  </div>
</template>
```

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin">
    <AdminSidebar />
    <main>
      <slot />
    </main>
  </div>
</template>
```

在页面中使用：

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
```

动态布局：

```vue
<script setup lang="ts">
const layout = ref('default')

function enableAdmin() {
  setPageLayout('admin')
}
</script>
```

## 导航钩子

```vue
<script setup lang="ts">
onBeforeRouteLeave((to, from) => {
  // Confirm before leaving
  const answer = window.confirm('Leave?')
  if (!answer) return false
})

onBeforeRouteUpdate((to, from) => {
  // Called when route changes but component is reused
})
</script>
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/routing
- https://nuxt.com/docs/directory-structure/app/pages
- https://nuxt.com/docs/directory-structure/app/middleware
-->
