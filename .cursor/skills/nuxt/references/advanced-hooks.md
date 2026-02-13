---
name: lifecycle-hooks
description: Nuxt and Nitro hooks for extending build-time and runtime behavior
---

# 生命周期钩子

Nuxt 提供钩子以便接入构建过程、应用生命周期和服务端运行时。

## 构建时钩子 (Nuxt)

在 `nuxt.config.ts` 或模块中使用：

### 在 nuxt.config.ts 中

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  hooks: {
    'build:before': () => {
      console.log('Build starting...')
    },
    'pages:extend': (pages) => {
      // Add custom pages
      pages.push({
        name: 'custom',
        path: '/custom',
        file: '~/pages/custom.vue',
      })
    },
    'components:dirs': (dirs) => {
      // Add component directories
      dirs.push({ path: '~/extra-components' })
    },
  },
})
```

### 在模块中

```ts
// modules/my-module.ts
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('ready', async (nuxt) => {
      console.log('Nuxt is ready')
    })

    nuxt.hook('close', async (nuxt) => {
      console.log('Nuxt is closing')
    })

    nuxt.hook('modules:done', () => {
      console.log('All modules loaded')
    })
  },
})
```

### 常用构建钩子

| Hook | When |
|------|------|
| `ready` | Nuxt 初始化完成 |
| `close` | Nuxt 正在关闭 |
| `modules:done` | 所有模块已安装 |
| `build:before` | 构建开始前 |
| `build:done` | 构建完成 |
| `pages:extend` | 页面路由已解析 |
| `components:dirs` | 组件目录正在解析 |
| `imports:extend` | 自动导入正在解析 |
| `nitro:config` | Nitro 配置最终确定前 |
| `vite:extend` | Vite 上下文已创建 |
| `vite:extendConfig` | Vite 配置最终确定前 |

## 应用钩子（运行时）

在插件和组合式中使用：

### 在插件中

```ts
// plugins/lifecycle.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', (vueApp) => {
    console.log('Vue app created')
  })

  nuxtApp.hook('app:mounted', (vueApp) => {
    console.log('App mounted')
  })

  nuxtApp.hook('page:start', () => {
    console.log('Page navigation starting')
  })

  nuxtApp.hook('page:finish', () => {
    console.log('Page navigation finished')
  })

  nuxtApp.hook('page:loading:start', () => {
    console.log('Page loading started')
  })

  nuxtApp.hook('page:loading:end', () => {
    console.log('Page loading ended')
  })
})
```

### 常用应用钩子

| Hook | When |
|------|------|
| `app:created` | Vue 应用已创建 |
| `app:mounted` | Vue 应用已挂载（仅客户端） |
| `app:error` | 发生致命错误 |
| `page:start` | 页面导航开始 |
| `page:finish` | 页面导航完成 |
| `page:loading:start` | 应显示加载指示器 |
| `page:loading:end` | 应隐藏加载指示器 |
| `link:prefetch` | 链接正在预取 |

### 使用运行时钩子

```ts
// composables/usePageTracking.ts
export function usePageTracking() {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('page:finish', () => {
    trackPageView(useRoute().path)
  })
}
```

## 服务端钩子 (Nitro)

在服务端插件中使用：

```ts
// server/plugins/hooks.ts
export default defineNitroPlugin((nitroApp) => {
  // 在发送前修改 HTML
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    html.head.push('<meta name="custom" content="value">')
    html.bodyAppend.push('<script>console.log("injected")</script>')
  })

  // 修改响应
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    console.log('Sending response:', response.statusCode)
  })

  // 请求前
  nitroApp.hooks.hook('request', (event) => {
    console.log('Request:', event.path)
  })

  // 响应后
  nitroApp.hooks.hook('afterResponse', (event) => {
    console.log('Response sent')
  })
})
```

### 常用 Nitro 钩子

| Hook | When |
|------|------|
| `request` | 收到请求 |
| `beforeResponse` | 发送响应前 |
| `afterResponse` | 响应已发送后 |
| `render:html` | HTML 发送前 |
| `render:response` | 响应最终确定前 |
| `error` | 发生错误 |

## 自定义钩子

### 定义自定义钩子类型

```ts
// types/hooks.d.ts
import type { HookResult } from '@nuxt/schema'

declare module '#app' {
  interface RuntimeNuxtHooks {
    'my-app:event': (data: MyEventData) => HookResult
  }
}

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'my-module:init': () => HookResult
  }
}

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'my-server:event': (data: any) => void
  }
}
```

### 调用自定义钩子

```ts
// In a plugin
export default defineNuxtPlugin((nuxtApp) => {
  // 调用自定义钩子
  nuxtApp.callHook('my-app:event', { type: 'custom' })
})

// In a module
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.callHook('my-module:init')
  },
})
```

## useRuntimeHook

在组件中于运行时调用钩子：

```vue
<script setup lang="ts">
// 为运行时钩子注册回调
useRuntimeHook('app:error', (error) => {
  console.error('App error:', error)
})
</script>
```

## 钩子示例

### 页面浏览量追踪

```ts
// plugins/analytics.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const route = useRoute()
    analytics.track('pageview', {
      path: route.path,
      title: document.title,
    })
  })
})
```

### 性能监控

```ts
// plugins/performance.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  let navigationStart: number

  nuxtApp.hook('page:start', () => {
    navigationStart = performance.now()
  })

  nuxtApp.hook('page:finish', () => {
    const duration = performance.now() - navigationStart
    console.log(`Navigation took ${duration}ms`)
  })
})
```

### 注入 HTML

```ts
// server/plugins/inject.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push(`
      <script>
        window.APP_CONFIG = ${JSON.stringify(config)}
      </script>
    `)
  })
})
```

<!-- 
Source references:
- https://nuxt.com/docs/guide/going-further/hooks
- https://nuxt.com/docs/api/advanced/hooks
-->
