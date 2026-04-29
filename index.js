const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const injection = `
<style>
    /* Logo Replace */
    img[src*="logo"], img[alt*="Delta"], .logo-img, img[src*="delta"] { 
        content: url('https://ibb.co') !important; 
        width: 140px !important; height: auto !important;
    }
    /* Ads & Popups Delete */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    /* Unlock Content */
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWAuraFinalFix() {
        // Deep Name Change
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // TELEGRAM LINK FORCE REPLACE
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) {
                a.href = 'https://t.me';
            }
        });
        // Key Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        document.cookie = "auth=true; path=/; max-age=31536000";
    }
    // Isse site ke har update par naam/logo wapas sahi ho jayega
    setInterval(studyPWAuraFinalFix, 1000);
    window.onload = studyPWAuraFinalFix;
</script>
`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq) => { proxyReq.setHeader('accept-encoding', 'identity'); },
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', (data) => { body = Buffer.concat([body, data]); });
        proxyRes.on('end', () => {
            let content = body.toString();
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', injection + '</head>');
            }
            res.setHeader('content-type', 'text/html');
            res.send(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);
