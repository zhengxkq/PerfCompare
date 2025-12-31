import { connectToDatabase } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { solutionId, network, cpuThrottle, deviceType, cacheStatus } = body

    const db = await connectToDatabase()
    
    // 查找优化后的性能指标
    const optimizedMetrics = await db.collection('performance_metrics').findOne({
      solutionId,
      network,
      cpuThrottle,
      deviceType,
      cacheStatus
    })

    // 查找基准性能指标（无优化）
    const baselineMetrics = await db.collection('performance_metrics').findOne({
      solutionId: 'baseline',
      network,
      cpuThrottle,
      deviceType,
      cacheStatus
    })

    if (!optimizedMetrics || !baselineMetrics) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Performance metrics not found'
      })
    }

    // 计算改进百分比
    const improvement: Record<string, number> = {}
    const metrics = ['lcp', 'fcp', 'fid', 'cls', 'ttfb', 'inp', 'tti', 'si', 'totalSize', 'requestCount', 'jsSize', 'cssSize']
    
    metrics.forEach(metric => {
      const baseline = baselineMetrics.metrics[metric] || 0
      const optimized = optimizedMetrics.metrics[metric] || 0
      if (baseline > 0) {
        improvement[metric] = Math.round(((baseline - optimized) / baseline) * 100)
      } else {
        improvement[metric] = 0
      }
    })

    return {
      baseline: baselineMetrics.metrics,
      optimized: optimizedMetrics.metrics,
      improvement
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch performance comparison'
    })
  }
})

