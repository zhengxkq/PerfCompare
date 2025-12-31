import type { OptimizationSolution } from '~/types'

export const solutionsData: OptimizationSolution[] = [
  {
    id: 'route-lazy-loading',
    name: '路由级懒加载',
    category: '代码分割',
    description: '按路由分割代码，减少初始加载体积',
    principle: '通过动态import()实现路由级别的代码分割，只有在访问对应路由时才加载相关代码，显著减少首屏加载时间。',
    implementationCost: 'low',
    applicableScenarios: ['SPA应用', '多页面应用', '路由较多的大型应用'],
    codeExample: `// router/index.js
const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'component-lazy-loading',
    name: '组件级懒加载',
    category: '代码分割',
    description: '按需加载组件，进一步优化加载性能',
    principle: '使用Vue的异步组件和动态import，在组件真正需要时才加载，适用于大型组件或非首屏组件。',
    implementationCost: 'low',
    applicableScenarios: ['大型组件', '弹窗组件', '非首屏组件'],
    codeExample: `// 使用异步组件
const AsyncComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'modern-image-format',
    name: '现代图片格式优化',
    category: '资源优化',
    description: '使用WebP、AVIF等现代图片格式',
    principle: '现代图片格式如WebP、AVIF在保持相同视觉质量的前提下，文件体积比传统JPEG/PNG小30-50%。',
    implementationCost: 'medium',
    applicableScenarios: ['图片较多的页面', '电商网站', '内容展示网站'],
    codeExample: `<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述">
</picture>`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'responsive-image',
    name: '响应式图片',
    category: '资源优化',
    description: '根据设备尺寸加载合适大小的图片',
    principle: '使用srcset和sizes属性，根据设备像素密度和视口宽度加载合适尺寸的图片，避免在小屏设备上加载大图。',
    implementationCost: 'low',
    applicableScenarios: ['移动端适配', '响应式网站', '图片展示页面'],
    codeExample: `<img 
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  src="medium.jpg"
  alt="响应式图片"
>`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'image-lazy-loading',
    name: '图片懒加载',
    category: '资源优化',
    description: '延迟加载视口外的图片',
    principle: '使用loading="lazy"属性或Intersection Observer API，只在图片进入视口时才开始加载，减少初始网络请求。',
    implementationCost: 'low',
    applicableScenarios: ['长列表页面', '图片画廊', '内容流页面'],
    codeExample: `<img 
  src="image.jpg" 
  loading="lazy" 
  alt="懒加载图片"
>`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'icon-optimization',
    name: '图标与矢量图优化',
    category: '资源优化',
    description: '使用SVG或图标字体替代位图图标',
    principle: 'SVG是矢量格式，体积小且可缩放，图标字体可以将多个图标打包成一个字体文件，减少HTTP请求。',
    implementationCost: 'low',
    applicableScenarios: ['图标较多的界面', '需要多尺寸显示的图标', '品牌图标'],
    codeExample: `<!-- 使用SVG -->
<svg width="24" height="24">
  <path d="M12 2L2 7v10l10 5 10-5V7z"/>
</svg>

<!-- 或使用图标字体 -->
<i class="icon-home"></i>`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'virtual-list',
    name: '虚拟列表',
    category: '渲染优化',
    description: '只渲染可见区域的列表项',
    principle: '虚拟滚动只渲染视口内的DOM元素，对于长列表可以大幅减少DOM节点数量，提升滚动性能和内存使用。',
    implementationCost: 'medium',
    applicableScenarios: ['长列表', '数据表格', '无限滚动'],
    codeExample: `// 使用vue-virtual-scroller
<virtual-list
  :data-key="'id'"
  :data-sources="items"
  :data-component="itemComponent"
/>`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'ssg',
    name: 'SSG (静态站点生成)',
    category: '渲染策略',
    description: '构建时预渲染所有页面',
    principle: '在构建时生成所有静态HTML页面，用户访问时直接返回预渲染的HTML，无需服务器端渲染，加载速度最快。',
    implementationCost: 'high',
    applicableScenarios: ['内容静态的网站', '博客', '文档网站', '营销页面'],
    codeExample: `// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'ssr',
    name: 'SSR (服务端渲染)',
    category: '渲染策略',
    description: '服务器端渲染HTML',
    principle: '在服务器端执行Vue组件生成HTML，用户首次访问即可看到完整内容，提升首屏加载速度和SEO。',
    implementationCost: 'high',
    applicableScenarios: ['需要SEO的网站', '首屏加载要求高', '动态内容网站'],
    codeExample: `// 已在Nuxt中启用SSR
export default defineNuxtConfig({
  ssr: true
})`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'dependency-pre-build',
    name: '依赖预构建',
    category: '构建优化',
    description: '预构建第三方依赖',
    principle: '使用Vite等构建工具预构建node_modules中的依赖，将CommonJS转换为ESM，提升开发和生产构建速度。',
    implementationCost: 'low',
    applicableScenarios: ['使用大量第三方库', 'Vite项目', '开发环境优化'],
    codeExample: `// vite.config.js
export default {
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
}`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'file-compression',
    name: '文件压缩策略',
    category: '构建优化',
    description: 'Gzip/Brotli压缩静态资源',
    principle: '在服务器端对静态资源进行Gzip或Brotli压缩，可以减少60-80%的传输体积，显著提升加载速度。',
    implementationCost: 'low',
    applicableScenarios: ['所有Web应用', '静态资源较多', 'CDN部署'],
    codeExample: `// nginx配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  },
  {
    id: 'http-cache',
    name: 'HTTP缓存优化',
    category: '缓存策略',
    description: '合理设置HTTP缓存头',
    principle: '通过Cache-Control、ETag等HTTP头控制浏览器缓存策略，减少重复请求，提升二次访问速度。',
    implementationCost: 'low',
    applicableScenarios: ['静态资源', '不常变更的内容', '所有Web应用'],
    codeExample: `// 服务器配置
Cache-Control: public, max-age=31536000, immutable
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"`,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
      tti: 0,
      si: 0,
      totalSize: 0,
      requestCount: 0,
      jsSize: 0,
      cssSize: 0
    }
  }
]

