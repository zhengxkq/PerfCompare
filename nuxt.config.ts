// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '前端性能优化场景化对比与决策平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '一站式可视化平台，通过模拟真实场景量化展示各优化方案的效果差异' }
      ]
    }
  },
  ssr: true,
  compatibilityDate: '2024-01-01'
})

