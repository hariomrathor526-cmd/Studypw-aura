const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: false, // Vercel par isse 404 nahi aayega
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('accept-encoding', 'identity');
    },
    onProxyRes: (proxyRes) => {
        delete proxyRes.headers['content-security-policy'];
    }
}));

// Vercel ke liye ye line sabse zaroori hai
module.exports = app; 
