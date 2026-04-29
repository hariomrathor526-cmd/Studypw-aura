const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const studyPWAuraFinal = `
<style>
    /* 1. Logo Replace */
    img[src*="logo"], img[alt*="Delta"], .logo-class { 
        content: url('https://ibb.co') !important; 
        width: 130px !important; 
    }
    /* 2. Ads & Key Removal */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
    .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
</style>

<script>
    function applyStudyPWChanges() {
        // Naam badlo
        document.body.innerHTML = document.body.innerHTML.replace(/Delta/gi, 'StudyPW Aura');
        
        // TELEGRAM LINK REPLACE (Aapka link yahan set kar diya hai)
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.href.includes('t.me')) {
                link.href = 'https://t.me/+9kMPyWrNBbg3ZWE9';
            }
        });

        // Key Bypass
        localStorage.setItem('access_key', 'verified_permanent');
        if(!document.cookie.includes('auth=true')) { document.cookie = "auth=true; path=/; max-age=31536000"; }
    }
    window.addEventListener('load', applyStudyPWChanges);
    setInterval(applyStudyPWChanges, 2000);
</script>
`;

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        delete proxyRes.headers['content-encoding']; // Download error fix

        proxyRes.on('data', (data) => { body = Buffer.concat([body, data]); });
        proxyRes.on('end', () => {
            let content = body.toString();
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', studyPWAuraFinal + '</head>');
            }
            res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
            res.end(content);
        });
    }
}));

app.listen(process.env.PORT || 3000);



