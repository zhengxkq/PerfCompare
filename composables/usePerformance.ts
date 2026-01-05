import { ref } from 'vue'
import type { ScenarioConfig, PerformanceMetrics, ComparisonData, OptimizationSolution, ImprovementMetrics } from '~/types'
import { simulatePerformanceMetrics, calculateImprovement } from '~/utils/performance'

export function usePerformance() {
  const scenario = ref<ScenarioConfig>({
    network: '4g',
    cpuThrottle: 'none',
    deviceType: 'mid-range',
    cacheStatus: 'first-load'
  })
  
  const loading = ref(false)
  const metrics = ref<PerformanceMetrics | null>(null)
  
  // 更新场景配置
  const updateScenario = (config: Partial<ScenarioConfig>) => {
    scenario.value = { ...scenario.value, ...config }
  }
  
  // 获取性能指标
  const getMetrics = async (solutionId: string) => {
    loading.value = true
    try {
      const data = await $fetch<{
        baseline: PerformanceMetrics
        optimized: PerformanceMetrics
        improvement: ImprovementMetrics
      }>('/api/performance/comparison', {
        method: 'POST',
        body: {
          solutionId,
          ...scenario.value
        }
      })
      
      metrics.value = data.optimized
      
      return data
    } catch (error) {
      console.error('Failed to fetch metrics from API, using fallback:', error)
      // 使用fallback模拟数据
      const optimized = simulatePerformanceMetrics(
        solutionId,
        scenario.value.network,
        scenario.value.cpuThrottle,
        scenario.value.deviceType,
        scenario.value.cacheStatus
      )
      
      const baseline = simulatePerformanceMetrics(
        'baseline',
        scenario.value.network,
        scenario.value.cpuThrottle,
        scenario.value.deviceType,
        scenario.value.cacheStatus
      )
      
      metrics.value = optimized
      
      return {
        baseline,
        optimized,
        improvement: calculateImprovement(baseline, optimized)
      }
    } finally {
      loading.value = false
    }
  }
  
  // 获取对比数据
  const getComparison = async (solution: OptimizationSolution): Promise<ComparisonData> => {
    loading.value = true
    try {
      const data = await $fetch<{
        baseline: PerformanceMetrics
        optimized: PerformanceMetrics
        improvement: ImprovementMetrics
      }>('/api/performance/comparison', {
        method: 'POST',
        body: {
          solutionId: solution.id,
          ...scenario.value
        }
      })
      
      return {
        solution,
        baseline: data.baseline,
        optimized: data.optimized,
        improvement: data.improvement
      }
    } catch (error) {
      console.error('Failed to fetch comparison from API, using fallback:', error)
      // 使用fallback模拟数据
      const optimized = simulatePerformanceMetrics(
        solution.id,
        scenario.value.network,
        scenario.value.cpuThrottle,
        scenario.value.deviceType,
        scenario.value.cacheStatus
      )
      
      const baseline = simulatePerformanceMetrics(
        'baseline',
        scenario.value.network,
        scenario.value.cpuThrottle,
        scenario.value.deviceType,
        scenario.value.cacheStatus
      )
      
      return {
        solution,
        baseline,
        optimized,
        improvement: calculateImprovement(baseline, optimized)
      }
    } finally {
      loading.value = false
    }
  }
  
  return {
    scenario,
    loading,
    metrics,
    updateScenario,
    getMetrics,
    getComparison
  }
}

