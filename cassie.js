const express = require('express');
const https = require('https');
const fs = require('fs');
const httpProxy = require('http-proxy'); // Add this line
const app = express();

const host = 'xere.bz';
const port = 443;

// Create a proxy server with http-proxy
const proxy = httpProxy.createProxyServer({});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Redirect requests for Grafana
app.all('/grafana/*', (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:3000' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// HTTPS server setup
https.createServer({
  cert: fs.readFileSync(`/etc/letsencrypt/live/${host}/fullchain.pem`),
  key: fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`)
}, app)
.listen(port, () => {
  console.log(`HTTPS Server running at https://${host}:${port}`);
});

