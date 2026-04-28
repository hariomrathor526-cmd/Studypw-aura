const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const finalInjection = `
<style>
    /* 1. LOGO REPLACE (Hariom Pro Logo) */
    img[src*="logo"], img[alt*="Delta"], .logo-class, img[src*="delta"] { 
        content: url('https://ibb.co') !important;
        width: 130px !important; height: auto !important;
    }
    
    /* 2. KEY & ADS REMOVAL (Jad se khatam) */
    #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn, .verify-key-section, [id*="eruda"] { 
        display: none !important; 
    }

    /* 3. BLUR & OVERLAY BYPASS (Content unlock) */
    .blurred-content, .overlay, [style*="blur"] { 
        filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; 
    }
    body { overflow: auto !important; }
</style>

<script>
    function studyPWAuraFinalFix() {
        // NAME REPLACE (Delta ko StudyPW Aura se badlo)
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeValue.includes('Delta')) {
                node.nodeValue = node.nodeValue.replace(/Delta/gi, 'StudyPW Aura');
            }
        }

        // KEY BYPASS (Background verification)
        localStorage.setItem('access_key', 'verified_permanent');
        if(!document.cookie.includes('auth=true')) {
            document.cookie = "auth=true; path=/; max-age=31536000";
        }
    }

    // Site load aur scroll par branding apply hogi
    window.addEventListener('load', studyPWAuraFinalFix);
    window.addEventListener('scroll', studyPWAuraFinalFix);
    setInterval(studyPWAuraFinalFix, 1500); // 1.5 sec check
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
            // HTML content mein branding inject karein
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                content = content.replace('</head>', finalInjection + '</head>');
            }
            res.end(content);
        });
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('StudyPW Aura is Live and Smooth!'));


