---
name: cli-commands
description: Nuxt CLI commands for development, building, and project management
---

# CLI 命令

Nuxt 通过 `nuxi`（或 `npx nuxt`）提供 CLI 命令，用于开发、构建和项目管理。

## 项目初始化

### 创建新项目

```bash
# Interactive project creation
npx nuxi@latest init my-app

# With specific package manager
npx nuxi@latest init my-app --packageManager pnpm

# With modules
npx nuxi@latest init my-app --modules "@nuxt/ui,@nuxt/image"

# From template
npx nuxi@latest init my-app --template v3

# Skip module selection prompt
npx nuxi@latest init my-app --no-modules
```

**选项：**
| Option | Description |
|--------|-------------|
| `-t, --template` | 模板名称 |
| `--packageManager` | npm、pnpm、yarn 或 bun |
| `-M, --modules` | 要安装的模块（逗号分隔） |
| `--gitInit` | 初始化 git 仓库 |
| `--no-install` | 跳过安装依赖 |

## 开发

### 启动开发服务器

```bash
# Start development server (default: http://localhost:3000)
npx nuxt dev

# Custom port
npx nuxt dev --port 4000

# Open in browser
npx nuxt dev --open

# Listen on all interfaces (for mobile testing)
npx nuxt dev --host 0.0.0.0

# With HTTPS
npx nuxt dev --https

# Clear console on restart
npx nuxt dev --clear

# Create public tunnel
npx nuxt dev --tunnel
```

**选项：**
| Option | Description |
|--------|-------------|
| `-p, --port` | 监听端口 |
| `-h, --host` | 监听主机 |
| `-o, --open` | 在浏览器中打开 |
| `--https` | 启用 HTTPS |
| `--tunnel` | 创建公网隧道（通过 untun） |
| `--qr` | 显示移动端二维码 |
| `--clear` | 重启时清空控制台 |

**环境变量：**
- `NUXT_PORT` 或 `PORT` - 默认端口
- `NUXT_HOST` 或 `HOST` - 默认主机

## 构建

### 生产构建

```bash
# Build for production
npx nuxt build

# Build with prerendering
npx nuxt build --prerender

# Build with specific preset
npx nuxt build --preset node-server
npx nuxt build --preset cloudflare-pages
npx nuxt build --preset vercel

# Build with environment
npx nuxt build --envName staging
```

输出创建在 `.output/` 目录。

### 静态生成

```bash
# Generate static site (prerenders all routes)
npx nuxt generate
```

等同于 `nuxt build --prerender`。创建静态 HTML 文件以供部署到静态托管。

### 预览生产构建

```bash
# Preview after build
npx nuxt preview

# Custom port
npx nuxt preview --port 4000
```

## 工具

### Prepare（类型生成）

```bash
# Generate TypeScript types and .nuxt directory
npx nuxt prepare
```

克隆后或类型缺失时运行。

### 类型检查

```bash
# Run TypeScript type checking
npx nuxt typecheck
```

### 分析打包

```bash
# Analyze production bundle
npx nuxt analyze
```

打开可视化打包分析器。

### 清理

```bash
# Remove generated files (.nuxt, .output, node_modules/.cache)
npx nuxt cleanup
```

### 信息

```bash
# Show environment info (useful for bug reports)
npx nuxt info
```

### Upgrade

```bash
# Upgrade Nuxt to latest version
npx nuxt upgrade

# Upgrade to nightly release
npx nuxt upgrade --nightly
```

## 模块命令

### 添加模块

```bash
# Add a Nuxt module
npx nuxt module add @nuxt/ui
npx nuxt module add @nuxt/image
```

安装并添加到 `nuxt.config.ts`。

### 构建模块（供模块作者使用）

```bash
# Build a Nuxt module
npx nuxt build-module
```

## 开发工具

```bash
# Enable DevTools globally
npx nuxt devtools enable

# Disable DevTools
npx nuxt devtools disable
```

## 常见工作流

### 开发

```bash
# 安装依赖并启动开发服务器
pnpm install
pnpm dev  # or npx nuxt dev
```

### 生产部署

```bash
# Build and preview locally
pnpm build
pnpm preview

# Or for static hosting
pnpm generate
```

### 克隆后

```bash
# 安装依赖并准备类型
pnpm install
npx nuxt prepare
```

## 环境特定构建

```bash
# Development build
npx nuxt build --envName development

# Staging build
npx nuxt build --envName staging

# Production build (default)
npx nuxt build --envName production
```

对应 `nuxt.config.ts` 中的 `$development`、`$env.staging`、`$production`。

## 层扩展

```bash
# Dev with additional layer
npx nuxt dev --extends ./base-layer

# Build with layer
npx nuxt build --extends ./base-layer
```

<!-- 
Source references:
- https://nuxt.com/docs/api/commands/dev
- https://nuxt.com/docs/api/commands/build
- https://nuxt.com/docs/api/commands/generate
- https://nuxt.com/docs/api/commands/init
-->
