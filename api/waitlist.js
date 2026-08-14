const { readJsonBody, requireSameOrigin, sendJson } = require('../server/http');
const { insertRow } = require('../server/supabase');
const { validatePilotApplication } = require('../server/validation');

module.exports = async function waitlist(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false, error: 'method_not_allowed' });
  }
  if (!requireSameOrigin(request, response)) return;

  const body = await readJsonBody(request, response);
  if (!body) return;
  const result = validatePilotApplication(body);
  if (result.error) return sendJson(response, 422, { ok: false, error: result.error });

  try {
    await insertRow('pilot_applications', result.row, { ignoreDuplicates: true });
    return sendJson(response, 202, { ok: true });
  } catch (error) {
    console.error('[WAITLIST]', error instanceof Error ? error.message : 'Unknown error');
    return sendJson(response, 503, { ok: false, error: 'temporarily_unavailable' });
  }
};
