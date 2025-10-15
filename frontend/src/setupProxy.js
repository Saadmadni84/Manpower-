const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API calls to the backend - keep the /api prefix
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api' // Keep the /api prefix
      }
    })
  );
  
  // Proxy health check endpoint
  app.use(
    '/health',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
};
