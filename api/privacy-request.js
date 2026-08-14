const { readJsonBody, requireSameOrigin, sendJson } = require('../server/http');
const { insertRow } = require('../server/supabase');
const { validatePrivacyRequest } = require('../server/validation');

module.exports = async function privacyRequest(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false, error: 'method_not_allowed' });
  }
  if (!requireSameOrigin(request, response)) return;

  const body = await readJsonBody(request, response);
  if (!body) return;
  const result = validatePrivacyRequest(body);
  if (result.error) return sendJson(response, 422, { ok: false, error: result.error });

  try {
    const inserted = await insertRow('privacy_requests', result.row, { returnRepresentation: true });
    if (!inserted.row?.id) throw new Error('Privacy request protocol is unavailable');
    return sendJson(response, 202, { ok: true, protocol: inserted.row.id });
  } catch (error) {
    console.error('[PRIVACY REQUEST]', error instanceof Error ? error.message : 'Unknown error');
    return sendJson(response, 503, { ok: false, error: 'temporarily_unavailable' });
  }
};
