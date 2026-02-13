---
name: nuxt-modules
description: Creating and using Nuxt modules to extend framework functionality
---

# Nuxt 模块

模块用于扩展 Nuxt 的核心能力，在构建时运行，可添加组件、composables、插件和配置。

## 使用模块

安装后写入 `nuxt.config.ts`：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    // npm package
    '@nuxt/ui',
    // Local module
    './modules/my-module',
    // Inline module
    (options, nuxt) => {
      console.log('Inline module')
    },
    // With options
    ['@nuxt/image', { provider: 'cloudinary' }],
  ],
})
```

## 创建模块

### 基础模块

```ts
// modules/my-module.ts
export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    enabled: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) return

    console.log('My module is running!')
  },
})
```

### 添加组件

```ts
// modules/ui/index.ts
import { addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add single component
    addComponent({
      name: 'MyButton',
      filePath: resolve('./runtime/components/MyButton.vue'),
    })

    // Add components directory
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: 'My',
    })
  },
})
```

### 添加 Composables

```ts
// modules/utils/index.ts
import { addImports, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // Add auto-imported composable
    addImports({
      name: 'useMyUtil',
      from: resolve('./runtime/composables/useMyUtil'),
    })

    // Add directory for auto-imports
    addImportsDir(resolve('./runtime/composables'))
  },
})
```

### 添加插件

```ts
// modules/analytics/index.ts
import { addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addPlugin({
      src: resolve('./runtime/plugin'),
      mode: 'client', // 'client', 'server', or 'all'
    })
  },
})
```

插件文件：

```ts
// modules/analytics/runtime/plugin.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    console.log('Page loaded')
  })
})
```

### 添加服务端路由

```ts
// modules/api/index.ts
import { addServerHandler, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      route: '/api/my-endpoint',
      handler: resolve('./runtime/server/api/my-endpoint'),
    })
  },
})
```

### 扩展配置

```ts
// modules/config/index.ts
export default defineNuxtModule({
  setup(options, nuxt) {
    // Add CSS
    nuxt.options.css.push('my-module/styles.css')

    // Add runtime config
    nuxt.options.runtimeConfig.public.myModule = {
      apiUrl: options.apiUrl,
    }

    // Extend Vite config
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    nuxt.options.vite.optimizeDeps.include.push('some-package')
  },
})
```

## 模块钩子

```ts
export default defineNuxtModule({
  setup(options, nuxt) {
    // Build-time hooks
    nuxt.hook('modules:done', () => {
      console.log('All modules loaded')
    })

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({ path: '~/extra-components' })
    })

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'custom-page',
        path: '/custom',
        file: resolve('./runtime/pages/custom.vue'),
      })
    })

    nuxt.hook('imports:extend', (imports) => {
      imports.push({ name: 'myHelper', from: 'my-package' })
    })
  },
})
```

## 模块选项

带默认值的类型安全选项：

```ts
export interface ModuleOptions {
  apiKey: string
  enabled?: boolean
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    enabled: true,
    prefix: 'My',
  },
  setup(options, nuxt) {
    // options is typed as ModuleOptions
    if (!options.apiKey) {
      console.warn('API key not provided')
    }
  },
})
```

使用方式：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['my-module'],
  myModule: {
    apiKey: 'xxx',
    prefix: 'Custom',
  },
})
```

## 本地模块

放在 `modules/` 目录下：

```
modules/
├── my-module/
│   ├── index.ts
│   └── runtime/
│       ├── components/
│       ├── composables/
│       └── plugin.ts
```

可自动注册或手动添加：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '~/modules/my-module', // Explicit
  ],
})
```

## 模块依赖

```ts
export default defineNuxtModule({
  meta: {
    name: 'my-module',
  },
  moduleDependencies: {
    '@nuxt/image': {
      version: '>=1.0.0',
      defaults: {
        provider: 'ipx',
      },
    },
  },
  setup() {
    // @nuxt/image is guaranteed to be installed
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/guide/modules
- https://nuxt.com/docs/guide/modules/module-anatomy
- https://nuxt.com/docs/api/kit
-->
