const { randomUUID } = require('node:crypto');
const { readJsonBody, requireSameOrigin, sendJson } = require('../server/http');
const { insertRow } = require('../server/supabase');

const EVENTS = new Set(['page_view', 'pilot_cta', 'pilot_submit']);
const DEVICES = new Set(['desktop', 'mobile', 'tablet']);

module.exports = async function analytics(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false, error: 'method_not_allowed' });
  }
  if (!requireSameOrigin(request, response)) return;

  const body = await readJsonBody(request, response, 4000);
  if (!body || body.consentVersion !== '2026-08-14') return sendJson(response, 422, { ok: false, error: 'consent_required' });

  const sessionId = typeof body.sessionId === 'string' && /^[0-9a-f-]{36}$/iu.test(body.sessionId) ? body.sessionId : randomUUID();
  const eventName = typeof body.eventName === 'string' ? body.eventName : '';
  const deviceClass = typeof body.deviceClass === 'string' ? body.deviceClass : '';
  const path = typeof body.path === 'string' ? body.path.slice(0, 300) : '';
  const referrerHost = typeof body.referrerHost === 'string' ? body.referrerHost.slice(0, 253) : null;
  if (!EVENTS.has(eventName) || !DEVICES.has(deviceClass) || !path.startsWith('/')) return sendJson(response, 422, { ok: false, error: 'invalid_event' });

  try {
    await insertRow('analytics_events', {
      anonymous_session_id: sessionId,
      event_name: eventName,
      path,
      referrer_host: referrerHost || null,
      device_class: deviceClass,
      consent_version: '2026-08-14'
    }, { ignoreDuplicates: true });
    return sendJson(response, 202, { ok: true, sessionId });
  } catch (error) {
    console.error('[ANALYTICS]', error instanceof Error ? error.message : 'Unknown error');
    return sendJson(response, 202, { ok: true, sessionId });
  }
};
