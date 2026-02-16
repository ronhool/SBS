/* ============================================
   SANS BULLSHIT SANS — ЖЁЛТАЯ ПРЕССА / BRUTALISM
   ============================================ */

// -----------------------------------------------
// 0. Masthead date — текущие месяц и год
// -----------------------------------------------
const MONTHS_RU = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
const mastheadDateEl = document.getElementById('masthead-date');
if (mastheadDateEl) {
  const d = new Date();
  mastheadDateEl.textContent = MONTHS_RU[d.getMonth()] + ' ' + d.getFullYear();
}

const footerYearEl = document.getElementById('footer-year');
if (footerYearEl) {
  const y = new Date().getFullYear();
  footerYearEl.textContent = '2025–' + y;
}

// -----------------------------------------------
// 1. Censored spans — click to reveal
// -----------------------------------------------
document.querySelectorAll('.censored').forEach((el) => {
  el.addEventListener('click', () => {
    el.style.color = '#fff';
    el.style.background = 'var(--red)';
    el.textContent = el.dataset.word;
    el.style.cursor = 'default';
  });
});

// -----------------------------------------------
// 2. Toggle arrows (visual feedback on open/close)
// -----------------------------------------------
document.querySelectorAll('.toggle').forEach((toggle) => {
  toggle.addEventListener('toggle', () => {
    // CSS handles open styling, nothing extra needed
  });
});

// -----------------------------------------------
// 3. Scroll reveal — brutalist fade-in
// -----------------------------------------------
const revealElements = document.querySelectorAll(
  'section, .stat-row, .evidence-box, .columns-3, .spec-grid, .gradation-stack, .exceptions-row, .pullquote'
);

revealElements.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'none';
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.05 }
);

revealElements.forEach((el) => observer.observe(el));

// Fallback: force reveal after 2s for embedded browsers
setTimeout(() => {
  revealElements.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}, 2000);

// -----------------------------------------------
// 4. Stat counter animation
// -----------------------------------------------
document.querySelectorAll('.stat-block__num').forEach((el) => {
  const target = parseInt(el.textContent, 10);
  if (isNaN(target)) return;
  el.textContent = '0%';
  let started = false;

  const countObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current + '%';
        }, 30);
        countObserver.unobserve(el);
      }
    },
    { threshold: 0.5 }
  );
  countObserver.observe(el);
});

