// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  // 将 CSS 内联到首屏 HTML，避免外部 link 阻塞渲染
  features: {
    inlineStyles: true
  },
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
  compatibilityDate: '2024-12-31',
  // 静态资源预压缩，减少传输体积（JS/CSS 等）
  nitro: {
    compressPublicAssets: true
  }
})