import type { HttpProxy, ProxyOptions } from 'vite'

export const createProxyConfig = (
  target: string,
  rewritePath: string,
  label = 'PROXY'
): ProxyOptions => {
  return {
    target,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(rewritePath, ''),
    configure: (proxy: HttpProxy.Server, options: ProxyOptions) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE')
        res.setHeader(
          'Access-Control-Allow-Headers',
          req.headers['access-control-request-headers'] || ''
        )

        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // eslint-disable-next-line no-console
        console.log(`[${label}] - API CALL - [${req.method}] ${options.target}${req.url}`)
        proxyReq.setHeader('Authorization', req.headers.authorization || '')
      })

      proxy.on('error', (err, _req, res) => {
        // eslint-disable-next-line no-console
        console.error(`Proxy error: ${err.message}`)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Proxy error', details: err.message }))
      })
    }
  }
}

export const qliApiProxy = createProxyConfig(
  'https://api.qubic.li',
  '/dev-proxy-qli-api',
  'QLI-API-DEV-PROXY'
)
