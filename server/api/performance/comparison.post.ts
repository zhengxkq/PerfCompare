import { connectToDatabase } from '~/server/utils/db'
import type { ImprovementMetrics } from '~/types'

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

    // 计算改进百分比 - 确保包含必需的字段
    const calculateImprovementValue = (baseline: number, optimized: number): number => {
      if (baseline > 0) {
        return Math.round(((baseline - optimized) / baseline) * 100)
      }
      return 0
    }

    const improvement: ImprovementMetrics = {
      lcp: calculateImprovementValue(baselineMetrics.metrics.lcp, optimizedMetrics.metrics.lcp),
      fcp: calculateImprovementValue(baselineMetrics.metrics.fcp, optimizedMetrics.metrics.fcp),
      fid: calculateImprovementValue(baselineMetrics.metrics.fid, optimizedMetrics.metrics.fid),
      cls: calculateImprovementValue(baselineMetrics.metrics.cls, optimizedMetrics.metrics.cls),
      ttfb: calculateImprovementValue(baselineMetrics.metrics.ttfb, optimizedMetrics.metrics.ttfb),
      inp: calculateImprovementValue(baselineMetrics.metrics.inp, optimizedMetrics.metrics.inp),
      tti: calculateImprovementValue(baselineMetrics.metrics.tti, optimizedMetrics.metrics.tti),
      si: calculateImprovementValue(baselineMetrics.metrics.si, optimizedMetrics.metrics.si),
      totalSize: calculateImprovementValue(baselineMetrics.metrics.totalSize, optimizedMetrics.metrics.totalSize),
      requestCount: calculateImprovementValue(baselineMetrics.metrics.requestCount, optimizedMetrics.metrics.requestCount),
      jsSize: calculateImprovementValue(baselineMetrics.metrics.jsSize, optimizedMetrics.metrics.jsSize),
      cssSize: calculateImprovementValue(baselineMetrics.metrics.cssSize, optimizedMetrics.metrics.cssSize)
    }

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

