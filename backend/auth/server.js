const http = require('http');
const crypto = require('crypto');
const { addUser, getUser } = require('./db');
const { sign, verify } = require('./jwt');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const PORT = process.env.PORT || 3000;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashed = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashed;
}

// simple in-memory rate limiter
const limits = {};
function rateLimit(ip, route, limit = 5, windowMs = 60 * 1000) {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = limits[key] || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count++;
  limits[key] = entry;
  return entry.count <= limit;
}

function jsonResponse(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const ip = req.socket.remoteAddress;

  if (req.method === 'POST' && (url.pathname === '/signup' || url.pathname === '/login')) {
    if (!rateLimit(ip, url.pathname)) {
      return jsonResponse(res, 429, { error: 'Too many requests' });
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        if (!username || !password) {
          return jsonResponse(res, 400, { error: 'Missing credentials' });
        }
        if (url.pathname === '/signup') {
          const hashed = hashPassword(password);
          const result = addUser(username, hashed);
          if (result.error === 'EXISTS') {
            return jsonResponse(res, 409, { error: 'User exists' });
          }
          const token = sign({ id: result.id, username }, JWT_SECRET);
          return jsonResponse(res, 201, { token });
        }
        if (url.pathname === '/login') {
          const user = getUser(username);
          if (!user || !checkPassword(password, user.password)) {
            return jsonResponse(res, 401, { error: 'Invalid credentials' });
          }
          const token = sign({ id: user.id, username }, JWT_SECRET);
          return jsonResponse(res, 200, { token });
        }
      } catch (e) {
        return jsonResponse(res, 400, { error: 'Invalid request' });
      }
    });
  } else if (req.method === 'GET' && url.pathname === '/me') {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return jsonResponse(res, 401, { error: 'Missing or invalid token' });
    }
    const token = auth.slice(7);
    try {
      const payload = verify(token, JWT_SECRET);
      return jsonResponse(res, 200, { id: payload.id, username: payload.username });
    } catch (err) {
      return jsonResponse(res, 401, { error: 'Invalid token' });
    }
  } else {
    jsonResponse(res, 404, { error: 'Not found' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));
}

module.exports = server;
