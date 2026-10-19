const http = require('http');
const fs = require('fs');
const path = require('path');
const enquiryHandler = require('./api/enquiry');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Handle API route: /api/enquiry
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
          // If urlencoded
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

  // Handle Static Files
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🌐 GTM in Motion server running at: http://localhost:${PORT}`);
  console.log(`📨 Real lead capture active at:    http://localhost:${PORT}/api/enquiry`);
  console.log(`======================================================`);
});

