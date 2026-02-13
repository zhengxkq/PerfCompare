---
name: built-in-components
description: NuxtLink, NuxtPage, NuxtLayout, and other built-in Nuxt components
---

# 内置组件

Nuxt 为常用功能提供若干内置组件。

## NuxtLink

带预取能力的链接组件：

```vue
<template>
  <!-- Basic usage -->
  <NuxtLink to="/about">About</NuxtLink>

  <!-- With route object -->
  <NuxtLink :to="{ name: 'posts-id', params: { id: 1 } }">Post 1</NuxtLink>

  <!-- External link (opens in new tab) -->
  <NuxtLink to="https://nuxt.com" external>Nuxt</NuxtLink>

  <!-- Disable prefetching -->
  <NuxtLink to="/heavy-page" :prefetch="false">Heavy Page</NuxtLink>

  <!-- Replace history instead of push -->
  <NuxtLink to="/page" replace>Replace</NuxtLink>

  <!-- Custom active class -->
  <NuxtLink
    to="/dashboard"
    active-class="text-primary"
    exact-active-class="font-bold"
  >
    Dashboard
  </NuxtLink>
</template>
```

## NuxtPage

渲染当前页面组件（在布局中使用）：

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

带页面过渡：

```vue
<template>
  <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
</template>
```

向页面传 props：

```vue
<template>
  <NuxtPage :page-key="route.fullPath" :foobar="123" />
</template>
```

## NuxtLayout

控制布局渲染：

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

动态布局：

```vue
<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const layout = computed(() => isAdmin ? 'admin' : 'default')
</script>
```

带过渡的布局：

```vue
<template>
  <NuxtLayout :transition="{ name: 'slide', mode: 'out-in' }">
    <NuxtPage />
  </NuxtLayout>
</template>
```

## NuxtLoadingIndicator

页面导航进度条：

```vue
<!-- app/app.vue -->
<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #00dc82 0%, #34cdfe 50%, #0047e1 100%)"
    :height="3"
    :duration="2000"
    :throttle="200"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## NuxtErrorBoundary

捕获并处理子组件错误：

```vue
<template>
  <NuxtErrorBoundary @error="handleError">
    <ComponentThatMightFail />

    <template #error="{ error, clearError }">
      <div class="error">
        <p>Something went wrong: {{ error.message }}</p>
        <button @click="clearError">Try again</button>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup>
function handleError(error) {
  console.error('Error caught:', error)
}
</script>
```

## ClientOnly

仅在客户端渲染内容：

```vue
<template>
  <ClientOnly>
    <!-- Browser-only component -->
    <BrowserOnlyChart :data="chartData" />

    <template #fallback>
      <p>Loading chart...</p>
    </template>
  </ClientOnly>
</template>
```

## DevOnly

仅在开发环境渲染内容：

```vue
<template>
  <DevOnly>
    <DebugPanel />
  </DevOnly>
</template>
```

## NuxtIsland

服务端组件（实验性）：

```vue
<template>
  <NuxtIsland name="HeavyComponent" :props="{ data: complexData }" />
</template>
```

## NuxtImg 与 NuxtPicture

图片优化（需安装 `@nuxt/image` 模块）：

```vue
<template>
  <!-- Basic optimized image -->
  <NuxtImg src="/images/hero.jpg" width="800" height="600" />

  <!-- Responsive with srcset -->
  <NuxtImg
    src="/images/hero.jpg"
    sizes="sm:100vw md:50vw lg:400px"
    :modifiers="{ format: 'webp' }"
  />

  <!-- Art direction with picture -->
  <NuxtPicture
    src="/images/hero.jpg"
    :img-attrs="{ alt: 'Hero image' }"
  />
</template>
```

## Teleport

在组件树外渲染内容：

```vue
<template>
  <button @click="showModal = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="showModal" class="modal">
      <p>Modal content</p>
      <button @click="showModal = false">Close</button>
    </div>
  </Teleport>
</template>
```

在 SSR 中配合 `<ClientOnly>` 使用 Teleport：

```vue
<template>
  <ClientOnly>
    <Teleport to="#teleports">
      <Modal />
    </Teleport>
  </ClientOnly>
</template>
```

## NuxtRouteAnnouncer

无障碍：向读屏器播报页面变化：

```vue
<!-- app/app.vue -->
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

<!-- 
Source references:
- https://nuxt.com/docs/api/components/nuxt-link
- https://nuxt.com/docs/api/components/nuxt-page
- https://nuxt.com/docs/api/components/nuxt-layout
- https://nuxt.com/docs/api/components/client-only
-->
