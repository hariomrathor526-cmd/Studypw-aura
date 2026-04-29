



const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const zlib = require('zlib'); 
const app = express();

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

            // 1. Compression Handle Karo (Gzip/Brotli Bypass)
            try {
                if (encoding === 'gzip') {
                    content = zlib.gunzipSync(body).toString();
                } else if (encoding === 'br') {
                    content = zlib.brotliDecompressSync(body).toString();
                } else {
                    content = body.toString();
                }

                if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                    // 2. Branding, Telegram aur Key Bypass Injection
                    const inject = `
                    <style>
                        img[src*="logo"], img[alt*="Delta"] { content: url('https://ibb.co') !important; width: 130px !important; }
                        #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn { display: none !important; }
                        .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
                    </style>
                    <script>
                        function applyMagic() {
                            document.body.innerHTML = document.body.innerHTML.replace(/Delta/gi, 'StudyPW Aura');
                            document.querySelectorAll('a').forEach(a => {
                                if(a.href.includes('t.me')) a.href = 'https://t.me';
                            });
                            localStorage.setItem('access_key', 'verified_permanent');
                            if(!document.cookie.includes('auth=true')) document.cookie = "auth=true; path=/; max-age=31536000";
                        }
                        window.onload = applyMagic;
                        setInterval(applyMagic, 2000);
                    </script>`;
                    content = content.replace('</head>', inject + '</head>');
                }

                // Headers reset karein taaki symbols na dikhein
                res.removeHeader('content-encoding');
                res.setHeader('content-type', proxyRes.headers['content-type'] || 'text/html');
                res.send(content);
            } catch (e) {
                res.end(body); // Agar error aaye toh original bhej do
            }
        });
    }
}));

app.listen(process.env.PORT || 3000);
