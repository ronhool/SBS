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

  // -----------------------------------------------
  // 5. Interactive demo — bullshit censor
  // -----------------------------------------------
  const BULLSHIT_WORDS = [
    // Канцеляризмы
    'принять к сведению', 'прошу рассмотреть возможность', 'ожидаем вашей позиции',
    'по существу заданных вопросов', 'в соответствии с вышеизложенным',
    'в целях совершенствования', 'настоящим уведомляем', 'просим ознакомиться',
    // IT-англицизмы
    'синкануться', 'засинкаться', 'синк', 'заапрувить', 'отфидбечить',
    'замэтчиться', 'скипнуть', 'закоммититься', 'пошэрить', 'чекнуть',
    'задеплоить', 'откатить',
    // Давление
    'надо было вчера', 'горящий дедлайн', 'аврал',
    'чем быстрее, тем лучше', 'прямо сейчас',
    // Инфантилизация
    'человечек', 'задачка', 'отчётик', 'коллегушки', 'письмецо',
    // HR-буллшит
    'выйти из зоны комфорта', 'зоны комфорта', 'собрать энергию',
    'перегрев команды', 'эмпат-кол', 'пейнпоинт', 'ретроградный Меркурий',
    // Саботаж
    'мне за это не платят', 'это не в моей зоне ответственности',
    'обратитесь к моему руководителю',
    // Общий буллшит
    'синергия', 'синергетическ', 'эффективность', 'инновационные решения',
    'инновационн', 'диджитал', 'прорывной', 'прорывн', 'оптимизация',
    'трансформация', 'масштабирование', 'экосистема', 'стейкхолдер',
    'бенчмарк', 'роадмап', 'фреймворк', 'воркшоп', 'брейншторм',
    'имплементация', 'левередж', 'нетворкинг', 'питч', 'скейлить',
    'дисраптивн', 'agile', 'asap', 'асап',
  ];

  // Sort by length descending so longer phrases match first
  BULLSHIT_WORDS.sort((a, b) => b.length - a.length);

  const demoInput = document.getElementById('demo-input');
  const demoBtn = document.getElementById('demo-btn');
  const demoOutput = document.getElementById('demo-output');
  const demoStats = document.getElementById('demo-stats');

  if (demoBtn && demoInput && demoOutput) {
    demoBtn.addEventListener('click', censorText);

    // Also censor on Ctrl+Enter
    demoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        censorText();
      }
    });
  }

  function censorText() {
    const raw = demoInput.value.trim();
    if (!raw) {
      demoOutput.classList.remove('demo-output--visible');
      demoStats.classList.remove('demo-stats--visible');
      return;
    }

    let result = raw;
    let matchCount = 0;
    const foundWords = [];

    // Build regex: match each bullshit word case-insensitively
    BULLSHIT_WORDS.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped}[а-яё]*)`, 'gi');

      result = result.replace(regex, (match) => {
        matchCount++;
        if (!foundWords.includes(word)) foundWords.push(word);
        const bar = '█'.repeat(Math.max(match.length, 3));
        return `<span class="bs-word" data-original="${match}">${bar}</span>`;
      });
    });

    // Escape HTML in remaining text (but preserve our spans)
    // Since we're replacing in raw text, we need a different approach:
    // Re-do: escape first, then replace
    let escaped = escapeHtml(raw);
    matchCount = 0;
    const foundWords2 = [];

    BULLSHIT_WORDS.forEach((word) => {
      const esc = escapeHtml(word);
      const pattern = esc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${pattern}[а-яёА-ЯЁ]*)`, 'gi');

      escaped = escaped.replace(regex, (match) => {
        matchCount++;
        if (!foundWords2.includes(word)) foundWords2.push(word);
        const bar = '█'.repeat(Math.max(match.length, 3));
        return `<span class="bs-word" data-original="${match}">${bar}</span>`;
      });
    });

    demoOutput.innerHTML = escaped;
    demoOutput.classList.add('demo-output--visible');

    // Stats
    if (matchCount > 0) {
      const pct = Math.round((matchCount / raw.split(/\s+/).length) * 100);
      demoStats.innerHTML = `
        <span class="demo-stats__item">
          <span class="demo-stats__count">${matchCount}</span> ${pluralize(matchCount, 'слово', 'слова', 'слов')} зацензурировано
        </span>
        <span class="demo-stats__item">
          ~<span class="demo-stats__count">${pct}%</span> буллшита в тексте
        </span>
      `;
      demoStats.classList.add('demo-stats--visible');
    } else {
      demoStats.innerHTML = 'Буллшит не обнаружен. Вы — редкий человек!';
      demoStats.classList.add('demo-stats--visible');
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function pluralize(n, one, few, many) {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (last > 1 && last < 5) return few;
    if (last === 1) return one;
    return many;
  }

});
