---
name: composables-auto-imports
description: Auto-imported Vue APIs, Nuxt composables, and custom utilities
---

# Composables 自动导入

Nuxt 会自动导入 Vue API、Nuxt composables 以及你的自定义 composables/工具函数。

## 内置自动导入

### Vue API

```vue
<script setup lang="ts">
// No imports needed - all auto-imported
const count = ref(0)
const doubled = computed(() => count.value * 2)

watch(count, (newVal) => {
  console.log('Count changed:', newVal)
})

onMounted(() => {
  console.log('Component mounted')
})

// Lifecycle hooks
onBeforeMount(() => {})
onUnmounted(() => {})
onBeforeUnmount(() => {})

// Reactivity
const state = reactive({ name: 'John' })
const shallow = shallowRef({ deep: 'object' })
</script>
```

### Nuxt Composables

```vue
<script setup lang="ts">
// All auto-imported
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const appConfig = useAppConfig()
const nuxtApp = useNuxtApp()

// Data fetching
const { data } = await useFetch('/api/data')
const { data: asyncData } = await useAsyncData('key', () => fetchData())

// State
const state = useState('key', () => 'initial')
const cookie = useCookie('token')

// Head/SEO
useHead({ title: 'My Page' })
useSeoMeta({ description: 'Page description' })

// Request helpers (SSR)
const headers = useRequestHeaders()
const event = useRequestEvent()
const url = useRequestURL()
</script>
```

## 自定义 Composables（`app/composables/`）

### 创建 Composable

```ts
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}
```

```ts
// composables/useAuth.ts
export function useAuth() {
  const user = useState<User | null>('user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: Credentials) {
    user.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
}
```

### 使用 Composable

```vue
<script setup lang="ts">
// Auto-imported - no import statement needed
const { count, increment } = useCounter(10)
const { user, isLoggedIn, login } = useAuth()
</script>
```

### 文件扫描规则

仅扫描顶层文件：

```
composables/
├── useAuth.ts         → useAuth() ✓
├── useCounter.ts      → useCounter() ✓
├── index.ts           → exports ✓
└── nested/
    └── helper.ts      → NOT auto-imported ✗
```

重新导出嵌套 composables：

```ts
// composables/index.ts
export { useHelper } from './nested/helper'
```

或配置扫描范围：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables',
      'composables/**', // Scan all nested
    ],
  },
})
```

## 工具函数（`app/utils/`）

```ts
// utils/format.ts
export function formatDate(date: Date) {
  return date.toLocaleDateString()
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
```

```vue
<script setup lang="ts">
// Auto-imported
const date = formatDate(new Date())
const price = formatCurrency(99.99)
</script>
```

## 服务端工具（`server/utils/`）

```ts
// server/utils/db.ts
export function useDb() {
  return createDbConnection()
}

// server/utils/auth.ts
export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
```

```ts
// server/api/users.ts
export default defineEventHandler(() => {
  const db = useDb() // Auto-imported
  return db.query('SELECT * FROM users')
})
```

## 第三方包导入

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
      {
        from: 'date-fns',
        imports: ['format', 'parseISO', 'differenceInDays'],
      },
      {
        from: '@vueuse/core',
        imports: ['useMouse', 'useWindowSize'],
      },
    ],
  },
})
```

## 显式导入

需要时使用 `#imports` 别名：

```vue
<script setup lang="ts">
import { ref, computed, useFetch } from '#imports'
</script>
```

## Composable 上下文规则

Nuxt composables 必须在合法上下文中调用：

```ts
// ❌ Wrong - module level
const config = useRuntimeConfig()

export function useMyComposable() {}
```

```ts
// ✅ Correct - inside function
export function useMyComposable() {
  const config = useRuntimeConfig()
  return { apiBase: config.public.apiBase }
}
```

**合法上下文：**
- `<script setup>` 块
- `setup()` 函数
- `defineNuxtPlugin()` 回调
- `defineNuxtRouteMiddleware()` 回调

## 关闭自动导入

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // Disable all auto-imports
  imports: {
    autoImport: false,
  },

  // Or disable only directory scanning (keep Vue/Nuxt imports)
  imports: {
    scan: false,
  },
})
```

<!-- 
Source references:
- https://nuxt.com/docs/guide/concepts/auto-imports
- https://nuxt.com/docs/directory-structure/app/composables
- https://nuxt.com/docs/directory-structure/app/utils
-->
