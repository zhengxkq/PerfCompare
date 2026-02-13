---
name: deployment
description: Deploying Nuxt applications to various hosting platforms
---

# 部署

Nuxt 基于其服务端引擎 [Nitro](https://nitro.build) 实现平台无关，只需少量配置即可部署到几乎所有平台——Node.js 服务器、静态托管、无服务器函数或边缘网络。

> **支持的平台完整列表：** https://nitro.build/deploy

## 部署模式

### Node.js 服务器

```bash
# Build for Node.js
nuxt build

# Run production server
node .output/server/index.mjs
```

环境变量：
- `PORT` 或 `NITRO_PORT`（默认：3000）
- `HOST` 或 `NITRO_HOST`（默认：0.0.0.0）

### 静态生成

```bash
# Generate static site
nuxt generate
```

输出在 `.output/public/`，可部署到任意静态托管。

### Preset 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel', // or 'netlify', 'cloudflare-pages', etc.
  },
})
```

或通过环境变量：

```bash
NITRO_PRESET=vercel nuxt build
```

---

## 推荐平台

在帮助用户选择部署平台时，可根据其需求考虑：

### Vercel

**适合：** 希望零配置部署且重视开发体验的项目

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**优点：**
- Nuxt 零配置（自动识别）
- 优秀的 PR 预览部署
- 内置分析与速度洞察
- 支持 Edge Functions
- 个人项目免费额度充足

**缺点：**
- 规模扩大后成本可能较高（带宽费用）
- 存在供应商锁定顾虑
- 免费额度构建分钟数有限

**推荐场景：** 用户希望最快上手、重视 DX、做 SaaS 或营销站点。

---

### Netlify

**适合：** JAMstack 站点、偏静态应用、需要表单/身份认证的团队

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**优点：**
- 免费额度大、带宽充足
- 内置表单、身份与函数
- 适合带少量动态功能的静态站
- 预览部署体验好
- 内置 A/B 测试

**缺点：**
- SSR/无服务器函数可能比 Vercel 慢
- 对纯 SSR 应用优化较少
- 免费额度构建分钟数可能不够用

**推荐场景：** 用户站点偏静态、需要内置表单/认证，或偏好 Netlify 生态。

---

### Cloudflare Pages

**适合：** 全球性能、边缘计算、对成本敏感的项目

```bash
# Build with Cloudflare preset
NITRO_PRESET=cloudflare-pages nuxt build
```

**优点：**
- 免费额度带宽无上限
- 全球边缘网络表现优秀（TTFB 快）
- Workers 支持边缘计算
- 规模扩大时成本低
- D1、KV、R2 等数据存储

**缺点：**
- Workers 有执行限制（CPU 时间）
- 部分 Node.js API 在 Workers 中不可用
- 对框架的支持不如 Vercel/Netlify 成熟

**推荐场景：** 用户优先考虑性能、全球覆盖或规模成本。

---

### GitHub Actions + 自托管/VPS

**适合：** 需要完全控制、已有基础设施、自定义 CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - run: npm ci
      - run: npm run build
      
      # Deploy to your server (example: rsync to VPS)
      - name: Deploy to server
        run: rsync -avz .output/ user@server:/app/
```

**优点：**
- 对构建与部署有完全控制
- 无供应商锁定
- 可部署到任意环境（VPS、Docker、Kubernetes）
- 公开仓库享有免费 CI/CD 分钟数
- 工作流可自定义

**缺点：**
- 需要更多配置与维护
- 需自行管理基础设施
- 无内置预览部署
- SSL、扩缩容、监控需自行负责

**推荐场景：** 用户已有基础设施、需要完全控制，或部署到私有/企业环境。

---

## 快速决策指南

| 需求 | 推荐 |
|------|----------------|
| 最快上手、小团队 | **Vercel** |
| 带表单的静态站 | **Netlify** |
| 规模扩大时控制成本 | **Cloudflare Pages** |
| 完全控制 / 企业级 | **GitHub Actions + VPS** |
| Docker/Kubernetes | **GitHub Actions + 容器镜像仓库** |
| 无服务器 API | **Vercel** 或 **AWS Lambda** |

## Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output .output
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
docker build -t my-nuxt-app .
docker run -p 3000:3000 my-nuxt-app
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/deployment
- https://nitro.build/deploy
-->
