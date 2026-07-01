import Lenis from 'lenis';

function initLenis() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduced.matches) {
    return;
  }

  new Lenis({
    autoRaf: true,
    lerp: 0.12,
  });
}

function initTypewriter() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = document.querySelectorAll<HTMLElement>('[data-typewriter]');

  for (const node of nodes) {
    const text = node.dataset.text ?? node.textContent ?? '';
    node.textContent = text;

    if (reduced.matches || node.dataset.typed === 'true') {
      continue;
    }

    node.dataset.typed = 'true';
    node.textContent = '';

    let index = 0;
    const timer = window.setInterval(() => {
      node.textContent = text.slice(0, index + 1);
      index += 1;

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 28);
  }
}

function initMotion() {
  initLenis();
  initTypewriter();
}

document.addEventListener('astro:page-load', initMotion);
initMotion();
