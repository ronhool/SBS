/* ============================================
   Sans Bullshit Sans — Notion-style Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------
  // 1. Scroll-reveal
  // -----------------------------------------------
  const revealEls = document.querySelectorAll(
    'section, .callout, .stat-card, .notion-card, .example-box, .gradation-row, .toggle, .prop-item'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 0.04, 0.3)}s`;
    observer.observe(el);
  });

  // Fallback: reveal all after 1.5s
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
      el.classList.add('reveal--visible');
    });
  }, 1500);

  // -----------------------------------------------
  // 2. Smooth-scroll for anchor links
  // -----------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // -----------------------------------------------
  // 3. Stat counter animation
  // -----------------------------------------------
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.stat-card__number');
          if (!numEl) return;
          const text = numEl.textContent.trim();
          const match = text.match(/^(\d+)/);
          if (match) {
            const target = parseInt(match[1], 10);
            const suffix = text.replace(/^\d+/, '');
            animateCounter(numEl, target, suffix);
          }
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach((card) => statObserver.observe(card));

  function animateCounter(el, target, suffix) {
    const duration = 900;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // -----------------------------------------------
  // 4. Redacted: click to reveal/hide
  // -----------------------------------------------
  document.querySelectorAll('.redacted').forEach((el) => {
    const originalHTML = el.innerHTML;
    const word = el.dataset.word;
    let revealed = false;

    el.addEventListener('click', () => {
      revealed = !revealed;
      if (revealed) {
        el.textContent = word;
        el.style.color = '#fff';
      } else {
        el.innerHTML = originalHTML;
        el.style.color = '';
      }
    });
  });

});
