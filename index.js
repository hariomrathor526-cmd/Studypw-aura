const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const injection = `
<style>
    /* Logo Replace */
    img[src*="logo"], img[alt*="Delta"], .logo-img { 
        content: url('https://ibb.co') !important; 
        width: 130px !important; height: auto !important;
    }
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWFinalFix() {
        // Naam badlo
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // Telegram badlo
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) a.href = 'https://t.me';
        });
        // Key Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        document.cookie = "auth=true; path=/; max-age=31536000";
    }
    setInterval(studyPWFinalFix, 1500);
</script>`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyReq: (proxyReq) => {
        // Yeh line symbols aur Batch Not Found fix karegi
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
            res.removeHeader('content-encoding');
            res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
            res.send(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);
