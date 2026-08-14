const header = document.querySelector('[data-header]');
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

const demoContent = {
  summary: {
    label: 'TODAY / 18:30', count: '126 MESSAGES', title: 'Today, in three points', confidence: '92%', width: '92%',
    lines: [
      'Workshop confirmed for Tuesday at 7 PM.',
      'Registration closes tomorrow.',
      'Two useful links were preserved.'
    ]
  },
  question: {
    label: '!PERGUNTA / ANSWER', count: '3 SOURCES', title: 'When does registration close?', confidence: '96%', width: '96%',
    lines: [
      'Registration closes tomorrow.',
      'The form was confirmed at 14:31.',
      'Latest link was pinned at 14:44.'
    ]
  },
  event: {
    label: 'GROUP EVENT / 16:08', count: 'AUDIT LOG', title: 'A participant left the group', confidence: '100%', width: '100%',
    lines: [
      'Exit event stored as structured context.',
      'Configured follow-up flow was evaluated.',
      'No action ran outside administrator rules.'
    ]
  }
};

const demo = document.querySelector('[data-signal-demo]');
if (demo) {
  const buttons = [...demo.querySelectorAll('[data-demo-mode]')];
  const output = demo.querySelector('.signal-output');
  const title = demo.querySelector('[data-output-title]');
  const body = demo.querySelector('[data-output-body]');
  const label = demo.querySelector('[data-output-label]');
  const count = demo.querySelector('[data-output-count]');
  const confidence = demo.querySelector('[data-output-confidence]');
  const meter = demo.querySelector('.confidence i b');

  const renderMode = (mode) => {
    const content = demoContent[mode];
    if (!content) return;
    buttons.forEach((button) => {
      const selected = button.dataset.demoMode === mode;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected) output?.setAttribute('aria-labelledby', button.id);
    });
    output?.classList.remove('is-changing');
    void output?.offsetWidth;
    label.textContent = content.label;
    count.textContent = content.count;
    title.textContent = content.title;
    body.replaceChildren(...content.lines.map((line, index) => {
      const paragraph = document.createElement('p');
      const number = document.createElement('b');
      number.textContent = String(index + 1).padStart(2, '0');
      paragraph.append(number, document.createTextNode(` ${line}`));
      return paragraph;
    }));
    confidence.textContent = content.confidence;
    meter.style.width = content.width;
    output?.classList.add('is-changing');
  };

  buttons.forEach((button) => button.addEventListener('click', () => renderMode(button.dataset.demoMode)));
  buttons.forEach((button, index) => button.addEventListener('keydown', (event) => {
    const keyTargets = {
      ArrowRight: (index + 1) % buttons.length,
      ArrowLeft: (index - 1 + buttons.length) % buttons.length,
      Home: 0,
      End: buttons.length - 1
    };
    const targetIndex = keyTargets[event.key];
    if (targetIndex === undefined) return;
    event.preventDefault();
    const target = buttons[targetIndex];
    renderMode(target.dataset.demoMode);
    target.focus();
  }));
}
