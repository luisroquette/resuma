const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menu?.classList.toggle('is-open', !isOpen);
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  reveals.forEach((element) => observer.observe(element));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const CONSENT_KEY = 'resuma_privacy_choice_v1';
const SESSION_KEY = 'resuma_metrics_session_v1';
const CONSENT_VERSION = '2026-08-14';
const consentBanner = document.querySelector('[data-consent-banner]');
const consentAccept = document.querySelector('[data-consent-accept]');
const consentReject = document.querySelector('[data-consent-reject]');
const privacySettings = document.querySelectorAll('[data-privacy-settings]');

const readLocal = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const writeLocal = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
const removeLocal = (key) => { try { localStorage.removeItem(key); } catch {} };
const consentChoice = () => readLocal(CONSENT_KEY);
const deviceClass = () => {
  if (window.matchMedia('(max-width: 680px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1050px)').matches) return 'tablet';
  return 'desktop';
};

const analyticsSession = () => {
  let sessionId = readLocal(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    writeLocal(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const track = (eventName) => {
  if (consentChoice() !== 'accepted') return;
  let referrerHost = null;
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname : null; } catch { referrerHost = null; }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      sessionId: analyticsSession(),
      eventName,
      path: window.location.pathname,
      referrerHost,
      deviceClass: deviceClass(),
      consentVersion: CONSENT_VERSION
    })
  }).catch(() => {});
};

const setConsent = (choice) => {
  writeLocal(CONSENT_KEY, choice);
  consentBanner?.setAttribute('hidden', '');
  if (choice === 'accepted') track('page_view');
  if (choice === 'rejected') removeLocal(SESSION_KEY);
};

if (!consentChoice()) consentBanner?.removeAttribute('hidden');
if (consentChoice() === 'accepted') track('page_view');
consentAccept?.addEventListener('click', () => setConsent('accepted'));
consentReject?.addEventListener('click', () => setConsent('rejected'));
privacySettings.forEach((button) => button.addEventListener('click', () => consentBanner?.removeAttribute('hidden')));

document.querySelectorAll('a[href="#piloto"], a[href$="/#piloto"]').forEach((link) => {
  link.addEventListener('click', () => track('pilot_cta'), { once: true });
});

const pilotForm = document.querySelector('[data-pilot-form]');
const startedAt = pilotForm?.querySelector('[data-started-at]');
const formStatus = pilotForm?.querySelector('[data-form-status]');
if (startedAt) startedAt.value = String(Date.now());

pilotForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = pilotForm.querySelector('button[type="submit"]');
  const data = new FormData(pilotForm);
  const payload = Object.fromEntries(data.entries());
  payload.startedAt = Number(payload.startedAt);
  payload.privacyNoticeAcknowledged = data.has('privacyNoticeAcknowledged');
  payload.contactRequested = data.has('contactRequested');

  submit.disabled = true;
  formStatus.className = 'form-status';
  formStatus.textContent = 'Enviando sua candidatura…';

  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('submission_failed');

    pilotForm.reset();
    if (startedAt) startedAt.value = String(Date.now());
    formStatus.classList.add('is-success');
    formStatus.textContent = 'Candidatura recebida. A análise e o contato serão feitos manualmente.';
    track('pilot_submit');
  } catch {
    formStatus.classList.add('is-error');
    formStatus.textContent = 'Não foi possível enviar agora. Seus dados não foram confirmados. Tente novamente em alguns minutos.';
  } finally {
    submit.disabled = false;
  }
});

const privacyForm = document.querySelector('[data-privacy-form]');
const privacyStartedAt = privacyForm?.querySelector('[data-started-at]');
const privacyStatus = privacyForm?.querySelector('[data-form-status]');
if (privacyStartedAt) privacyStartedAt.value = String(Date.now());

privacyForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = privacyForm.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(privacyForm).entries());
  payload.startedAt = Number(payload.startedAt);
  submit.disabled = true;
  privacyStatus.className = 'form-status';
  privacyStatus.textContent = 'Registrando seu pedido…';

  try {
    const response = await fetch('/api/privacy-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.protocol) throw new Error('request_failed');

    privacyForm.reset();
    if (privacyStartedAt) privacyStartedAt.value = String(Date.now());
    privacyStatus.classList.add('is-success');
    privacyStatus.textContent = `Pedido recebido. Guarde o protocolo ${result.protocol}. A análise será manual.`;
  } catch {
    privacyStatus.classList.add('is-error');
    privacyStatus.textContent = 'Não foi possível registrar agora. Nenhum pedido foi confirmado. Tente novamente em alguns minutos.';
  } finally {
    submit.disabled = false;
  }
});
