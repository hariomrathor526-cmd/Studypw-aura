const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const zlib = require('zlib');
const app = express();

const injection = `
<style>
    /* Logo Replace (Hariom Pro) */
    img[src*="logo"], img[alt*="Delta"], [class*="Logo"] img, .logo-img { 
        content: url('https://ibb.co') !important; 
        width: 130px !important; height: auto !important;
    }
    /* Ads & Key Bypass CSS */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>
<script>
    function studyPWAuraFix() {
        // 1. Name Change (Delta to StudyPW Aura)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }
        // 2. Telegram Link Force Replace (Aapka Link)
        document.querySelectorAll('a').forEach(a => {
            if(a.href.includes('t.me')) {
                a.href = 'https://t.me';
            }
        });
        // 3. Authentication Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        if(!document.cookie.includes('auth=true')) {
            document.cookie = "auth=true; path=/; max-age=31536000";
        }
    }

    // Har activity par branding aur links check karega
    const observer = new MutationObserver(studyPWAuraFix);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', studyPWAuraFix);
    setInterval(studyPWAuraFix, 1000); // Extra safety
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
            let content;
            const encoding = proxyRes.headers['content-encoding'];
            try {
                if (encoding === 'gzip') content = zlib.gunzipSync(body).toString();
                else if (encoding === 'br') content = zlib.brotliDecompressSync(body).toString();
                else content = body.toString();

                if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                    content = content.replace('<head>', '<head>' + injection);
                }
                res.removeHeader('content-encoding');
                res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
                res.send(content);
            } catch (e) { res.end(body); }
        });
    }
}));

app.listen(process.env.PORT || 3000);


