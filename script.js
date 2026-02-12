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
  // ЧУШЬ — инфантилизация, IT-сленг, англицизмы
  'человечек', 'человечка', 'человечку', 'человечком', 'человечки', 'человечков',
  'задачка', 'задачки', 'задачку', 'задачкой',
  'отчётик', 'отчётики', 'отчётика',
  'коллегушки', 'коллегушек',
  'письмецо', 'письмеца', 'письмеце',
  'синк', 'засинкаться', 'синкануть', 'синкануться', 'синканемся', 'засинканемся', 'синкаемся', 'синкнемся', 'синканёмся', 'синканусь', 'синкался', 'синкались',
  'мэтч', 'смэтчиться', 'замэтчиться',
  'апрув', 'апрувить', 'апрувнуть', 'апрувнул', 'апрувнули', 'заапрувить', 'заапрувнуть',
  'фидбек', 'фидбэк', 'фидбэчить', 'отфидбэчить', 'отфидбэчим',
  'чекнуть', 'чекни', 'чекну', 'чекал', 'чекали',
  'скипнуть', 'закоммититься', 'пошэрить', 'задеплоить', 'откатить', 'пофиксить',
  'ресёрч', 'ресёрчить', 'ресерч', 'ресерчить',
  'менеджерить', 'менеджерю', 'менеджерим', 'менеджерит', 'отменеджерить',
  'челлендж', 'челленджить',
  'эджаил', 'агильный',
  'вэлью', 'гуру', 'пивот', 'пич', 'рич', 'роадмап', 'хак', 'шеринг',
  'асап', 'ASAP', 'асапчик',
  'вкусный', 'услышимся', 'услышимся позже', 'зафиналить', 'зашло', 'взять на карандаш', 'крайний',
  'кейс', 'кейса', 'кейсу', 'кейсом', 'кейсе', 'кейсы', 'кейсов', 'кейсам', 'кейсами', 'кейсах',
  'бенчмарк', 'визионер', 'драйв', 'инсайт', 'креатив', 'кросс', 'майндсет', 'мета', 'нарратив', 'постмодерн',
  'припарковать вопрос', 'припарковать тему',
  // ДИЧЬ — псевдопсихология, пустые фразы
  'я вас услышал', 'я тебя услышал', 'я вас услышала', 'я тебя услышала', 'я вас услышал(а)',
  'я на колле', 'все так делают', 'мы же взрослые люди', 'так исторически сложилось', 'чтобы вы понимали',
  'энергия пошла', 'собрать энергию', 'перегрев команды', 'ретроградный Меркурий', 'выйти из зоны комфорта',
  'эмпат-кол', 'пейнпоинт', 'осознанность', 'эскапизм', 'урбанистика', 'симулякр', 'омниканальность',
  'репрезентация', 'стейджинг', 'скейлинг', 'тренд', 'фасилитация', 'имплементация', 'иммерсивность',
  'джентрификация', 'деконструкция', 'монетизация', 'продуктизация', 'проактивность', 'коллаборация',
  'амбассадор', 'юнит экономика', 'экосистема', 'трансформация', 'синергия', 'сторителлинг', 'платформа',
  'парадигма', 'релевантность', 'дисрапт', 'консёрн', 'у нас есть консёрн',
  // БУЛЛШИТ — давление, канцелярит
  'надо было вчера', 'нужно было вчера', 'уже вчера надо было', 'прямо сейчас', 'горящий дедлайн', 'аврал',
  'чем быстрее, тем лучше', 'это срочно', 'нужно срочно', 'очень срочно',
  'принять к сведению', 'прошу рассмотреть возможность', 'просим рассмотреть возможность', 'просим рассмотреть', 'просим вас рассмотреть',
  'ожидаем вашей позиции', 'по существу заданных вопросов', 'в соответствии с вышеизложенным', 'в целях совершенствования',
  'настоящим уведомляем', 'просим ознакомиться',
  'оптимизация штата', 'зона роста', 'точки роста',
  // ENGLISH / JARGON — маркетинговый / IT-буллшит
  'DRM', 'DNA', 'MVP', 'ROI', 'SEM', 'SEO', 'ASAP', 'asap', 'agile',
  'analytics', 'alignment', 'algorithm', 'aggregator', 'accelerate',
  'actionable', 'action items', 'accountability', 'at the end of the day',
  'beta', 'big data', 'blueprint', 'bandwidth', 'brogrammer', 'bottom line',
  'bounce rate', 'bleeding edge', 'best of breed', 'best practices',
  'boil the ocean', 'below the frold', 'brand evangelist', 'bricks and clicks',
  'bring to the party', 'bring to the table', 'curate', 'codify', 'crowdfund',
  'collateral', 'credibility', 'coopetition', 'crowdsource', 'convergence',
  'create value', 'change agent', 'clickthrough', 'come to Jesus',
  'collaboration', 'close the loop', 'cross the chasm', 'content strategy',
  'diversity', 'discovery', 'deep dive', 'disruptive', 'downsizing',
  'data mining', 'digital divide', 'design pattern', 'digital natives',
  'do more with less', 'drink the Kool Aid', 'epic', 'enable', 'empathy',
  'engaging', 'emerging', 'entitled', 'eyeballs', 'engagement', 'enterprise',
  'evangelist', 'exit strategy', 'eat your own dog food', 'flat', 'flow',
  'fusion', 'funnel', 'funded', 'fanboy', 'finalize', 'freemium', 'fail fast',
  'facetime', 'fail forward', 'first or best', 'guru', 'green', 'gamify',
  'groupthink', 'growth hack', 'gamification', 'game changer',
  'globalization', 'glamour metrics', 'HTML5 (html five)', 'homerun',
  'holistic', 'headlights', 'heads down', 'high level', 'hyperlocal',
  'herding cats', 'ignite', 'iconic', 'impact', 'innovate', 'ideation',
  'immersive', 'integrated', 'infographic', 'impressions', 'in the weeds',
  'jellyfish', 'kneedeep', 'lean', 'lean in', 'leverage', 'level up',
  'long tail', 'lizard brain', 'low hanging fruit', 'maker', 'mashup',
  'monetize', 'modernity', 'mindshare', 'milestone', 'make it pop',
  'moving forward', 'marketing funnel', 'make the logo bigger', 'ninja',
  'next gen', 'next level', 'netiquette', 'organic', 'optimize', 'offshoring',
  'opportunity', 'outsourcing', 'over the top', 'out of pocket',
  'on the runway', 'operationalize', 'open the kimono', 'outside the box',
  'pop', 'ping', 'pivot', 'portal', 'pipeline', 'proactive', 'productize',
  'public facing', 'paradigm shift', 'proof of concept', 'pull the trigger',
  'push the envelope', 'peeling the onion', 'patent pending design',
  'qualified leads', 'rich', 'rockstar', 'reach out', 'real time',
  'responsive', 'rightsizing', 'reimagining', 'rightshoring', 'revolutionize',
  'reinvent the wheel', 'sexy', 'scrum', 'shift', 'sizzle', 'sticky',
  'startup', 'standup', 'synergy', 'strategy', 'solution', 'seamless',
  'slam dunk', 'strateger y', 'sea change', 'soft launch', 'stakeholder',
  'scalability', 'social proof', 'social media', 'stealth mode',
  'storytelling', 'sustainability', 'social currency', 'stealth startup',
  'sweat your assets', 'social media expert', 'scratch your own itch',
  'tee off', 'tollgate', 'the cloud', 'tiger team', 'touch base',
  'top of mind', 'touchpoints', 'transparent', 'trickthrough', 'team building',
  'transgenerate', 'thought leader', 'take it offline', 'uber', 'user',
  'unpack', 'unicorn', 'uniques', 'usercentric', 'viral', 'vision',
  'visibility', 'value proposition', 'wizard', 'webinar', 'what is our solve',
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
// Share project button
// -----------------------------------------------
const shareBtn = document.getElementById('share-project-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const url = window.location.href;
    const title = document.title || 'Sans Bullshit Sans™ CYR';
    const text = 'Шрифт, который помечает корпоративный буллшит.';
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        const oldText = shareBtn.textContent;
        shareBtn.textContent = 'ССЫЛКА СКОПИРОВАНА';
        setTimeout(() => { shareBtn.textContent = oldText; }, 2000);
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          const oldText = shareBtn.textContent;
          shareBtn.textContent = 'ССЫЛКА СКОПИРОВАНА';
          setTimeout(() => { shareBtn.textContent = oldText; }, 2000);
        } catch (_) {}
      }
    }
  });
}
