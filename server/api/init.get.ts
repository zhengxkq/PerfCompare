import { connectToDatabase } from '~/server/utils/db'
import { solutionsData } from '~/server/utils/seedData'

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase()
    
    // 初始化解决方案数据
    const solutionsCollection = db.collection('solutions')
    await solutionsCollection.deleteMany({})
    await solutionsCollection.insertMany(solutionsData)
    
    // 初始化性能指标数据
    const metricsCollection = db.collection('performance_metrics')
    await metricsCollection.deleteMany({})
    
    // 生成所有场景组合的性能数据
    const networks = ['wifi', '4g', '3g', '2g']
    const cpuThrottles = ['none', '4x', '6x']
    const deviceTypes = ['high-end', 'mid-range', 'low-end']
    const cacheStatuses = ['first-load', 'cached', 'offline']
    const solutionIds = ['baseline', ...solutionsData.map(s => s.id)]
    
    const metricsData: any[] = []
    
    for (const solutionId of solutionIds) {
      for (const network of networks) {
        for (const cpuThrottle of cpuThrottles) {
          for (const deviceType of deviceTypes) {
            for (const cacheStatus of cacheStatuses) {
              // 使用模拟函数生成数据
              const metrics = generateMetrics(solutionId, network, cpuThrottle, deviceType, cacheStatus)
              metricsData.push({
                solutionId,
                network,
                cpuThrottle,
                deviceType,
                cacheStatus,
                metrics,
                createdAt: new Date()
              })
            }
          }
        }
      }
    }
    
    if (metricsData.length > 0) {
      await metricsCollection.insertMany(metricsData)
    }
    
    return {
      success: true,
      solutionsCount: solutionsData.length,
      metricsCount: metricsData.length,
      message: '数据库初始化成功'
    }
  } catch (error) {
    console.error('Init error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to initialize database'
    })
  }
})

// 模拟生成性能指标的函数
function generateMetrics(
  solutionId: string,
  network: string,
  cpuThrottle: string,
  deviceType: string,
  cacheStatus: string
) {
  // 这里使用之前的模拟逻辑
  const networkConfigs: Record<string, { latency: number }> = {
    wifi: { latency: 5 },
    '4g': { latency: 50 },
    '3g': { latency: 200 },
    '2g': { latency: 1000 }
  }
  
  const cpuThrottleConfigs: Record<string, number> = {
    none: 1,
    '4x': 4,
    '6x': 6
  }
  
  const deviceConfigs: Record<string, { cpu: number }> = {
    'high-end': { cpu: 1 },
    'mid-range': { cpu: 0.5 },
    'low-end': { cpu: 0.25 }
  }
  
  const networkConfig = networkConfigs[network] || networkConfigs['4g']
  const cpuMultiplier = cpuThrottleConfigs[cpuThrottle] || 1
  const deviceConfig = deviceConfigs[deviceType] || deviceConfigs['mid-range']
  
  const baseLCP = 2500
  const baseFCP = 1800
  const baseTTFB = 200
  const baseFID = 100
  const baseCLS = 0.1
  const baseTTI = 3500
  const baseSI = 3000
  const baseINP = 200
  
  const networkFactor = networkConfig.latency / 50
  const cpuFactor = cpuMultiplier
  const deviceFactor = 1 / deviceConfig.cpu
  const cacheFactor = cacheStatus === 'cached' ? 0.3 : cacheStatus === 'offline' ? 0.1 : 1
  
  const solutionFactors: Record<string, { lcp: number; fcp: number; fid: number; cls: number; size: number }> = {
    'baseline': { lcp: 1, fcp: 1, fid: 1, cls: 1, size: 1 },
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
  
  const factors = solutionFactors[solutionId] || { lcp: 1, fcp: 1, fid: 1, cls: 1, size: 1 }
  
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

