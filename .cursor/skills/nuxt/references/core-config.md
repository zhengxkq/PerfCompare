---
name: configuration
description: Nuxt configuration files including nuxt.config.ts, app.config.ts, and runtime configuration
---

# Nuxt 配置

Nuxt 使用配置文件自定义应用行为。主要配置选项为构建时设置的 `nuxt.config.ts` 和运行时设置的 `app.config.ts`。

## nuxt.config.ts

项目根目录下的主配置文件：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // 配置选项
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
})
```

### 环境覆盖

配置环境特定设置：

```ts
export default defineNuxtConfig({
  $production: {
    routeRules: {
      '/**': { isr: true },
    },
  },
  $development: {
    // 开发环境特定配置
  },
  $env: {
    staging: {
      // 预发布环境配置
    },
  },
})
```

使用 `--envName` 标志选择环境：`nuxt build --envName staging`

## 运行时配置

需要通过环境变量覆盖的值：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 仅服务端键
    apiSecret: '123',
    // public 内的键会暴露给客户端
    public: {
      apiBase: '/api',
    },
  },
})
```

通过环境变量覆盖：

```ini
# .env
NUXT_API_SECRET=api_secret_token
NUXT_PUBLIC_API_BASE=https://api.example.com
```

在组件/组合式中访问：

```vue
<script setup lang="ts">
const config = useRuntimeConfig()
// 服务端：config.apiSecret、config.public.apiBase
// 客户端：仅 config.public.apiBase
</script>
```

## 应用配置

用于构建时确定的公开 token（不可通过环境变量覆盖）：

```ts
// app/app.config.ts
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000',
    },
  },
})
```

在组件中访问：

```vue
<script setup lang="ts">
const appConfig = useAppConfig()
</script>
```

## runtimeConfig vs app.config

| Feature | runtimeConfig | app.config |
|---------|--------------|------------|
| 客户端 | 水合 | 打包 |
| 环境变量 | 是 | 否 |
| 响应式 | 是 | 是 |
| 热模块替换 | 否 | 是 |
| 非原始 JS 类型 | 否 | 是 |

**使用 runtimeConfig** 存储密钥和随环境变化的值。
**使用 app.config** 存储公开 token、主题设置和非敏感配置。

## 外部工具配置

Nuxt 以 `nuxt.config.ts` 为单一配置源。在其内配置外部工具：

```ts
export default defineNuxtConfig({
  // Nitro 配置
  nitro: {
    // nitro 选项
  },
  // Vite 配置
  vite: {
    // vite options
    vue: {
      // @vitejs/plugin-vue 选项
    },
  },
  // PostCSS configuration
  postcss: {
    // postcss 选项
  },
})
```

## Vue 配置

启用 Vue 实验性功能：

```ts
export default defineNuxtConfig({
  vue: {
    propsDestructure: true,
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/configuration
- https://nuxt.com/docs/guide/going-further/runtime-config
- https://nuxt.com/docs/api/nuxt-config
-->
