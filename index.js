const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    secure: false, // Security bypass ke liye
    followRedirects: true,
    selfHandleResponse: true, 
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        let content = responseBuffer.toString('utf8');

        // 1. Logo aur Naam ko Jad se badalne ka naya tareeka
        content = content.replace(/Delta/gi, 'StudyPW Aura');
        content = content.replace(/deltastudy/gi, 'studypwaura');
        
        // Logo ko forcefully replace karna
        content = content.replace(/<img[^>]*src="[^"]*"[^>]*>/gi, (match) => {
            if (match.includes('logo')) {
                return match.replace(/src="[^"]*"/i, 'src="https://ibb.co"');
            }
            return match;
        });

        // 2. Data load karne ke liye CSS aur Scripts
        const fixSystem = `
            <style>
                /* Ads aur Popups hide karo */
                #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
                /* Content ko force dikhao */
                .blurred-content, .overlay, [style*="blur"] { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
                .hidden, [hidden] { display: block !important; visibility: visible !important; }
                body { overflow: auto !important; }
            </style>
            <script>
                // Forced verification
                localStorage.setItem('access_key', 'verified');
                document.cookie = "auth=true; path=/; max-age=31536000";
                // Agar loading stuck hai toh reload trigger karein
                setTimeout(() => {
                    if (document.body.innerText.length < 100) {
                        console.log("Retrying content load...");
                    }
                }, 3000);
            </script>
        `;
        
        return content.replace('</head>', fixSystem + '</head>');
    }),
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

