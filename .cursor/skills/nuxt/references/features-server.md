---
name: server-routes
description: API routes, server middleware, and Nitro server engine in Nuxt
---

# 服务端路由

Nuxt 内置 Nitro 服务端引擎，用于通过 API 路由和服务端中间件构建全栈应用。

## API 路由

在 `server/api/` 目录下创建文件：

```ts
// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: 'Hello World' }
})
```

访问路径为 `/api/hello`。

### HTTP 方法

```ts
// server/api/users.get.ts - GET /api/users
export default defineEventHandler(() => {
  return getUsers()
})

// server/api/users.post.ts - POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return createUser(body)
})

// server/api/users/[id].put.ts - PUT /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  return updateUser(id, body)
})

// server/api/users/[id].delete.ts - DELETE /api/users/:id
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return deleteUser(id)
})
```

### 路由参数

```ts
// server/api/posts/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return getPost(id)
})

// Catch-all: server/api/[...path].ts
export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path')
  return { path }
})
```

### 查询参数

```ts
// server/api/search.ts
// GET /api/search?q=nuxt&page=1
export default defineEventHandler((event) => {
  const query = getQuery(event)
  // { q: 'nuxt', page: '1' }
  return search(query.q, Number(query.page))
})
```

### 请求体

```ts
// server/api/submit.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Validate and process body
  return { success: true, data: body }
})
```

### 请求头与 Cookie

```ts
// server/api/auth.ts
export default defineEventHandler((event) => {
  // Read headers
  const auth = getHeader(event, 'authorization')

  // Read cookies
  const cookies = parseCookies(event)
  const token = getCookie(event, 'token')

  // Set headers
  setHeader(event, 'X-Custom-Header', 'value')

  // Set cookies
  setCookie(event, 'token', 'new-token', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // 1 day
  })

  return { authenticated: !!token }
})
```

## 服务端中间件

在每次请求到达路由前执行：

```ts
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  // Attach data to event context
  event.context.user = token ? verifyToken(token) : null
})

// server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log(`${event.method} ${event.path}`)
})
```

在路由中访问上下文：

```ts
// server/api/profile.ts
export default defineEventHandler((event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
})
```

## 错误处理

```ts
// server/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const user = findUser(id)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return user
})
```

## 服务端工具

在 `server/utils/` 下自动导入：

```ts
// server/utils/db.ts
export function useDb() {
  return createDbConnection()
}
```

```ts
// server/api/users.ts
export default defineEventHandler(() => {
  const db = useDb() // Auto-imported
  return db.query('SELECT * FROM users')
})
```

## 服务端插件

服务启动时执行一次：

```ts
// server/plugins/db.ts
export default defineNitroPlugin((nitroApp) => {
  // Initialize database connection
  const db = createDbConnection()

  // Add to context
  nitroApp.hooks.hook('request', (event) => {
    event.context.db = db
  })
})
```

## 流式响应

```ts
// server/api/stream.ts
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(`data: ${JSON.stringify({ count: i })}\n\n`)
        await new Promise(r => setTimeout(r, 1000))
      }
      controller.close()
    },
  })

  return stream
})
```

## 服务端存储

支持多种驱动的键值存储：

```ts
// server/api/cache.ts
export default defineEventHandler(async (event) => {
  const storage = useStorage()

  // Set value
  await storage.setItem('key', { data: 'value' })

  // Get value
  const data = await storage.getItem('key')

  return data
})
```

在 `nuxt.config.ts` 中配置存储驱动：

```ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        url: 'redis://localhost:6379',
      },
    },
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/server
- https://nuxt.com/docs/directory-structure/server
- https://nitro.build/guide
-->
