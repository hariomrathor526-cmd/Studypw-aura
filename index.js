const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const zlib = require('zlib'); // Compression handle karne ke liye
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://deltastudy.site',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: function (proxyRes, req, res) {
        let body = Buffer.from([]);
        proxyRes.on('data', function (data) { body = Buffer.concat([body, data]); });
        proxyRes.on('end', function () {
            // Check karein ki data compressed (Gzip) toh nahi hai
            let encoding = proxyRes.headers['content-encoding'];
            let content;

            try {
                if (encoding === 'gzip') {
                    content = zlib.gunzipSync(body).toString();
                } else if (encoding === 'br') {
                    content = zlib.brotliDecompressSync(body).toString();
                } else {
                    content = body.toString();
                }

                // Sirf HTML pages mein Logo, Name aur Key Bypass inject karein
                if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                    const brandingAndKeyBypass = `
                    <script>
                        function studyPWAuraMagic() {
                            // 1. KEY BYPASS (Har 1 second mein verify karega)
                            localStorage.setItem('access_key', 'verified_permanent');
                            document.cookie = "auth=true; path=/; max-age=31536000";

                            // 2. NAME REPLACE (Delta ko StudyPW Aura se badlo)
                            document.body.innerHTML = document.body.innerHTML.replace(/Delta/gi, 'StudyPW Aura');

                            // 3. LOGO REPLACE
                            document.querySelectorAll('img').forEach(img => {
                                if(img.src.includes('logo') || img.alt.includes('Delta') || img.src.includes('delta')) {
                                    img.src = 'https://ibb.co';
                                }
                            });
                        }
                        // Website khulte hi aur har thodi der mein fix chalayega
                        window.addEventListener('load', studyPWAuraMagic);
                        setInterval(studyPWAuraMagic, 2000);
                    </script>
                    <style>
                        /* Ads aur Key Popups ko jad se khatam karo */
                        #ad728Wrapper, .ads-text, #pop_ad, [class*="key-popup"], .generate-key-btn, .verify-key-section { display: none !important; }
                        .blurred-content, .overlay { filter: none !important; display: none !important; visibility: visible !important; pointer-events: auto !important; }
                        body { overflow: auto !important; }
                    </style>`;
                    
                    content = content.replace('</head>', brandingAndKeyBypass + '</head>');
                }

                // Headers reset karein taaki download error na aaye
                res.removeHeader('content-encoding');
                res.removeHeader('content-security-policy');
                res.setHeader('content-type', proxyRes.headers['content-type']);
                res.send(content);

            } catch (err) {
                // Agar decompression fail ho jaye toh original data bhej do
                res.end(body);
            }
        });
    }
}));

app.listen(process.env.PORT || 3000);

