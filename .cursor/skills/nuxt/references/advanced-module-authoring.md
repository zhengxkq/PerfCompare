---
name: module-authoring
description: Complete guide to creating publishable Nuxt modules with best practices
---

# 模块编写

本指南介绍如何创建具有规范结构、类型安全和最佳实践的可发布 Nuxt 模块。

## 模块结构

可发布模块的推荐结构：

```
my-nuxt-module/
├── src/
│   ├── module.ts          # 模块入口
│   └── runtime/
│       ├── components/    # Vue components
│       ├── composables/   # Composables
│       ├── plugins/       # Nuxt plugins
│       └── server/        # Server handlers
├── playground/            # 开发应用
├── package.json
└── tsconfig.json
```

## 模块定义

### 带类型安全选项的基础模块

```ts
// src/module.ts
import { defineNuxtModule, createResolver, addPlugin, addComponent, addImports } from '@nuxt/kit'

export interface ModuleOptions {
  prefix?: string
  apiKey: string
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    prefix: 'My',
    enabled: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) return

    const { resolve } = createResolver(import.meta.url)

    // 在此编写模块设置逻辑
  },
})
```

### 使用 `.with()` 进行严格类型推断

当需要 TypeScript 推断默认值始终存在时：

```ts
import { defineNuxtModule } from '@nuxt/kit'

interface ModuleOptions {
  apiKey: string
  baseURL: string
  timeout?: number
}

export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: '@nuxtjs/my-api',
    configKey: 'myApi',
  },
  defaults: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
  },
  setup(resolvedOptions, nuxt) {
    // resolvedOptions.baseURL 保证为 string（非 undefined）
    // resolvedOptions.timeout 保证为 number（非 undefined）
  },
})
```

## 添加运行时资源

### 组件

```ts
import { addComponent, addComponentsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // 单个组件
    addComponent({
      name: 'MyButton',
      filePath: resolve('./runtime/components/MyButton.vue'),
    })

    // 带前缀的组件目录
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: 'My',
      pathPrefix: false,
    })
  },
})
```

### 组合式与自动导入

```ts
import { addImports, addImportsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // 单个导入
    addImports({
      name: 'useMyUtil',
      from: resolve('./runtime/composables/useMyUtil'),
    })

    // 组合式目录
    addImportsDir(resolve('./runtime/composables'))
  },
})
```

### 插件

```ts
import { addPlugin, addPluginTemplate, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options) {
    const { resolve } = createResolver(import.meta.url)

    // 静态插件文件
    addPlugin({
      src: resolve('./runtime/plugins/myPlugin'),
      mode: 'client', // 'client', 'server', or 'all'
    })

    // 带生成代码的动态插件
    addPluginTemplate({
      filename: 'my-module-plugin.mjs',
      getContents: () => `
import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin({
  name: 'my-module',
  setup() {
    const config = ${JSON.stringify(options)}
    // 插件逻辑
  }
})`,
    })
  },
})
```

## 服务端扩展

### 服务端处理器

```ts
import { addServerHandler, addServerScanDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // 单个处理器
    addServerHandler({
      route: '/api/my-endpoint',
      handler: resolve('./runtime/server/api/my-endpoint'),
    })

    // 扫描整个 server 目录（api/、routes/、middleware/、utils/）
    addServerScanDir(resolve('./runtime/server'))
  },
})
```

### 服务端组合式

```ts
import { addServerImports, addServerImportsDir, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // 单个服务端导入
    addServerImports({
      name: 'useServerUtil',
      from: resolve('./runtime/server/utils/useServerUtil'),
    })

    // 服务端组合式目录
    addServerImportsDir(resolve('./runtime/server/composables'))
  },
})
```

### Nitro 插件

```ts
import { addServerPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)
    addServerPlugin(resolve('./runtime/server/plugin'))
  },
})
```

```ts
// runtime/server/plugin.ts
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    console.log('Request:', event.path)
  })
})
```

## 模板与虚拟文件

### 生成虚拟文件

```ts
import { addTemplate, addTypeTemplate, addServerTemplate, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // 客户端/构建虚拟文件（通过 #build/my-config.mjs 访问）
    addTemplate({
      filename: 'my-config.mjs',
      getContents: () => `export default ${JSON.stringify(options)}`,
    })

    // 类型声明
    addTypeTemplate({
      filename: 'types/my-module.d.ts',
      getContents: () => `
declare module '#my-module' {
  export interface Config {
    apiKey: string
  }
}`,
    })

    // Nitro 虚拟文件（在服务端路由中可访问）
    addServerTemplate({
      filename: '#my-module/config.mjs',
      getContents: () => `export const config = ${JSON.stringify(options)}`,
    })
  },
})
```

### 访问虚拟文件

```ts
// 在运行时插件中
// @ts-expect-error - virtual file
import config from '#build/my-config.mjs'

// 在服务端路由中
import { config } from '#my-module/config.js'
```

## 扩展页面与路由

```ts
import { extendPages, extendRouteRules, addRouteMiddleware, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // 添加页面
    extendPages((pages) => {
      pages.push({
        name: 'my-page',
        path: '/my-route',
        file: resolve('./runtime/pages/MyPage.vue'),
      })
    })

    // 添加路由规则（缓存、重定向等）
    extendRouteRules('/api/**', {
      cache: { maxAge: 60 },
    })

    // 添加中间件
    addRouteMiddleware({
      name: 'my-middleware',
      path: resolve('./runtime/middleware/myMiddleware'),
      global: true,
    })
  },
})
```

