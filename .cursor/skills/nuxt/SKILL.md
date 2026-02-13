---
name: nuxt
description: Nuxt full-stack Vue framework with SSR, auto-imports, and file-based routing. Use when working with Nuxt apps, server routes, useFetch, middleware, or hybrid rendering.
metadata:
  author: Anthony Fu
  version: "2026.1.28"
  source: Generated from https://github.com/nuxt/nuxt, scripts located at https://github.com/antfu/skills
---

Nuxt 是全栈 Vue 框架，提供服务端渲染、基于文件的路由、自动导入以及强大的模块系统。它使用 Nitro 作为服务端引擎，可部署到 Node.js、无服务器和边缘平台。

> 本技能基于 Nuxt 3.x，生成于 2026-01-28。

## 核心

| Topic | Description | Reference |
|-------|-------------|-----------|
| Directory Structure | 项目文件夹结构、约定、文件组织 | [core-directory-structure](references/core-directory-structure.md) |
| Configuration | nuxt.config.ts、app.config.ts、运行时配置、环境变量 | [core-config](references/core-config.md) |
| CLI Commands | 开发服务器、构建、生成、预览及工具命令 | [core-cli](references/core-cli.md) |
| Routing | 基于文件的路由、动态路由、导航、中间件、布局 | [core-routing](references/core-routing.md) |
| Data Fetching | useFetch、useAsyncData、$fetch、缓存、刷新 | [core-data-fetching](references/core-data-fetching.md) |
| Modules | 创建和使用 Nuxt 模块、Nuxt Kit 工具 | [core-modules](references/core-modules.md) |
| Deployment | 基于 Nitro 的平台无关部署，支持 Vercel、Netlify、Cloudflare | [core-deployment](references/core-deployment.md) |

## 功能

| Topic | Description | Reference |
|-------|-------------|-----------|
| Composables Auto-imports | Vue API、Nuxt 组合式函数、自定义组合式、工具函数 | [features-composables](references/features-composables.md) |
| Components Auto-imports | 组件命名、懒加载、水合策略 | [features-components-autoimport](references/features-components-autoimport.md) |
| Built-in Components | NuxtLink、NuxtPage、NuxtLayout、ClientOnly 等 | [features-components](references/features-components.md) |
| State Management | useState 组合式、SSR 友好状态、Pinia 集成 | [features-state](references/features-state.md) |
| Server Routes | API 路由、服务端中间件、Nitro 服务端引擎 | [features-server](references/features-server.md) |

## 渲染

| Topic | Description | Reference |
|-------|-------------|-----------|
| Rendering Modes | 通用（SSR）、客户端（SPA）、混合渲染、路由规则 | [rendering-modes](references/rendering-modes.md) |

## 最佳实践

| Topic | Description | Reference |
|-------|-------------|-----------|
| Data Fetching Patterns | 高效请求、缓存、并行请求、错误处理 | [best-practices-data-fetching](references/best-practices-data-fetching.md) |
| SSR & Hydration | 避免上下文泄漏、水合不匹配、组合式模式 | [best-practices-ssr](references/best-practices-ssr.md) |

## 进阶

| Topic | Description | Reference |
|-------|-------------|-----------|
| Layers | 使用可复用层扩展应用 | [advanced-layers](references/advanced-layers.md) |
| Lifecycle Hooks | 构建时、运行时、服务端钩子 | [advanced-hooks](references/advanced-hooks.md) |
| Module Authoring | 使用 Nuxt Kit 创建可发布的 Nuxt 模块 | [advanced-module-authoring](references/advanced-module-authoring.md) |
