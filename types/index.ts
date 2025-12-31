// 网络条件类型
export type NetworkCondition = 'wifi' | '4g' | '3g' | '2g'

// CPU节流类型
export type CPUThrottle = 'none' | '4x' | '6x'

// 设备类型
export type DeviceType = 'high-end' | 'mid-range' | 'low-end'

// 缓存状态
export type CacheStatus = 'first-load' | 'cached' | 'offline'

// 性能指标
export interface PerformanceMetrics {
  // 核心指标
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  
  // 辅助指标
  ttfb: number // Time to First Byte
  inp: number // Interaction to Next Paint
  tti: number // Time to Interactive
  si: number // Speed Index
  
  // 资源指标
  totalSize: number // 页面总大小 (KB)
  requestCount: number // 请求数
  jsSize: number // JS体积 (KB)
  cssSize: number // CSS体积 (KB)
}

// 优化方案
export interface OptimizationSolution {
  id: string
  name: string
  category: string
  description: string
  principle: string
  implementationCost: 'low' | 'medium' | 'high'
  applicableScenarios: string[]
  codeExample: string
  metrics: PerformanceMetrics
}

// 场景配置
export interface ScenarioConfig {
  network: NetworkCondition
  cpuThrottle: CPUThrottle
  deviceType: DeviceType
  cacheStatus: CacheStatus
}

// 对比数据
export interface ComparisonData {
  solution: OptimizationSolution
  baseline: PerformanceMetrics
  optimized: PerformanceMetrics
  improvement: {
    lcp: number
    fid: number
    cls: number
    fcp: number
    [key: string]: number
  }
}

