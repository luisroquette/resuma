const { createHmac } = require('node:crypto');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const MEMBER_RANGES = new Set(['up_to_50', '51_to_200', '201_to_500', 'more_than_500']);
const APPLICANT_ROLES = new Set(['owner', 'administrator', 'moderator', 'member', 'other']);
const PRIVACY_REQUEST_TYPES = new Set(['confirmation', 'access', 'correction', 'deletion', 'revocation', 'information', 'other']);

function cleanText(value, maximumLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/gu, ' ').slice(0, maximumLength);
}

function cleanMultiline(value, maximumLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\r\n?/gu, '\n').slice(0, maximumLength);
}

function normalizeEmail(value) {
  return cleanText(value, 254).toLowerCase();
}

function fingerprint(value) {
  const secret = process.env.SUBMISSION_HASH_SECRET;
  if (!secret || secret.length < 32) throw new Error('Submission fingerprint secret is unavailable');
  return createHmac('sha256', secret).update(value).digest('hex');
}

function validateBotSignals(body) {
  if (cleanText(body.companyWebsite, 200)) return 'spam_detected';
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500 || Date.now() - startedAt > 86_400_000) {
    return 'invalid_form_timing';
  }
  return null;
}

function validatePilotApplication(body) {
  const botError = validateBotSignals(body);
  if (botError) return { error: botError };

  const name = cleanText(body.name, 120);
  const email = normalizeEmail(body.email);
  const whatsapp = cleanText(body.whatsapp, 32).replace(/[^\d+()\-\s]/gu, '');
  const communityName = cleanText(body.communityName, 160);
  const memberRange = cleanText(body.memberRange, 30);
  const applicantRole = cleanText(body.applicantRole, 30);
  const goals = cleanMultiline(body.goals, 2000);

  if (name.length < 2 || !EMAIL.test(email) || communityName.length < 2 || goals.length < 20) return { error: 'invalid_fields' };
  if (whatsapp && whatsapp.length < 8) return { error: 'invalid_fields' };
  if (!MEMBER_RANGES.has(memberRange) || !APPLICANT_ROLES.has(applicantRole)) return { error: 'invalid_fields' };
  if (body.privacyNoticeAcknowledged !== true || body.contactRequested !== true) return { error: 'required_acknowledgement_missing' };

  return {
    row: {
      name,
      email,
      whatsapp: whatsapp || null,
      community_name: communityName,
      member_range: memberRange,
      applicant_role: applicantRole,
      goals,
      privacy_notice_version: '2026-08-14',
      privacy_notice_acknowledged_at: new Date().toISOString(),
      contact_requested_at: new Date().toISOString(),
      source: 'resuma.ia.br',
      submission_fingerprint: fingerprint(email)
    }
  };
}

function validatePrivacyRequest(body) {
  const botError = validateBotSignals(body);
  if (botError) return { error: botError };

  const email = normalizeEmail(body.email);
  const requestType = cleanText(body.requestType, 30);
  const details = cleanMultiline(body.details, 2000);
  if (!EMAIL.test(email) || !PRIVACY_REQUEST_TYPES.has(requestType) || details.length < 10) return { error: 'invalid_fields' };

  return {
    row: {
      email,
      request_type: requestType,
      details,
      privacy_notice_version: '2026-08-14',
      submission_fingerprint: fingerprint(`${email}:${requestType}:${new Date().toISOString().slice(0, 10)}`)
    }
  };
}

module.exports = { validatePilotApplication, validatePrivacyRequest };
