<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">场景压力模拟控制面板</h3>
    
    <div class="space-y-6">
      <!-- 网络条件 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          网络条件
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            v-for="network in networks"
            :key="network.value"
            @click="updateNetwork(network.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              scenario.network === network.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ network.label }}
          </button>
        </div>
      </div>
      
      <!-- CPU节流 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          CPU节流
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="throttle in cpuThrottles"
            :key="throttle.value"
            @click="updateCPUThrottle(throttle.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              scenario.cpuThrottle === throttle.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ throttle.label }}
          </button>
        </div>
      </div>
      
      <!-- 设备类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          设备类型
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="device in devices"
            :key="device.value"
            @click="updateDeviceType(device.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              scenario.deviceType === device.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ device.label }}
          </button>
        </div>
      </div>
      
      <!-- 缓存状态 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          缓存状态
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="cache in cacheStatuses"
            :key="cache.value"
            @click="updateCacheStatus(cache.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              scenario.cacheStatus === cache.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ cache.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NetworkCondition, CPUThrottle, DeviceType, CacheStatus } from '~/types'

const { scenario, updateScenario } = usePerformance()

const networks = [
  { value: 'wifi' as NetworkCondition, label: 'Wi-Fi (Fast 3G)' },
  { value: '4g' as NetworkCondition, label: '4G (Slow 3G)' },
  { value: '3g' as NetworkCondition, label: '3G (Emerging 3G)' },
  { value: '2g' as NetworkCondition, label: '2G' }
]

const cpuThrottles = [
  { value: 'none' as CPUThrottle, label: '无节流' },
  { value: '4x' as CPUThrottle, label: '4倍减速' },
  { value: '6x' as CPUThrottle, label: '6倍减速' }
]

const devices = [
  { value: 'high-end' as DeviceType, label: '高端设备' },
  { value: 'mid-range' as DeviceType, label: '中端设备' },
  { value: 'low-end' as DeviceType, label: '低端设备' }
]

const cacheStatuses = [
  { value: 'first-load' as CacheStatus, label: '首次加载' },
  { value: 'cached' as CacheStatus, label: '缓存有效' },
  { value: 'offline' as CacheStatus, label: '离线模式' }
]

const updateNetwork = (network: NetworkCondition) => {
  updateScenario({ network })
}

const updateCPUThrottle = (cpuThrottle: CPUThrottle) => {
  updateScenario({ cpuThrottle })
}

const updateDeviceType = (deviceType: DeviceType) => {
  updateScenario({ deviceType })
}

const updateCacheStatus = (cacheStatus: CacheStatus) => {
  updateScenario({ cacheStatus })
}
</script>

