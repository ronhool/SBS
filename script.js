/* ============================================
   SANS BULLSHIT SANS — ЖЁЛТАЯ ПРЕССА / BRUTALISM
   ============================================ */

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
  // Канцеляризмы
  'принять к сведению', 'прошу рассмотреть возможность', 'ожидаем вашей позиции',
  'по существу заданных вопросов', 'в соответствии с вышеизложенным',
  'в целях совершенствования', 'настоящим уведомляем', 'просим ознакомиться',
  // IT-англицизмы
  'синкануться', 'засинкаться', 'синк', 'заапрувить', 'отфидбечить',
  'замэтчиться', 'скипнуть', 'закоммититься', 'пошэрить', 'чекнуть',
  'задеплоить', 'откатить',
  // Давление
  'надо было вчера', 'прямо сейчас', 'горящий дедлайн', 'аврал',
  'чем быстрее, тем лучше',
  // Инфантилизация
  'человечек', 'задачка', 'отчётик', 'коллегушки', 'письмецо',
  // Псевдопсихология / HR
  'выйти из зоны комфорта', 'собрать энергию', 'перегрев команды',
  'эмпат-кол', 'пейнпоинт', 'ретроградный Меркурий',
  // Саботаж
  'мне за это не платят', 'это не в моей зоне ответственности',
  'обратитесь к моему руководителю',
  // Прочее
  'синергия', 'синергетическ', 'эффективность', 'инновационн',
  'диджитал', 'прорывн', 'дисраптивн', 'agile', 'asap', 'асап',
  'оптимизация штата',
];

BULLSHIT_WORDS.sort((a, b) => b.length - a.length);

const demoInput = document.getElementById('demo-input');
const demoBtn = document.getElementById('demo-btn');
const demoOutput = document.getElementById('demo-output');
const demoStats = document.getElementById('demo-stats');

if (demoBtn && demoInput && demoOutput) {
  demoBtn.addEventListener('click', censorText);
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
    if (demoStats) demoStats.classList.remove('demo-stats--visible');
    return;
  }

  // Work on raw text first, collect replacements, then escape & assemble
  let matchCount = 0;
  const foundWords = [];
  const placeholders = [];

  // Mark matches in raw text using null-byte delimited placeholders
  let working = raw;
  BULLSHIT_WORDS.forEach((word) => {
    const pattern = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${pattern}[а-яёА-ЯЁ]*)`, 'gi');
    working = working.replace(regex, (match) => {
      matchCount++;
      if (!foundWords.includes(word)) foundWords.push(word);
      const idx = placeholders.length;
      placeholders.push(match);
      return `\x00${idx}\x00`;
    });
  });

  // Now escape the remaining text (placeholders won't be affected since they use \x00)
  let escaped = escapeHtml(working);

  // Replace placeholders with actual HTML spans
  escaped = escaped.replace(/\x00(\d+)\x00/g, (_, idxStr) => {
    const orig = placeholders[parseInt(idxStr, 10)];
    const bar = '\u2588'.repeat(Math.max(orig.length, 3));
    return `<span class="bs-word" data-original="${escapeHtml(orig)}">${bar}</span>`;
  });

  demoOutput.innerHTML = escaped;
  demoOutput.classList.add('demo-output--visible');

  if (demoStats) {
    const wordCount = raw.split(/\s+/).filter(Boolean).length;
    const pct = wordCount > 0 ? Math.round((matchCount / wordCount) * 100) : 0;
    demoStats.innerHTML = `
      <span>ОБНАРУЖЕНО: <span class="demo-stats__count">${matchCount} ${pluralize(matchCount, 'совпадение', 'совпадения', 'совпадений')}</span></span>
      <span>УРОВЕНЬ БУЛЛШИТА: <span class="demo-stats__count">${pct}%</span></span>
    `;
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
