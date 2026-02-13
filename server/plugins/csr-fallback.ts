/**
 * 渲染降级：当服务器返回 HTML 失败（如 SSR 报错）时，自动降级为 CSR 形式，
 * 返回仅包含客户端入口的壳页面，由浏览器端完成渲染。
 */

const DOCUMENT_ACCEPT = /text\/html/i
const SKIP_PATHS = /^\/(api|_nuxt|__nuxt|favicon\.ico|.*\.(ico|png|jpg|jpeg|gif|svg|webp|js|css|woff2?)(\?.*)?$)/i

function isDocumentRequest(path: string, accept: string | undefined): boolean {
  if (SKIP_PATHS.test(path)) return false
  if (!accept || !DOCUMENT_ACCEPT.test(accept)) return false
  return true
}

/** 从错误页 HTML 中提取 script/link，生成仅含壳的 CSR 降级 HTML */
function buildCsrFallbackHtml(existingHtml: string): string {
  const scriptSrcRe = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi
  const linkHrefRe = /<link[^>]+href=["']([^"']+)["'][^>]*>/gi
  const scripts: string[] = []
  const links: string[] = []
  let m: RegExpExecArray | null
  while ((m = scriptSrcRe.exec(existingHtml)) !== null) {
    const src = m[1]
    if (!src.includes('_nuxt') && !src.includes('__nuxt')) continue
    scripts.push(`<script src="${src}" defer></script>`)
  }
  while ((m = linkHrefRe.exec(existingHtml)) !== null) {
    const href = m[1]
    if (href.includes('_nuxt') || href.includes('__nuxt') || href.endsWith('.css')) links.push(`<link rel="stylesheet" href="${href}">`)
  }
  const dedupe = <T>(a: T[]): T[] => [...new Set(a)]
  const scriptTags = dedupe(scripts).join('\n    ')
  const linkTags = dedupe(links).join('\n    ')
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>加载中…</title>
  ${linkTags}
</head>
<body>
  <div id="__nuxt"><div style="padding:2rem;text-align:center;font-family:system-ui,sans-serif;">正在加载…</div></div>
  ${scriptTags}
</body>
</html>`
}

/**
 * 当无法从错误页提取 script 时使用的极简降级 HTML。
 * 生产构建中入口通常带 hash（如 /_nuxt/entry-xxx.js），此处仅作最后兜底。
 * 开发模式下尝试 .mjs 入口（Vite 可能使用）。
 */
function buildMinimalCsrHtml(isDev?: boolean): string {
  const entry = isDev ? '/_nuxt/entry.mjs' : '/_nuxt/entry.js'
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>加载中…</title>
</head>
<body>
  <div id="__nuxt"><div style="padding:2rem;text-align:center;font-family:system-ui,sans-serif;">正在加载…</div></div>
  <script>
(function(){
  var s = document.createElement('script');
  s.src = '${entry}';
  s.type = 'module';
  s.defer = true;
  document.body.appendChild(s);
})();
  </script>
</body>
</html>`
}

export default defineNitroPlugin((nitroApp) => {
  // 当发生错误时，对文档请求尝试返回 CSR 降级页
  // 对已产生的 500 HTML 响应，替换为 CSR 壳（复用错误页中的 _nuxt 脚本，保证入口路径正确）
  nitroApp.hooks.hook('beforeResponse', (event, context: { body?: string | Buffer }) => {
    const path = event.path || getRequestURL(event).pathname
    const accept = getHeader(event, 'accept') || ''
    if (!isDocumentRequest(path, accept)) return
    const status = event.node.res.statusCode
    if (status !== 500) return
    const html = typeof context.body === 'string' ? context.body : (typeof context.body === 'object' && context.body ? String(context.body) : '')
    if (!html || (!html.includes('id="__nuxt"') && !html.includes("id='__nuxt'"))) return
    try {
      const fallback = buildCsrFallbackHtml(html)
      if (fallback.includes('_nuxt') || fallback.includes('__nuxt')) {
        setResponseStatus(event, 200)
        setResponseHeader(event, 'X-Render-Mode', 'csr-fallback')
        context.body = fallback
      }
    } catch (_) {
      // 忽略
    }
  })

  // 不在此处用 error 钩子直接 res.end()，否则会返回错误的 /_nuxt/entry.js 路径（生产环境不存在）。
  // 让框架先产出 500 的 HTML（内含正确的 _nuxt/xxx.js 脚本），由 beforeResponse 替换为 CSR 壳。
})
