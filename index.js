const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const injectionScript = `
<style>
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
    body { overflow: auto !important; }
</style>
<script>
    function updateBrand() {
        // 1. Text Replacement (Safe way)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // 2. Logo Replacement
        document.querySelectorAll('img').forEach(img => {
            if(img.src.includes('logo') || img.alt.includes('Delta') || img.src.includes('delta')) {
                img.src = 'https://ibb.co';
            }
        });
        // 3. Key Bypass
        localStorage.setItem('access_key', 'verified');
    }

    // MutationObserver: Ye code tabhi chalega jab kuch naya load hoga (Next.js ke liye best)
    const observer = new MutationObserver(updateBrand);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    window.addEventListener('load', updateBrand);
    // Extra safety for buttons
    setInterval(updateBrand, 3000);
</script>
`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', function (data) { body = Buffer.concat([body, data]); });
        proxyRes.on('end', function () {
            let content = body.toString();
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', injectionScript + '</head>');
            }
            res.end(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);
