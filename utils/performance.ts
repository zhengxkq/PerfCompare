import type { NetworkCondition, CPUThrottle, DeviceType, CacheStatus, PerformanceMetrics, ImprovementMetrics } from '~/types'

// 网络条件配置
export const networkConfigs: Record<NetworkCondition, { download: number; upload: number; latency: number }> = {
  wifi: { download: 50000, upload: 50000, latency: 5 },
  '4g': { download: 10000, upload: 5000, latency: 50 },
  '3g': { download: 1500, upload: 750, latency: 200 },
  '2g': { download: 250, upload: 250, latency: 1000 }
}

// CPU节流配置
export const cpuThrottleConfigs: Record<CPUThrottle, number> = {
  none: 1,
  '4x': 4,
  '6x': 6
}

// 设备性能配置
export const deviceConfigs: Record<DeviceType, { cpu: number; memory: number }> = {
  'high-end': { cpu: 1, memory: 1 },
  'mid-range': { cpu: 0.5, memory: 0.5 },
  'low-end': { cpu: 0.25, memory: 0.25 }
}

// 模拟性能指标（实际项目中应该从真实测试中获取）
export function simulatePerformanceMetrics(
  solution: string,
  network: NetworkCondition,
  cpuThrottle: CPUThrottle,
  deviceType: DeviceType,
  cacheStatus: CacheStatus
): PerformanceMetrics {
  const networkConfig = networkConfigs[network]
  const cpuMultiplier = cpuThrottleConfigs[cpuThrottle]
  const deviceConfig = deviceConfigs[deviceType]
  
  // 基础性能值（毫秒）
  const baseLCP = 2500
  const baseFCP = 1800
  const baseTTFB = 200
  const baseFID = 100
  const baseCLS = 0.1
  const baseTTI = 3500
  const baseSI = 3000
  const baseINP = 200
  
  // 根据场景调整
  const networkFactor = networkConfig.latency / 50
  const cpuFactor = cpuMultiplier
  const deviceFactor = 1 / deviceConfig.cpu
  const cacheFactor = cacheStatus === 'cached' ? 0.3 : cacheStatus === 'offline' ? 0.1 : 1
  
  // 根据优化方案调整（示例）
  const solutionFactors: Record<string, { lcp: number; fcp: number; fid: number; cls: number; size: number }> = {
    'route-lazy-loading': { lcp: 0.7, fcp: 0.6, fid: 0.9, cls: 1.0, size: 0.5 },
    'component-lazy-loading': { lcp: 0.8, fcp: 0.7, fid: 0.9, cls: 1.0, size: 0.6 },
    'modern-image-format': { lcp: 0.6, fcp: 0.5, fid: 1.0, cls: 1.0, size: 0.4 },
    'responsive-image': { lcp: 0.7, fcp: 0.6, fid: 1.0, cls: 1.0, size: 0.5 },
    'image-lazy-loading': { lcp: 0.5, fcp: 0.4, fid: 1.0, cls: 0.9, size: 0.3 },
    'icon-optimization': { lcp: 1.0, fcp: 0.9, fid: 1.0, cls: 1.0, size: 0.2 },
    'virtual-list': { lcp: 0.9, fcp: 0.8, fid: 0.8, cls: 0.9, size: 0.7 },
    'ssg': { lcp: 0.4, fcp: 0.3, fid: 0.7, cls: 1.0, size: 0.6 },
    'ssr': { lcp: 0.5, fcp: 0.4, fid: 0.8, cls: 1.0, size: 0.7 },
    'dependency-pre-build': { lcp: 0.9, fcp: 0.8, fid: 0.9, cls: 1.0, size: 0.8 },
    'file-compression': { lcp: 0.8, fcp: 0.7, fid: 1.0, cls: 1.0, size: 0.5 },
    'http-cache': { lcp: 0.3, fcp: 0.2, fid: 1.0, cls: 1.0, size: 0.3 }
  }
  
  const factors = solutionFactors[solution] || { lcp: 1, fcp: 1, fid: 1, cls: 1, size: 1 }
  
  return {
    lcp: Math.round(baseLCP * networkFactor * cpuFactor * deviceFactor * cacheFactor * factors.lcp),
    fcp: Math.round(baseFCP * networkFactor * cpuFactor * deviceFactor * cacheFactor * factors.fcp),
    ttfb: Math.round(baseTTFB * networkFactor * cacheFactor),
    fid: Math.round(baseFID * cpuFactor * deviceFactor * factors.fid),
    cls: Math.round(baseCLS * factors.cls * 100) / 100,
    tti: Math.round(baseTTI * networkFactor * cpuFactor * deviceFactor * cacheFactor),
    si: Math.round(baseSI * networkFactor * cpuFactor * deviceFactor * cacheFactor),
    inp: Math.round(baseINP * cpuFactor * deviceFactor * factors.fid),
    totalSize: Math.round(2000 * factors.size * (cacheStatus === 'cached' ? 0.3 : 1)),
    requestCount: Math.round(50 * factors.size),
    jsSize: Math.round(800 * factors.size * (cacheStatus === 'cached' ? 0.3 : 1)),
    cssSize: Math.round(200 * factors.size * (cacheStatus === 'cached' ? 0.3 : 1))
  }
}

// 计算改进百分比
export function calculateImprovement(baseline: PerformanceMetrics, optimized: PerformanceMetrics): ImprovementMetrics {
  return {
    lcp: Math.round(((baseline.lcp - optimized.lcp) / baseline.lcp) * 100),
    fcp: Math.round(((baseline.fcp - optimized.fcp) / baseline.fcp) * 100),
    fid: Math.round(((baseline.fid - optimized.fid) / baseline.fid) * 100),
    cls: Math.round(((baseline.cls - optimized.cls) / baseline.cls) * 100),
    ttfb: Math.round(((baseline.ttfb - optimized.ttfb) / baseline.ttfb) * 100),
    inp: Math.round(((baseline.inp - optimized.inp) / baseline.inp) * 100),
    tti: Math.round(((baseline.tti - optimized.tti) / baseline.tti) * 100),
    si: Math.round(((baseline.si - optimized.si) / baseline.si) * 100),
    totalSize: Math.round(((baseline.totalSize - optimized.totalSize) / baseline.totalSize) * 100),
    requestCount: Math.round(((baseline.requestCount - optimized.requestCount) / baseline.requestCount) * 100),
    jsSize: Math.round(((baseline.jsSize - optimized.jsSize) / baseline.jsSize) * 100),
    cssSize: Math.round(((baseline.cssSize - optimized.cssSize) / baseline.cssSize) * 100)
  }
}

