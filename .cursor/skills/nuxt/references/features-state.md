---
name: state-management
description: useState composable and SSR-friendly state management in Nuxt
---

# 状态管理

Nuxt 提供 `useState` 用于 SSR 友好的响应式状态，可在组件间持久共享。

## useState

`ref` 的 SSR 安全替代，在组件间共享状态：

```vue
<script setup lang="ts">
// State is shared by key 'counter' across all components
const counter = useState('counter', () => 0)
</script>

<template>
  <div>
    Counter: {{ counter }}
    <button @click="counter++">+</button>
    <button @click="counter--">-</button>
  </div>
</template>
```

## 创建共享状态

定义可复用的状态组合式：

```ts
// composables/useUser.ts
export function useUser() {
  return useState<User | null>('user', () => null)
}

export function useLocale() {
  return useState('locale', () => 'en')
}
```

```vue
<script setup lang="ts">
// Same state instance everywhere
const user = useUser()
const locale = useLocale()
</script>
```

## 初始化状态

使用 `callOnce` 以异步数据初始化状态：

```vue
<script setup lang="ts">
const config = useState('site-config')

await callOnce(async () => {
  config.value = await $fetch('/api/config')
})
</script>
```

## 最佳实践

### ❌ 不要在 Setup 外定义状态

```ts
// ❌ Wrong - causes memory leaks and shared state across requests
export const globalState = ref({ user: null })
```

### ✅ 改用 useState

```ts
// ✅ Correct - SSR-safe
export const useGlobalState = () => useState('global', () => ({ user: null }))
```

## 清除状态

```ts
// Clear specific state
clearNuxtState('counter')

// Clear multiple states
clearNuxtState(['counter', 'user'])

// Clear all state (use with caution)
clearNuxtState()
```

## 配合 Pinia

用于复杂状态管理时，可使用 Pinia：

```bash
npx nuxi module add pinia
```

```ts
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})
```

```ts
// stores/user.ts (Composition API style)
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: Credentials) {
    user.value = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    })
  }

  return { user, isLoggedIn, login }
})
```

```vue
<script setup lang="ts">
const counterStore = useCounterStore()
const userStore = useUserStore()

// Initialize store data once
await callOnce(async () => {
  await userStore.fetchUser()
})
</script>
```

## 进阶：语言环境示例

```ts
// composables/useLocale.ts
export function useLocale() {
  return useState('locale', () => useDefaultLocale().value)
}

export function useDefaultLocale(fallback = 'en-US') {
  const locale = ref(fallback)

  if (import.meta.server) {
    const reqLocale = useRequestHeaders()['accept-language']?.split(',')[0]
    if (reqLocale) locale.value = reqLocale
  }
  else if (import.meta.client) {
    const navLang = navigator.language
    if (navLang) locale.value = navLang
  }

  return locale
}
```

## 状态序列化

`useState` 的值会被序列化为 JSON。请避免：

- 函数
- 类
- Symbol
- 循环引用

```ts
// ❌ Won't work
useState('fn', () => () => console.log('hi'))
useState('instance', () => new MyClass())

// ✅ Works
useState('data', () => ({ name: 'John', age: 30 }))
useState('items', () => ['a', 'b', 'c'])
```

<!-- 
Source references:
- https://nuxt.com/docs/getting-started/state-management
- https://nuxt.com/docs/api/composables/use-state
- https://nuxt.com/docs/api/utils/clear-nuxt-state
-->
