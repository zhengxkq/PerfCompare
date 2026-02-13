---
name: nuxt-layers
description: Extending Nuxt applications with layers for code sharing and reusability
---

# Nuxt 层

层允许在项目间共享和复用部分 Nuxt 应用，可包含组件、组合式、页面、布局和配置。

## 使用层

### 从 npm 包

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '@my-org/base-layer',
    '@nuxtjs/ui-layer',
  ],
})
```

### 从 Git 仓库

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'github:username/repo',
    'github:username/repo/base', // Subdirectory
    'github:username/repo#v1.0', // Specific tag
    'github:username/repo#dev', // Branch
    'gitlab:username/repo',
    'bitbucket:username/repo',
  ],
})
```

### 从本地目录

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '../base-layer',
    './layers/shared',
  ],
})
```

### 自动扫描的层

置于 `layers/` 目录以便自动发现：

```
my-app/
├── layers/
│   ├── base/
│   │   └── nuxt.config.ts
│   └── ui/
│       └── nuxt.config.ts
└── nuxt.config.ts
```

## 创建层

最小层结构：

```
my-layer/
├── nuxt.config.ts       # 必需
├── app/
│   ├── components/      # 自动合并
│   ├── composables/     # 自动合并
│   ├── layouts/         # 自动合并
│   ├── middleware/      # 自动合并
│   ├── pages/           # 自动合并
│   ├── plugins/         # 自动合并
│   └── app.config.ts    # 合并
├── server/              # 自动合并
└── package.json
```

### 层的 nuxt.config.ts

```ts
// my-layer/nuxt.config.ts
export default defineNuxtConfig({
  // 层配置
  app: {
    head: {
      title: 'My Layer App',
    },
  },
  // 共享模块
  modules: ['@nuxt/ui'],
})
```

### 层组件

```vue
<!-- my-layer/app/components/BaseButton.vue -->
<template>
  <button class="base-btn">
    <slot />
  </button>
</template>
```

在使用方项目中使用：

```vue
<template>
  <BaseButton>Click me</BaseButton>
</template>
```

### 层组合式

```ts
// my-layer/app/composables/useTheme.ts
export function useTheme() {
  const isDark = useState('theme-dark', () => false)
  const toggle = () => isDark.value = !isDark.value
  return { isDark, toggle }
}
```

## 层优先级

覆盖顺序（由高到低）：
1. 你的项目文件
2. 自动扫描的层（按字母顺序，Z > A）
3. `extends` 数组（先 > 后）

用前缀控制顺序：

```
layers/
├── 1.base/      # 较低优先级
└── 2.theme/     # 较高优先级
```

## 层别名

访问层文件：

```ts
// 自动扫描的层有别名
import Component from '#layers/base/components/Component.vue'
```

命名别名：

```ts
// my-layer/nuxt.config.ts
export default defineNuxtConfig({
  $meta: {
    name: 'my-layer',
  },
})
```

```ts
// 在使用方项目中
import { something } from '#layers/my-layer/utils'
```

## 发布层

### 作为 npm 包

```json
{
  "name": "my-nuxt-layer",
  "version": "1.0.0",
  "type": "module",
  "main": "./nuxt.config.ts",
  "dependencies": {
    "@nuxt/ui": "^2.0.0"
  },
  "devDependencies": {
    "nuxt": "^3.0.0"
  }
}
```

### 私有层

针对私有 Git 仓库：

```bash
export GIGET_AUTH=<github-token>
```

## 层最佳实践

### 使用解析路径

```ts
// my-layer/nuxt.config.ts
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  css: [
    join(currentDir, './assets/main.css'),
  ],
})
```

### 安装依赖

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    ['github:user/layer', { install: true }],
  ],
})
```

### 禁用层模块

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./base-layer'],
  // 禁用来自层的模块
  image: false, // Disables @nuxt/image
  pinia: false, // Disables @pinia/nuxt
})
```

## 起步模板

创建新层：

```bash
npx nuxi init --template layer my-layer
```

## 示例：主题层

```
theme-layer/
├── nuxt.config.ts
├── app/
│   ├── app.config.ts
│   ├── components/
│   │   ├── ThemeButton.vue
│   │   └── ThemeCard.vue
│   ├── composables/
│   │   └── useTheme.ts
│   └── assets/
│       └── theme.css
└── package.json
```

```ts
// theme-layer/nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/theme.css'],
})
```

```ts
// theme-layer/app/app.config.ts
export default defineAppConfig({
  theme: {
    primaryColor: '#00dc82',
    darkMode: false,
  },
})
```

```ts
// consuming-app/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['theme-layer'],
})

// consuming-app/app/app.config.ts
export default defineAppConfig({
  theme: {
    primaryColor: '#ff0000', // Override
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/layers
- https://nuxt.com/docs/guide/going-further/layers
-->
