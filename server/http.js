const ALLOWED_ORIGINS = new Set([
  'https://resuma.ia.br',
  'https://www.resuma.ia.br',
  'http://127.0.0.1:4173',
  'http://localhost:4173'
]);

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(payload));
}

function requireSameOrigin(request, response) {
  const origin = request.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    sendJson(response, 403, { ok: false, error: 'origin_not_allowed' });
    return false;
  }
  return true;
}

async function readJsonBody(request, response, maximumBytes = 12000) {
  const contentType = String(request.headers['content-type'] || '');
  if (!contentType.toLowerCase().startsWith('application/json')) {
    sendJson(response, 415, { ok: false, error: 'json_required' });
    return null;
  }

  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === 'object' && !Buffer.isBuffer(request.body)) return request.body;
    const received = Buffer.isBuffer(request.body) ? request.body : Buffer.from(String(request.body));
    if (received.length > maximumBytes) {
      sendJson(response, 413, { ok: false, error: 'payload_too_large' });
      return null;
    }
    try {
      return JSON.parse(received.toString('utf8'));
    } catch {
      sendJson(response, 400, { ok: false, error: 'invalid_json' });
      return null;
    }
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBytes) {
      sendJson(response, 413, { ok: false, error: 'payload_too_large' });
      return null;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    sendJson(response, 400, { ok: false, error: 'invalid_json' });
    return null;
  }
}

module.exports = { readJsonBody, requireSameOrigin, sendJson };
