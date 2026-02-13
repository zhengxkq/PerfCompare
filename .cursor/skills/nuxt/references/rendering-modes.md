---
name: rendering-modes
description: Universal rendering, client-side rendering, and hybrid rendering in Nuxt
---

# 渲染模式

Nuxt 支持多种渲染模式：通用（SSR）、客户端（CSR）和混合渲染。

## 通用渲染（默认）

服务端渲染 HTML，随后在客户端水合：

```ts
// nuxt.config.ts - 此为默认
export default defineNuxtConfig({
  ssr: true,
})
```

**优势：**
- 首屏加载快（HTML 已就绪）
- 利于 SEO（内容在 HTML 中）
- 初始可不依赖 JavaScript

**工作原理：**
1. 服务端执行 Vue 代码，生成 HTML
2. 浏览器立即显示 HTML
3. JavaScript 加载并水合页面
4. 页面变为完全可交互

## 客户端渲染

完全在浏览器中渲染：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
})
```

**优势：**
- 开发更简单（无 SSR 约束）
- 托管成本更低（仅静态文件）
- 支持离线

**适用场景：**
- 管理后台
- SaaS 应用
- 需鉴权的应用

### SPA 加载模板

应用水合时提供加载 UI：

```html
<!-- app/spa-loading-template.html -->
<div class="loading">
  <div class="spinner"></div>
  <p>Loading...</p>
</div>

<style>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00dc82;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

## 混合渲染

通过路由规则按路由混合渲染模式：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 静态页 - 构建时预渲染
    '/': { prerender: true },
    '/about': { prerender: true },

    // ISR - 后台重新生成
    '/blog/**': { isr: 3600 }, // Cache for 1 hour
    '/products/**': { swr: true }, // Stale-while-revalidate

    // 仅客户端渲染
    '/admin/**': { ssr: false },
    '/dashboard/**': { ssr: false },

    // 服务端渲染（默认）
    '/api/**': { cors: true },
  },
})
```

### 路由规则参考

| Rule | Description |
|------|-------------|
| `prerender: true` | 构建时预渲染 |
| `ssr: false` | 仅客户端 |
| `swr: number \| true` | stale-while-revalidate 缓存 |
| `isr: number \| true` | 增量静态生成 |
| `cache: { maxAge: number }` | 带 TTL 的缓存 |
| `redirect: string` | 重定向到另一路径 |
| `cors: true` | 添加 CORS 头 |
| `headers: object` | 自定义响应头 |

### 内联路由规则

按页面定义：

```vue
<script setup lang="ts">
defineRouteRules({
  prerender: true,
})
</script>
```

## 预渲染

在构建时生成静态 HTML：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // 预渲染指定路由
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/posts/*': { prerender: true },
  },
})
```

或使用 `nuxt generate`：

```bash
nuxt generate
```

### Programmatic Prerendering

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  hooks: {
    'prerender:routes'({ routes }) {
      // 添加动态路由
      const posts = await fetchPostSlugs()
      for (const slug of posts) {
        routes.add(`/posts/${slug}`)
      }
    },
  },
})
```

或在页面中：

```ts
// server/api/posts.ts or a plugin
prerenderRoutes(['/posts/1', '/posts/2', '/posts/3'])
```

## 边缘渲染

在 CDN 边缘节点渲染：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages', // or 'vercel-edge', 'netlify-edge'
  },
})
```

支持平台：
- Cloudflare Pages/Workers
- Vercel Edge Functions
- Netlify Edge Functions

## 条件渲染

使用 `import.meta.server` 和 `import.meta.client`：

```vue
<script setup>
if (import.meta.server) {
  // 仅服务端代码
  console.log('Running on server')
}

if (import.meta.client) {
  // 仅客户端代码
  console.log('Running in browser')
}
</script>
```

对于组件：

```vue
<template>
  <ClientOnly>
    <BrowserOnlyComponent />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </ClientOnly>
</template>
```

<!-- 
Source references:
- https://nuxt.com/docs/guide/concepts/rendering
- https://nuxt.com/docs/getting-started/prerendering
- https://nuxt.com/docs/api/nuxt-config#routerules
-->
