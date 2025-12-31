# 前端性能优化场景化对比与决策平台

## 项目简介

一站式可视化平台，通过模拟真实场景（如弱网、低端设备），量化展示各优化方案的效果差异，为开发团队提供数据驱动的优化方案选型依据。

## 核心功能

### 1. 场景化总览看板
- 展示所有12种优化方案的概览
- 按分类组织展示（代码分割、资源优化、渲染优化、渲染策略、构建优化、缓存策略）
- 显示实施成本标签
- 快速跳转到详情页

### 2. 优化方案详情对比页
包含三个核心模块：

#### 2.1 场景压力模拟控制面板
- **网络条件**: Wi-Fi (Fast 3G)、4G (Slow 3G)、3G (Emerging 3G)、2G
- **CPU节流**: 无节流、4倍减速、6倍减速
- **设备类型**: 高端设备、中端设备、低端设备
- **缓存状态**: 首次加载、缓存有效、离线模式

#### 2.2 对比数据可视化展示
- **实时对比图表**: 使用Chart.js展示性能指标对比
- **核心性能指标**: LCP、FID、CLS、FCP、TTFB、TTI
- **资源指标**: 页面总大小、请求数、JS/CSS体积
- **改进百分比**: 直观显示优化效果

#### 2.3 方案说明面板
- **原理说明**: 详细的技术原理
- **实施成本**: 低/中/高成本标签
- **适用场景**: 列出适用场景
- **代码示例**: 可直接复用的代码实现

### 3. 优化方案库
包含12种优化方案：
1. 路由级懒加载
2. 组件级懒加载
3. 现代图片格式优化
4. 响应式图片
5. 图片懒加载
6. 图标与矢量图优化
7. 虚拟列表
8. SSG (静态站点生成)
9. SSR (服务端渲染)
10. 依赖预构建
11. 文件压缩策略
12. HTTP缓存优化

## 技术栈

- **框架**: Nuxt 3 (Vue 3 + SSR)
- **数据库**: MongoDB
- **样式**: Tailwind CSS
- **图表**: Chart.js
- **UI组件**: Headless UI + Heroicons
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置MongoDB

创建 `.env` 文件：

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=performance_platform
```

或者使用MongoDB Atlas连接字符串：

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=performance_platform
```

### 3. 初始化数据库

启动开发服务器后，访问以下API端点初始化数据库：

```bash
# 使用浏览器直接访问（GET请求）
http://localhost:3000/api/init

# 或使用curl
curl http://localhost:3000/api/init
```

这将创建两个集合：
- `solutions`: 存储所有优化方案信息
- `performance_metrics`: 存储所有场景组合的性能指标数据

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
```

### 6. 预览生产版本

```bash
npm run preview
```

## 数据库结构

### solutions 集合
存储优化方案的基本信息：
```typescript
{
  id: string                    // 方案ID
  name: string                  // 方案名称
  category: string              // 分类
  description: string           // 描述
  principle: string             // 原理说明
  implementationCost: string    // 实施成本: 'low' | 'medium' | 'high'
  applicableScenarios: string[] // 适用场景
  codeExample: string           // 代码示例
  metrics: PerformanceMetrics   // 占位指标（实际从performance_metrics获取）
}
```

### performance_metrics 集合
存储性能指标数据，按场景组合索引：
```typescript
{
  solutionId: string            // 方案ID或'baseline'
  network: string               // 网络条件
  cpuThrottle: string           // CPU节流
  deviceType: string            // 设备类型
  cacheStatus: string           // 缓存状态
  metrics: PerformanceMetrics   // 性能指标
  createdAt: Date              // 创建时间
}
```

**索引建议**：
```javascript
db.performance_metrics.createIndex({ 
  solutionId: 1, 
  network: 1, 
  cpuThrottle: 1, 
  deviceType: 1, 
  cacheStatus: 1 
}, { unique: true })
```

## API端点

### GET /api/solutions
获取所有优化方案列表

### GET /api/solutions/:id
获取指定ID的优化方案详情

### POST /api/performance/comparison
获取性能对比数据

请求体：
```json
{
  "solutionId": "route-lazy-loading",
  "network": "4g",
  "cpuThrottle": "none",
  "deviceType": "mid-range",
  "cacheStatus": "first-load"
}
```

响应：
```json
{
  "baseline": { /* 基准性能指标 */ },
  "optimized": { /* 优化后性能指标 */ },
  "improvement": { /* 改进百分比 */ }
}
```

### GET /api/init
初始化数据库（仅开发环境使用）

直接在浏览器中访问此URL即可初始化数据库，无需POST请求。

## 项目结构

```
├── assets/
│   └── css/              # 全局样式
├── components/           # Vue组件
│   ├── MetricsComparison.vue      # 指标对比表格
│   ├── PerformanceChart.vue       # 性能对比图表
│   ├── ScenarioControlPanel.vue  # 场景控制面板
│   └── SolutionInfo.vue           # 方案说明面板
├── composables/         # 组合式函数
│   ├── usePerformance.ts         # 性能测试相关
│   └── useSolutions.ts            # 优化方案数据
├── layouts/             # 布局组件
│   └── default.vue               # 默认布局
├── pages/               # 页面路由
│   ├── index.vue                 # 总览页面
│   └── solutions/
│       ├── index.vue             # 方案库页面
│       └── [id].vue              # 方案详情页
├── server/              # 服务端代码
│   ├── api/            # API路由
│   └── utils/          # 工具函数
│       ├── db.ts       # 数据库连接
│       └── seedData.ts # 初始数据
├── types/               # TypeScript类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── performance.ts           # 性能模拟工具
├── app.vue              # 根组件
├── error.vue            # 错误页面
├── nuxt.config.ts       # Nuxt配置
└── package.json         # 项目配置
```

## 特性

- ✅ **SSR支持**: 完整的服务端渲染，提升SEO和首屏加载速度
- ✅ **MongoDB集成**: 数据持久化存储，支持复杂查询
- ✅ **响应式设计**: 适配桌面端和移动端
- ✅ **实时场景模拟**: 动态调整场景参数，实时查看性能变化
- ✅ **数据可视化**: 直观的图表展示性能对比
- ✅ **TypeScript**: 完整的类型支持
- ✅ **现代化UI**: 使用Tailwind CSS构建美观的界面

## 性能指标说明

### 核心指标 (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间
- **FID (First Input Delay)**: 首次输入延迟
- **CLS (Cumulative Layout Shift)**: 累积布局偏移

### 辅助指标
- **FCP (First Contentful Paint)**: 首次内容绘制
- **TTFB (Time to First Byte)**: 首字节时间
- **TTI (Time to Interactive)**: 可交互时间
- **SI (Speed Index)**: 速度指数
- **INP (Interaction to Next Paint)**: 交互到下次绘制

## 开发说明

1. **首次运行**: 需要先初始化数据库（调用 `/api/init`）
2. **数据更新**: 修改 `server/utils/seedData.ts` 后重新初始化
3. **性能数据**: 当前使用模拟算法生成，实际项目中可以接入真实的性能测试API

## 许可证

MIT
