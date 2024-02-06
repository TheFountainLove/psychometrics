import {createProxyMiddleware} from 'http-proxy-middleware'

export default (req, res) => {
  let target = ''
  // 代理目标地址
  if (req.url.startsWith('/api')) {
    target = 'https://api.github.com'
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target, changeOrigin: true, pathRewrite: {
      '^/api': '/',
    },
  })(req, res)
}
