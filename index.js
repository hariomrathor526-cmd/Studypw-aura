const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const injection = `
<style>
    /* 1. LOGO REPLACE (Forcefully) */
    img[src*="logo"], img[alt*="Delta"], .logo-img, [class*="Logo"] img { 
        content: url('https://ibb.co') !important; 
        width: 140px !important; height: auto !important;
    }
    /* 2. HIDE ADS & POPUPS */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    /* 3. UNLOCK CONTENT */
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWAuraMasterFix() {
        // NAME CHANGE (Deep Scanner)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // TELEGRAM LINK REPLACE
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) a.href = 'https://t.me';
        });
        // AUTH BYPASS
        localStorage.setItem('access_key', 'verified_permanent');
        document.cookie = "auth=true; path=/; max-age=31536000";
    }
    // Monitoring Next.js updates
    setInterval(studyPWAuraMasterFix, 1000);
    window.onload = studyPWAuraMasterFix;
</script>
`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', (data) => { body = Buffer.concat([body, data]); });
        proxyRes.on('end', () => {
            let content = body.toString();
            // Sirf HTML mein injection daalna hai taaki JSON data na toote
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', injection + '</head>');
            }
            res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
            res.end(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);



