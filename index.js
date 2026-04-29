const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    autoRewrite: true,
    followRedirects: true,
    onProxyRes: function (proxyRes, req, res) {
        // Yeh headers hatane se download error nahi aayega
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['x-frame-options'];
    },
    // Cookie aur Domain ko fix karne ke liye
    cookieDomainRewrite: true,
}));

// Port fix for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('StudyPW Aura is running...'));


