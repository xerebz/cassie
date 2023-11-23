import express from 'express'
import fs from 'fs'
import httpProxy from 'http-proxy'
import https from 'https'
import path from 'path'

import motd from './motd.js'

const app = express()

const host = 'xere.bz'
const grafanaHost = `grafana.${host}`
const port = 443

const proxy = httpProxy.createProxyServer({})

app.use((req, res, next) => {
  if (req.headers.host === grafanaHost) {
    proxy.web(req, res, { target: 'http://localhost:3000' })
  } else {
    next()
  }
})

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// HTTPS server setup
https.createServer({
  cert: fs.readFileSync(`/etc/letsencrypt/live/${host}/fullchain.pem`),
  key: fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`)
}, app)
  .listen(port, () => {
    motd()
  })
