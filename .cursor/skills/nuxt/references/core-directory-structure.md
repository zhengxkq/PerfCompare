---
name: directory-structure
description: Nuxt project folder structure, conventions, and file organization
---

# 目录结构

Nuxt 使用基于约定的目录结构。理解它是有效开发的关键。

## 标准项目结构

```
my-nuxt-app/
├── app/                    # Application source (can be at root level)
│   ├── app.vue             # 根组件
│   ├── app.config.ts       # 应用配置（运行时）
│   ├── error.vue           # 错误页
│   ├── components/         # 自动导入的 Vue 组件
│   ├── composables/        # 自动导入的组合式
│   ├── layouts/            # 布局组件
│   ├── middleware/         # 路由中间件
│   ├── pages/              # 基于文件的路由
│   ├── plugins/            # Vue 插件
│   └── utils/              # 自动导入的工具
├── assets/                 # 构建处理的资源（CSS、图片）
├── public/                 # 静态资源（按原样提供）
├── server/                 # 服务端代码
│   ├── api/                # API 路由（/api/*）
│   ├── routes/             # 服务端路由
│   ├── middleware/         # 服务端中间件
│   ├── plugins/            # Nitro 插件
│   └── utils/              # 服务端工具（自动导入）
├── content/                # 内容文件（@nuxt/content）
├── layers/                 # 本地层（自动扫描）
├── modules/                # 本地模块
├── nuxt.config.ts          # Nuxt 配置
├── package.json
└── tsconfig.json
```

## Key Directories

### `app/` Directory

Contains all application code. Can also be at root level (without `app/` folder).

```ts
// nuxt.config.ts - customize source directory
export default defineNuxtConfig({
  srcDir: 'src/', // Change from 'app/' to 'src/'
})
```

### `app/components/`

Vue components auto-imported by name:

```
components/
├── Button.vue           → <Button />
├── Card.vue             → <Card />
├── base/
│   └── Button.vue       → <BaseButton />
├── ui/
│   ├── Input.vue        → <UiInput />
│   └── Modal.vue        → <UiModal />
└── TheHeader.vue        → <TheHeader />
```

**Lazy loading**: Prefix with `Lazy` for dynamic import:

```vue
<template>
  <LazyHeavyChart v-if="showChart" />
</template>
```

**Client/Server only**:

```
components/
├── Comments.client.vue  → Only rendered on client
└── ServerData.server.vue → Only rendered on server
```

### `app/composables/`

Vue composables auto-imported (top-level files only):

```
composables/
├── useAuth.ts           → useAuth()
├── useFoo.ts            → useFoo()
└── nested/
    └── utils.ts         → NOT auto-imported
```

Re-export nested composables:

```ts
// composables/index.ts
export { useHelper } from './nested/utils'
```

### `app/pages/`

File-based routing:

```
pages/
├── index.vue            → /
├── about.vue            → /about
├── blog/
│   ├── index.vue        → /blog
│   └── [slug].vue       → /blog/:slug
├── users/
│   └── [id]/
│       └── profile.vue  → /users/:id/profile
├── [...slug].vue        → /* (catch-all)
├── [[optional]].vue     → /:optional? (optional param)
└── (marketing)/         → Route group (not in URL)
    └── pricing.vue      → /pricing
```

**Pages are optional**: Without `pages/`, no vue-router is included.

### `app/layouts/`

Layout components wrapping pages:

```
layouts/
├── default.vue          → Default layout
├── admin.vue            → Admin layout
└── blank.vue            → No layout
```

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <TheHeader />
    <slot />
    <TheFooter />
  </div>
</template>
```

Use in pages:

```vue
<script setup>
definePageMeta({
  layout: 'admin',
  // layout: false // Disable layout
})
</script>
```

### `app/middleware/`

Route middleware:

```
middleware/
├── auth.ts              → Named middleware
├── admin.ts             → Named middleware
└── logger.global.ts     → Global middleware (runs on every route)
```

### `app/plugins/`

Nuxt plugins (auto-registered):

```
plugins/
├── 01.analytics.ts      → Order with number prefix
├── 02.auth.ts
├── vue-query.client.ts  → Client-only plugin
└── server-init.server.ts → Server-only plugin
```

### `server/` Directory

Nitro server code:

```
server/
├── api/
│   ├── users.ts         → GET /api/users
│   ├── users.post.ts    → POST /api/users
│   └── users/[id].ts    → /api/users/:id
├── routes/
│   └── sitemap.xml.ts   → /sitemap.xml
├── middleware/
│   └── auth.ts          → Runs on every request
├── plugins/
│   └── db.ts            → Server startup plugins
└── utils/
    └── db.ts            → Auto-imported server utilities
```

### `public/` Directory

Static assets served at root URL:

```
public/
├── favicon.ico          → /favicon.ico
├── robots.txt           → /robots.txt
└── images/
    └── logo.png         → /images/logo.png
```

### `assets/` Directory

Build-processed assets:

```
assets/
├── css/
│   └── main.css
├── images/
│   └── hero.png
└── fonts/
    └── custom.woff2
```

Reference in components:

```vue
<template>
  <img src="~/assets/images/hero.png" />
</template>

<style>
@import '~/assets/css/main.css';
</style>
```

## Special Files

| File | Purpose |
|------|---------|
| `app.vue` | Root component (optional with pages/) |
| `app.config.ts` | Runtime app configuration |
| `error.vue` | Custom error page |
| `nuxt.config.ts` | Build-time configuration |
| `.nuxtignore` | Ignore files from Nuxt |
| `.env` | Environment variables |

## File Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `[param]` | Dynamic route parameter |
| `[[param]]` | Optional parameter |
| `[...slug]` | Catch-all route |
| `(group)` | Route group (not in URL) |
| `.client.vue` | Client-only component |
| `.server.vue` | Server-only component |
| `.global.ts` | Global middleware |

<!-- 
Source references:
- https://nuxt.com/docs/directory-structure
- https://nuxt.com/docs/directory-structure/app
- https://nuxt.com/docs/directory-structure/server
-->
