const test = require('node:test');
const assert = require('node:assert/strict');
const waitlist = require('../api/waitlist');
const privacyRequest = require('../api/privacy-request');
const { validatePilotApplication, validatePrivacyRequest } = require('../server/validation');

process.env.SUBMISSION_HASH_SECRET = 'unit-test-secret-that-is-longer-than-thirty-two-characters';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

function request(body, options = {}) {
  const content = Buffer.from(JSON.stringify(body));
  return {
    method: options.method || 'POST',
    headers: {
      origin: options.origin || 'http://127.0.0.1:4173',
      'content-type': options.contentType || 'application/json'
    },
    async *[Symbol.asyncIterator]() { yield content; }
  };
}

function response() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value = '') { this.body = value; }
  };
}

function validPilotBody() {
  return {
    startedAt: Date.now() - 3000,
    companyWebsite: '',
    name: 'Ana Silva',
    email: 'ANA@example.com',
    whatsapp: '+55 11 99999-9999',
    communityName: 'Comunidade Horizonte',
    memberRange: '51_to_200',
    applicantRole: 'administrator',
    goals: 'Quero organizar decisões e links importantes do grupo.',
    privacyNoticeAcknowledged: true,
    contactRequested: true
  };
}

test('pilot validation normalizes public input and excludes extra fields', () => {
  const result = validatePilotApplication({ ...validPilotBody(), status: 'selected' });
  assert.equal(result.error, undefined);
  assert.equal(result.row.email, 'ana@example.com');
  assert.equal(result.row.status, undefined);
  assert.match(result.row.submission_fingerprint, /^[a-f0-9]{64}$/u);
});

test('pilot validation rejects bots and missing acknowledgements', () => {
  assert.equal(validatePilotApplication({ ...validPilotBody(), companyWebsite: 'spam.example' }).error, 'spam_detected');
  assert.equal(validatePilotApplication({ ...validPilotBody(), contactRequested: false }).error, 'required_acknowledgement_missing');
});

test('privacy validation accepts only known request types', () => {
  const base = { startedAt: Date.now() - 3000, companyWebsite: '', email: 'ana@example.com', details: 'Quero acessar os dados enviados.' };
  assert.equal(validatePrivacyRequest({ ...base, requestType: 'access' }).error, undefined);
  assert.equal(validatePrivacyRequest({ ...base, requestType: 'export_database' }).error, 'invalid_fields');
});

test('waitlist endpoint inserts a validated server-side row', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  let outboundBody;
  global.fetch = async (_url, options) => {
    outboundBody = JSON.parse(options.body);
    return new Response(null, { status: 201 });
  };

  const res = response();
  await waitlist(request(validPilotBody()), res);
  assert.equal(res.statusCode, 202);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(outboundBody.email, 'ana@example.com');
  assert.equal(outboundBody.status, undefined);
});

test('waitlist endpoint accepts a body pre-parsed by the Vercel runtime', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => new Response(null, { status: 201 });
  const req = request(validPilotBody());
  req.body = validPilotBody();

  const res = response();
  await waitlist(req, res);
  assert.equal(res.statusCode, 202);
});

test('waitlist endpoint blocks cross-origin submissions before storage', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  let called = false;
  global.fetch = async () => { called = true; return new Response(null, { status: 201 }); };

  const res = response();
  await waitlist(request(validPilotBody(), { origin: 'https://attacker.example' }), res);
  assert.equal(res.statusCode, 403);
  assert.equal(called, false);
});

test('privacy endpoint returns a protocol without sending external messages', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  const protocol = 'c8e6d1fc-3e8e-47c4-a69a-a37fb25d1ef5';
  global.fetch = async () => new Response(JSON.stringify([{ id: protocol }]), { status: 201, headers: { 'content-type': 'application/json' } });

  const res = response();
  await privacyRequest(request({
    startedAt: Date.now() - 3000,
    companyWebsite: '',
    email: 'ana@example.com',
    requestType: 'access',
    details: 'Quero acessar os dados enviados.'
  }), res);
  assert.equal(res.statusCode, 202);
  assert.deepEqual(JSON.parse(res.body), { ok: true, protocol });
});
