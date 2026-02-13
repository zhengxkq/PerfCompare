/**
 * /_nuxt/entry.js 别名：CSR 降级可能引用此路径，生产构建实际入口为 /_nuxt/xxx.js
 * 重定向到真实入口，避免 404
 * 注：不能使用 #build 别名（server runtime 不允许），改用运行时路径解析
 */
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'

let cachedEntryFile: string | null = null

export default defineEventHandler(async (event) => {
  if (!cachedEntryFile) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const precomputedPath = join(__dirname, '../../build/client.precomputed.mjs')
    const mod = await import(/* @vite-ignore */ pathToFileURL(precomputedPath).href)
    const precomputed = typeof mod.default === 'function' ? mod.default() : mod.default
    cachedEntryFile = precomputed?.modules?.['node_modules/nuxt/dist/app/entry.js']?.file || null
  }
  if (!cachedEntryFile) {
    throw createError({ statusCode: 404, message: 'Entry not found' })
  }
  return sendRedirect(event, `/_nuxt/${cachedEntryFile}`, 302)
})
