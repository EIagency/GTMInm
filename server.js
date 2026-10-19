const http = require('http');
const fs = require('fs');
const path = require('path');
const enquiryHandler = require('./api/enquiry');

const PORT = process.env.PORT || 3000;

// Explicitly read static assets at startup so Vercel nft bundler traces and bundles them into the Lambda package
const ASSETS = {
  '/': {
    content: fs.readFileSync(path.join(__dirname, 'index.html')),
    type: 'text/html; charset=utf-8'
  },
  '/index.html': {
    content: fs.readFileSync(path.join(__dirname, 'index.html')),
    type: 'text/html; charset=utf-8'
  },
  '/styles.css': {
    content: fs.readFileSync(path.join(__dirname, 'styles.css')),
    type: 'text/css; charset=utf-8'
  },
  '/script.js': {
    content: fs.readFileSync(path.join(__dirname, 'script.js')),
    type: 'application/javascript; charset=utf-8'
  },
  '/favicon.svg': {
    content: fs.readFileSync(path.join(__dirname, 'favicon.svg')),
    type: 'image/svg+xml'
  },
  '/article-qualification-win-rate.html': {
    content: fs.readFileSync(path.join(__dirname, 'article-qualification-win-rate.html')),
    type: 'text/html; charset=utf-8'
  },
  '/article-qualification-win-rate': {
    content: fs.readFileSync(path.join(__dirname, 'article-qualification-win-rate.html')),
    type: 'text/html; charset=utf-8'
  }
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // 1. Handle API Route: /api/enquiry
  if (pathname === '/api/enquiry') {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });

    req.on('end', async () => {
      let parsedBody = {};
      if (bodyData) {
        try {
          parsedBody = JSON.parse(bodyData);
        } catch (e) {
          parsedBody = Object.fromEntries(new URLSearchParams(bodyData));
        }
      }

      const mockReq = {
        method: req.method,
        headers: req.headers,
        body: parsedBody,
        socket: req.socket
      };

      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader(name, value) {
          this.headers[name] = value;
          res.setHeader(name, value);
        },
        status(code) {
          this.statusCode = code;
          res.statusCode = code;
          return this;
        },
        json(data) {
          this.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.statusCode = this.statusCode || 200;
          res.end(JSON.stringify(data));
        },
        end(data) {
          res.statusCode = this.statusCode || 200;
          res.end(data);
        }
      };

      try {
        await enquiryHandler(mockReq, mockRes);
      } catch (err) {
        console.error('API Error:', err);
        mockRes.status(500).json({ ok: false, error: 'Internal server error' });
      }
    });
    return;
  }

  // 2. Serve from In-Memory Asset Cache
  if (ASSETS[pathname]) {
    const asset = ASSETS[pathname];
    res.statusCode = 200;
    res.setHeader('Content-Type', asset.type);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(asset.content);
    return;
  }

  // 3. Fallback disk resolution
  const safePath = path.normalize(path.join(__dirname, pathname === '/' ? 'index.html' : pathname));
  if (safePath.startsWith(__dirname) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.css' ? 'text/css; charset=utf-8'
      : ext === '.js' ? 'application/javascript; charset=utf-8'
      : ext === '.svg' ? 'image/svg+xml'
      : 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    res.end(fs.readFileSync(safePath));
    return;
  }

  // 4. 404 Not Found
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!doctype html><h1>404 Not Found</h1><p><a href="/">Return to home</a></p>');
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(`🌐 GTM in Motion server running at: http://localhost:${PORT}`);
    console.log(`📨 Real lead capture active at:    http://localhost:${PORT}/api/enquiry`);
    console.log(`======================================================`);
  });
}

module.exports = server;
