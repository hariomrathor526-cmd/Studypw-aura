const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true, 
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        let content = responseBuffer.toString('utf8');
        content = content.replace(/Delta/gi, 'StudyPW'); // Naam badla
        content = content.replace(/https?:\/\/.*logo.*\.(png|jpg|svg)/gi, 'https://ibb.co'); // Logo badla
        const style = '<style>#ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; } .blurred-content, .overlay { filter: none !important; display: none !important; } body { overflow: auto !important; }</style>';
        return content.replace('</head>', style + '</head>');
    }),
}));
app.listen(process.env.PORT || 3000);
