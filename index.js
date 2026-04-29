const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const MY_LOGO = "https://ibb.co";
const MY_TELEGRAM = "https://t.me";

const injection = `
<style>
    /* Force Logo Change */
    img[src*="logo"], img[alt*="Delta"], .logo-img { 
        content: url('${MY_LOGO}') !important; 
        width: 140px !important; height: auto !important;
    }
    /* Hide Ads & Popups */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    /* Unlock Content (Blur remove) */
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWAuraMasterFix() {
        // 1. Force Name Change in all text nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // 2. Telegram Link Redirect
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) a.href = '${MY_TELEGRAM}';
        });
        // 3. Authentication Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        document.cookie = "auth=true; path=/; max-age=31536000";
    }
    // Next.js monitoring
    setInterval(studyPWAuraMasterFix, 500);
    window.onload = studyPWAuraMasterFix;
</script>
`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true, // Sabse important setting
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', (data) => { body = Buffer.concat([body, data]); });
        proxyRes.on('end', () => {
            let content = body.toString();
            // Sirf HTML pages ko chhedna hai, JSON/Data ko nahi
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', injection + '</head>');
            }
            res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
            res.end(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);
