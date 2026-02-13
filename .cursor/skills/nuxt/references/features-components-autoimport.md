---
name: components-auto-imports
description: Auto-imported components, lazy loading, and hydration strategies
---

# 组件自动导入

Nuxt 会自动从 `app/components/` 目录导入 Vue 组件。

## 基础自动导入

```
components/
├── Button.vue         → <Button />
├── Card.vue           → <Card />
└── AppHeader.vue      → <AppHeader />
```

```vue
<template>
  <!-- No imports needed -->
  <AppHeader />
  <Card>
    <Button>Click me</Button>
  </Card>
</template>
```

## 命名约定

### 嵌套目录名

组件名会包含目录路径：

```
components/
├── base/
│   └── Button.vue       → <BaseButton />
├── form/
│   ├── Input.vue        → <FormInput />
│   └── Select.vue       → <FormSelect />
└── ui/
    └── modal/
        └── Dialog.vue   → <UiModalDialog />
```

### 关闭路径前缀

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  components: [
    {
      path: '~/components',
      pathPrefix: false, // Use filename only
    },
  ],
})
```

使用 `pathPrefix: false` 时：
```
components/base/Button.vue → <Button />
```

## 懒加载

使用 `Lazy` 前缀实现动态导入：

```vue
<script setup lang="ts">
const showChart = ref(false)
</script>

<template>
  <!-- Component code loaded only when rendered -->
  <LazyHeavyChart v-if="showChart" />
  <button @click="showChart = true">Show Chart</button>
</template>
```

好处：
- 减小初始包体积
- 将组件拆成独立 chunk
- 按需加载

## 懒水合策略

控制懒加载组件何时变为可交互：

### `hydrate-on-visible`

组件进入视口时水合：

```vue
<template>
  <LazyComments hydrate-on-visible />
</template>
```

### `hydrate-on-idle`

浏览器空闲时水合：

```vue
<template>
  <LazyAnalytics hydrate-on-idle />
</template>
```

### `hydrate-on-interaction`

在用户交互时水合：

```vue
<template>
  <!-- Hydrates on click, focus, or pointerenter -->
  <LazyDropdown hydrate-on-interaction />

  <!-- Specific event -->
  <LazyTooltip hydrate-on-interaction="mouseover" />
</template>
```

### `hydrate-on-media-query`

媒体查询匹配时水合：

```vue
<template>
  <LazyMobileMenu hydrate-on-media-query="(max-width: 768px)" />
</template>
```

### `hydrate-after`

延迟指定毫秒后水合：

```vue
<template>
  <LazyAds :hydrate-after="3000" />
</template>
```

### `hydrate-when`

在条件满足时水合：

```vue
<script setup lang="ts">
const isReady = ref(false)
</script>

<template>
  <LazyEditor :hydrate-when="isReady" />
</template>
```

### `hydrate-never`

永不水合（仅静态渲染）：

```vue
<template>
  <LazyStaticFooter hydrate-never />
</template>
```

### 水合事件

```vue
<template>
  <LazyChart hydrate-on-visible @hydrated="onChartReady" />
</template>

<script setup>
function onChartReady() {
  console.log('Chart is now interactive')
}
</script>
```

## 客户端/服务端组件

### 仅客户端（`.client.vue`）

```
components/
└── BrowserChart.client.vue
```

```vue
<template>
  <!-- Only rendered in browser -->
  <BrowserChart />
</template>
```

### 仅服务端（`.server.vue`）

```
components/
└── ServerMarkdown.server.vue
```

```vue
<template>
  <!-- Rendered on server, not hydrated -->
  <ServerMarkdown :content="markdown" />
</template>
```

需要开启实验性选项：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    componentIslands: true,
  },
})
```

### 配对组件

```
components/
├── Comments.client.vue  # Browser version
└── Comments.server.vue  # SSR version
```

服务端版本在 SSR 时渲染，水合后由客户端版本接管。

## 动态组件

```vue
<script setup lang="ts">
import { SomeComponent } from '#components'

const dynamicComponent = resolveComponent('MyButton')
</script>

<template>
  <component :is="dynamicComponent" />
  <component :is="SomeComponent" />
</template>
```

## 显式导入

需要时绕过自动导入：

```vue
<script setup lang="ts">
import { LazyMountainsList, NuxtLink } from '#components'
</script>
```

## 自定义目录

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  components: [
    { path: '~/components/ui', prefix: 'Ui' },
    { path: '~/components/forms', prefix: 'Form' },
    '~/components', // Default, should come last
  ],
})
```

## 全局组件

全局注册（会生成异步 chunk）：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components'],
  },
})
```

或使用 `.global.vue` 后缀：

```
components/
└── Icon.global.vue  → Available globally
```

## 关闭组件自动导入

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  components: {
    dirs: [], // Disable auto-imports
  },
})
```

## 库作者

从 npm 包注册组件：

```ts
// my-ui-lib/nuxt.ts
import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('./components'),
      prefix: 'MyUi',
    })
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/directory-structure/app/components
- https://nuxt.com/docs/guide/concepts/auto-imports#auto-imported-components
-->