// -----------------------------------------------
// 5. Interactive demo — bullshit censor
// -----------------------------------------------
const BULLSHIT_WORDS = [
  // 🇬🇧 ENGLISH — Category A: short
  'DRM', 'DNA', 'MVP', 'ROI', 'SEM', 'SEO', 'ASAP', 'asap', 'agile', 'beta', 'epic', 'flat', 'flow', 'green', 'guru', 'html five', 'lean', 'maker', 'ninja', 'ping', 'pivot', 'pop', 'rich', 'scrum', 'sexy', 'shift', 'uber', 'user', 'viral',
  // 🇬🇧 ENGLISH — Category B: corporate jargon
  'analytics', 'alignment', 'algorithm', 'aggregator', 'accelerate', 'actionable', 'big data', 'blueprint', 'bandwidth', 'brogrammer', 'bottom line', 'bounce rate', 'curate', 'codify', 'crowdfund', 'collateral', 'credibility', 'coopetition', 'crowdsource', 'convergence', 'diversity', 'discovery', 'deep dive', 'disruptive', 'downsizing', 'data mining', 'enable', 'empathy', 'engaging', 'emerging', 'entitled', 'eyeballs', 'engagement', 'enterprise', 'evangelist', 'fail fast', 'face time', 'fanboy', 'finalize', 'freemium', 'fusion', 'funnel', 'funded', 'gameify', 'groupthink', 'growth hack', 'holistic', 'homerun', 'headlights', 'heads down', 'high level', 'hyperlocal', 'ignite', 'iconic', 'impact', 'innovate', 'ideation', 'immersive', 'integrated', 'infographic', 'impressions', 'jellyfish', 'knee deep', 'lean in', 'leverage', 'level up', 'long tail', 'mashup', 'monetize', 'modernity', 'mindshare', 'milestone', 'make it pop', 'netiquette', 'next gen', 'next level', 'organic', 'optimize', 'offshoring', 'opportunity', 'outsourcing', 'portal', 'pipeline', 'proactive', 'productize', 'reach out', 'real time', 'responsive', 'rightsizing', 'reimagining', 'rockstar', 'sizzle', 'sticky', 'startup', 'standup', 'synergy', 'strategy', 'solution', 'seamless', 'slam dunk', 'strategery', 'sea change', 'soft launch', 'stakeholder', 'scalability', 'tee off', 'tollgate', 'the cloud', 'tiger team', 'touch base', 'top of mind', 'touchpoints', 'transparent', 'unpack', 'unicorn', 'uniques', 'usercentric', 'vision', 'visibility', 'wizard', 'webinar',
  // 🇬🇧 ENGLISH — Category C: phrases
  'action items', 'accountability', 'at the end of the day', 'bleeding edge', 'best of breed', 'best practices', 'boil the ocean', 'below the fold', 'brand evangelist', 'bricks and clicks', 'bring to the party', 'bring to the table', 'create value', 'change agent', 'clickthrough', 'come to Jesus', 'collaboration', 'close the loop', 'cross the chasm', 'content strategy', 'digital divide', 'design pattern', 'digital natives', 'do more with less', 'drink the Kool Aid', 'exit strategy', 'eat your own dog food', 'fail forward', 'first or best', 'gamification', 'game changer', 'globalization', 'glamour metrics', 'herding cats', 'in the weeds', 'lizard brain', 'low hanging fruit', 'moving forward', 'marketing funnel', 'make the logo bigger', 'over the top', 'out of pocket', 'on the runway', 'operationalize', 'open the kimono', 'outside the box', 'public facing', 'paradigm shift', 'proof of concept', 'pull the trigger', 'push the envelope', 'peeling the onion', 'patent pending design', 'qualified leads', 'rightshoring', 'revolutionize', 'reinvent the wheel', 'social proof', 'social media', 'stealth mode', 'storytelling', 'sustainability', 'social currency', 'stealth startup', 'sweat your assets', 'social media expert', 'scratch your own itch', 'trickthrough', 'team building', 'transgenerate', 'thought leader', 'take it offline', 'value proposition', 'what is our solve',
  // 🇷🇺 ЧУШЬ — диминутивы и заимствования
  'человечек', 'человечка', 'человечку', 'человечком', 'человечки', 'человечков',
  'задачка', 'задачки', 'задачку', 'задачкой',
  'отчётик', 'отчётики', 'отчётика',
  'коллегушки', 'коллегушек',
  'письмецо', 'письмца', 'письмце', 'письмеца', 'письмеце',
  'синк', 'синкануться', 'синканемся', 'засинкаться', 'засинканемся', 'синкаемся', 'синкнемся', 'синканёмся',
  'мэтч', 'смэтчиться', 'замэтчиться',
  'апрув', 'аппрув', 'апрувить', 'апрувнуть', 'апрувнул', 'апрувнули', 'заапрувить', 'заапрувнуть', 'зааппрувьте',
  'фидбек', 'фидбэк', 'фидбэчить', 'отфидбэчить', 'отфидбэчим',
  'чек', 'чекнуть', 'чекни', 'чекну', 'чекал', 'чекали',
  'скипнуть', 'закоммититься', 'пошерить', 'пошэрить', 'задеплоить', 'пофиксить',
  'ресёрч', 'ресёрчить', 'ресерч', 'ресерчить',
  'челлендж', 'челленджить',
  'эджайл', 'эджаил', 'агильный',
  'вэлью', 'пивот', 'пич', 'роадмап', 'шеринг', 'асап', 'асапчик',
  // 🇷🇺 ДИЧЬ — корпоративная идеология
  'я вас слышал', 'я тебя слышал', 'я вас слышала', 'я тебя слышала',
  'я на колле', 'все так делают', 'мы же взрослые люди', 'так исторически сложилось', 'чтобы вы понимали',
  'энергия пошла', 'собрать энергию', 'перегрев команды', 'ретроградный Меркурий', 'выйти из зоны комфорта',
  'эмпат-кол', 'пейнпоинт', 'осознанность', 'эскапизм', 'урбанистика', 'симулякр', 'омниканальность',
  'репрезентация', 'стейджинг', 'скейлинг', 'фасилитация', 'имплементация', 'иммерсивность',
  'джентрификация', 'деконструкция', 'монетизация', 'продуктизация', 'проактивность', 'коллаборация',
  'амбассадор', 'юнит экономика', 'экосистема', 'трансформация', 'синергия', 'сторителлинг',
  'парадигма', 'релевантность', 'дисрапт', 'консёрн', 'у нас есть консёрн',
  'колл ту экшен', 'конф-колл', 'редфлаг', 'дедлайн', 'тренд',
  // 🇷🇺 БУЛЛШИТ — фразы-отмазки
  'надо было вчера', 'нужно было вчера', 'уже вчера надо было',
  'прямо сейчас', 'горящий дедлайн', 'аврал',
  'чем быстрее, тем лучше', 'это срочно', 'нужно срочно', 'очень срочно',
  'принять к сведению', 'прошу рассмотреть возможность', 'просим рассмотреть возможность', 'просим рассмотреть', 'просим вас рассмотреть',
  'ожидаем вашей позиции', 'по существу заданных вопросов', 'в соответствии с вышеизложенным', 'в целях совершенствования',
  'настоящим уведомляем', 'просим ознакомиться',
  'оптимизация штата',
  'я вас услышал', 'я тебя услышал', 'я вас услышала', 'я тебя услышала',
  'зона роста', 'точки роста',
];

