const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const injection = `
<style>
    /* 1. Logo Force Replace */
    img[src*="logo"], img[alt*="Delta"], .logo-img { 
        content: url('https://ibb.co') !important; 
        width: 130px !important; height: auto !important;
    }
    /* 2. Hide Ads & Popups */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    /* 3. Content Unlock */
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWFinalFix() {
        // Name Change
        document.body.innerHTML = document.body.innerHTML.replace(/Delta/gi, 'StudyPW Aura');
        // Telegram Link Replace
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) a.href = 'https://t.me';
        });
        // Key Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        document.cookie = "auth=true; path=/; max-age=31536000";
    }
    window.onload = studyPWFinalFix;
    setInterval(studyPWFinalFix, 2000);
</script>`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq) => {
        // Compression block karo taaki symbols na aayein
        proxyReq.setHeader('accept-encoding', 'identity');
    },
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', (data) => { body = Buffer.concat([body, data]); });
        proxyRes.on('end', () => {
            let content = body.toString();
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', injection + '</head>');
            }
            res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
            res.send(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);