## 模块依赖

用版本约束声明对其他模块的依赖：

```ts
export default defineNuxtModule({
  meta: {
    name: 'my-module',
  },
  moduleDependencies: {
    '@nuxtjs/tailwindcss': {
      version: '>=6.0.0',
      // 设置默认值（用户可覆盖）
      defaults: {
        exposeConfig: true,
      },
      // 强制特定选项
      overrides: {
        viewer: false,
      },
    },
    '@nuxtjs/i18n': {
      optional: true, // 未安装时不会失败
      defaults: {
        defaultLocale: 'en',
      },
    },
  },
  setup() {
    // 依赖保证在此运行前已设置
  },
})
```

### 动态依赖

```ts
moduleDependencies(nuxt) {
  const deps: Record<string, any> = {
    '@nuxtjs/tailwindcss': { version: '>=6.0.0' },
  }

  if (nuxt.options.ssr) {
    deps['@nuxtjs/html-validator'] = { optional: true }
  }

  return deps
}
```

## 生命周期钩子

需要 `meta.name` 和 `meta.version`：

```ts
export default defineNuxtModule({
  meta: {
    name: 'my-module',
    version: '1.2.0',
  },
  onInstall(nuxt) {
    // 首次安装时设置
    console.log('Module installed for the first time')
  },
  onUpgrade(nuxt, options, previousVersion) {
    // 版本升级迁移
    console.log(`Upgrading from ${previousVersion}`)
  },
  setup(options, nuxt) {
    // 常规 setup 在每次构建时运行
  },
})
```

## 扩展配置

```ts
export default defineNuxtModule({
  setup(options, nuxt) {
    // 添加 CSS
    nuxt.options.css.push('my-module/styles.css')

    // 添加运行时配置
    nuxt.options.runtimeConfig.public.myModule = {
      apiUrl: options.apiUrl,
    }

    // 扩展 Vite 配置
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    nuxt.options.vite.optimizeDeps.include.push('some-package')

    // 添加构建转译
    nuxt.options.build.transpile.push('my-package')
  },
})
```

## 使用钩子

```ts
export default defineNuxtModule({
  // 声明式钩子
  hooks: {
    'components:dirs': (dirs) => {
      dirs.push({ path: '~/extra' })
    },
  },

  setup(options, nuxt) {
    // 编程式钩子
    nuxt.hook('pages:extend', (pages) => {
      // 修改页面
    })

    nuxt.hook('imports:extend', (imports) => {
      imports.push({ name: 'myHelper', from: 'my-package' })
    })

    nuxt.hook('nitro:config', (config) => {
      // 修改 Nitro 配置
    })

    nuxt.hook('vite:extendConfig', (config) => {
      // 修改 Vite 配置
    })
  },
})
```

## 路径解析

```ts
import { createResolver, resolvePath, findPath } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(options, nuxt) {
    // 相对于模块的解析器
    const { resolve } = createResolver(import.meta.url)

    const pluginPath = resolve('./runtime/plugin')

    // 带扩展名和别名的解析
    const entrypoint = await resolvePath('@some/package')

    // 查找第一个存在的文件
    const configPath = await findPath([
      resolve('./config.ts'),
      resolve('./config.js'),
    ])
  },
})
```

## 模块的 package.json

```json
{
  "name": "my-nuxt-module",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/module.mjs",
      "require": "./dist/module.cjs"
    }
  },
  "main": "./dist/module.cjs",
  "module": "./dist/module.mjs",
  "types": "./dist/types.d.ts",
  "files": ["dist"],
  "scripts": {
    "dev": "nuxi dev playground",
    "build": "nuxt-module-build build",
    "prepare": "nuxt-module-build build --stub"
  },
  "dependencies": {
    "@nuxt/kit": "^3.0.0"
  },
  "devDependencies": {
    "@nuxt/module-builder": "latest",
    "nuxt": "^3.0.0"
  }
}
```

## 禁用模块

用户可通过配置键禁用模块：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // 完全禁用
  myModule: false,

  // 或带选项
  myModule: {
    enabled: false,
  },
})
```

## 开发流程

1. **创建模块**：`npx nuxi init -t module my-module`
2. **开发**：`npm run dev`（运行 playground）
3. **构建**：`npm run build`
4. **测试**：`npm run test`

## 最佳实践

- 使用 `createResolver(import.meta.url)` 进行所有路径解析
- 为组件添加前缀以避免命名冲突
- 用 `ModuleOptions` 接口使选项类型安全
- 使用 `moduleDependencies` 而非 `installModule`
- 为所有选项提供合理的默认值
- 在 `meta.compatibility` 中添加兼容性要求
- 用虚拟文件实现动态配置
- 适当分离客户端/服务端插件

<!--
Source references:
- https://nuxt.com/docs/api/kit/modules
- https://nuxt.com/docs/api/kit/components
- https://nuxt.com/docs/api/kit/autoimports
- https://nuxt.com/docs/api/kit/plugins
- https://nuxt.com/docs/api/kit/templates
- https://nuxt.com/docs/api/kit/nitro
- https://nuxt.com/docs/api/kit/pages
- https://nuxt.com/docs/api/kit/resolving
-->