BULLSHIT_WORDS.sort((a, b) => b.length - a.length);

const demoInput = document.getElementById('demo-input');
const demoBtn = document.getElementById('demo-btn');
const demoStats = document.getElementById('demo-stats');

const DEMO_STORAGE_KEY = 'sbs-demo-text';

if (demoInput) {
  const saved = sessionStorage.getItem(DEMO_STORAGE_KEY);
  if (saved) demoInput.value = saved;
  demoInput.addEventListener('input', () => {
    sessionStorage.setItem(DEMO_STORAGE_KEY, demoInput.value);
  });
}

if (demoBtn && demoInput) {
  demoBtn.addEventListener('click', checkBullshitLevel);
  demoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      checkBullshitLevel();
    }
  });
}

function checkBullshitLevel() {
  const raw = demoInput.value.trim();
  if (!raw) {
    if (demoStats) demoStats.classList.remove('demo-stats--visible');
    return;
  }

  let matchCount = 0;
  let working = raw;
  BULLSHIT_WORDS.forEach((word) => {
    const pattern = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${pattern}[а-яёА-ЯЁ]*)`, 'gi');
    working = working.replace(regex, () => {
      matchCount++;
      return '\x00';
    });
  });

  if (demoStats) {
    const wordCount = raw.split(/\s+/).filter(Boolean).length;
    const pct = wordCount > 0 ? Math.round((matchCount / wordCount) * 100) : 0;
    demoStats.innerHTML = `<span>УРОВЕНЬ БУЛЛШИТА: <span class="demo-stats__count">${pct}%</span></span>`;
    demoStats.classList.add('demo-stats--visible');
  }
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}

function pluralize(n, one, few, many) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

// -----------------------------------------------
// Share modal (social networks)
// -----------------------------------------------
const shareBtn = document.getElementById('share-project-btn');
const shareModal = document.getElementById('share-modal');

let lastFocusedEl = null;

function getCanonicalUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  const href = canonical?.href || window.location.href;
  return href.split('#')[0];
}

function getSharePayload() {
  const url = getCanonicalUrl();
  const title = 'SANS BULLSHIT SANS CYR — ШРИФТ, КОТОРЫЙ НЕ ЦЕРЕМОНИТСЯ';
  return { url, title, text: title };
}

function updateShareLinks() {
  if (!shareModal) return;
  const { url, title, text } = getSharePayload();

  const map = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  shareModal.querySelectorAll('a[data-share]').forEach((a) => {
    const key = a.getAttribute('data-share');
    if (!key || !map[key]) return;
    a.setAttribute('href', map[key]);
  });
}

function openShareModal() {
  if (!shareModal) return;
  updateShareLinks();
  lastFocusedEl = document.activeElement;
  shareModal.classList.add('is-open');
  shareModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const first = shareModal.querySelector('[data-share=\"telegram\"]');
  if (first && typeof first.focus === 'function') first.focus();
}

function closeShareModal() {
  if (!shareModal) return;
  shareModal.classList.remove('is-open');
  shareModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
}

if (shareBtn && shareModal) {
  shareBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openShareModal();
  });

  shareModal.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    if (t.closest('[data-share-close]')) {
      closeShareModal();
      return;
    }

    const shareEl = t.closest('[data-share]');
    if (!shareEl) return;

    const key = shareEl.getAttribute('data-share');
    if (key === 'copy') {
      (async () => {
        try {
          const { url } = getSharePayload();
          await navigator.clipboard.writeText(url);
          const old = shareEl.textContent;
          shareEl.textContent = 'ССЫЛКА СКОПИРОВАНА';
          setTimeout(() => { shareEl.textContent = old; }, 1600);
        } catch (_) {}
      })();
      return;
    }

    // Close modal after clicking a social link
    setTimeout(() => closeShareModal(), 50);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!shareModal.classList.contains('is-open')) return;
    closeShareModal();
  });
}
