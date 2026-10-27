const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = navLinks.querySelectorAll('a');

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => spy.observe(section));

/* ---------- Scroll progress ---------- */
const progress = document.getElementById('scrollProgress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------- Hero: typed terminal and drawn burst ---------- */
document.querySelectorAll('.term-body > div').forEach((line, i) => {
  line.style.setProperty('--i', i);
});

document.querySelectorAll('.burst line').forEach((line, i) => {
  line.setAttribute('pathLength', '1');
  line.style.setProperty('--i', i);
});

/* ---------- Project board ---------- */
// Edit this list to update the board. status: todo | doing | done
const boardItems = [
  {
    title: 'Tonearm: public release',
    status: 'todo',
    area: 'Software',
    when: 'Next',
    desc: 'Open the repository once the player is stable enough to share.',
    tags: ['Electron', 'React'],
  },
  {
    title: 'Tonearm',
    status: 'doing',
    area: 'Software',
    when: 'Since Oct 2026',
    desc: 'A Material 3 Expressive music player for the Linux desktop, inspired by PixelPlayer and written from scratch: interface re-coloured from the album art, crossfade transitions, background play.',
    tags: ['Electron', 'React', 'Linux'],
    note: 'Private repo for now',
  },
  {
    title: 'Portfolio v2',
    status: 'doing',
    area: 'Web',
    when: 'Oct 2026',
    desc: 'This site: motion, scroll reveals and this board, in plain HTML, CSS and JavaScript with no framework.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://github.com/Joseane772/joseane772.github.io',
  },
  {
    title: 'dotfiles',
    status: 'doing',
    area: 'Linux',
    when: 'Ongoing',
    desc: 'My daily-driver CachyOS setup: Niri, DankMaterialShell, Fish, Alacritty and GTK theming, with a one-command installer.',
    tags: ['Linux', 'Niri', 'Shell'],
    link: 'https://github.com/Joseane772/dotfiles',
  },
  {
    title: 'Kubernetes fundamentals',
    status: 'doing',
    area: 'Networks',
    when: 'Learning',
    desc: 'Learning container orchestration on top of the multi-VM Linux testbeds I already build.',
    tags: ['Kubernetes', 'Linux'],
  },
  {
    title: '5G network automation (MSc thesis)',
    status: 'done',
    area: 'Networks',
    when: 'Jul 2026',
    desc: 'A system that automatically manages a 5G network under overload, connecting DataMiner to the Open5GS core with Python services, Prometheus and Linux traffic control.',
    tags: ['5G', 'Python', 'DataMiner', 'tc/HTB'],
    link: 'https://github.com/Joseane772/mythesis',
  },
  {
    title: 'mpv-vlc-redesign',
    status: 'done',
    area: 'Linux',
    when: 'Oct 2026',
    desc: "Juxtopposed's community VLC redesign rebuilt as an mpv user script, with OpenSubtitles search.",
    tags: ['Lua', 'mpv'],
    link: 'https://github.com/Joseane772/mpv-vlc-redesign',
  },
  {
    title: 'Product_API',
    status: 'done',
    area: 'Software',
    when: 'Sep 2024',
    desc: 'ASP.NET Core API on AWS DynamoDB with Docker Compose and unit tests. Sky Careers technical assessment.',
    tags: ['C#', 'AWS', 'Docker Compose'],
    link: 'https://github.com/Joseane772/Product_API',
  },
  {
    title: 'RAG document assistant',
    status: 'done',
    area: 'AI',
    when: 'Sep 2024',
    desc: 'Led a team of 5 at Deloitte Tech Experience building an OpenAI assistant grounded in a document set.',
    tags: ['OpenAI API', 'RAG', 'Team lead'],
  },
  {
    title: 'Mão Solidária',
    status: 'done',
    area: 'Web',
    when: 'Jun 2024',
    desc: 'Volunteer and campaign matching platform with a points-based rewards system, built by a team of 5.',
    tags: ['React', 'Team project'],
    link: 'https://github.com/Joseane772/Mao-Solidaria',
  },
  {
    title: 'Compiler construction',
    status: 'done',
    area: 'Software',
    when: 'May 2024',
    desc: 'An ANTLR compiler from scratch: lexer, parser, semantic analysis and code generation.',
    tags: ['Java', 'ANTLR'],
    link: 'https://github.com/Joseane772/Agl-Pojeto-de-compiladores',
  },
  {
    title: 'City-Builder',
    status: 'done',
    area: 'Web',
    when: 'May 2024',
    desc: 'Interactive 3D city builder in the browser with Three.js and Vite.',
    tags: ['Three.js', 'Vite'],
    link: 'https://github.com/Joseane772/City-Builder',
  },
];

const boardEl = document.getElementById('board-columns');
const filtersEl = document.getElementById('boardFilters');
let activeArea = 'All';
let dragged = null;

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const cardHtml = (item) => `
  <p class="kcard-meta"><span class="area area-${item.area.toLowerCase()}">${escapeHtml(item.area)}</span><span>${escapeHtml(item.when)}</span></p>
  <h4>${escapeHtml(item.title)}</h4>
  <p class="kcard-desc">${escapeHtml(item.desc)}</p>
  <div class="kcard-tags">${item.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join('')}</div>
  ${item.status === 'doing' ? '<div class="kcard-pulse" aria-hidden="true"><span></span></div>' : ''}
  ${item.link ? `<a class="kcard-link" href="${item.link}" target="_blank" rel="noopener">Repo &rarr;</a>` : ''}
  ${item.note ? `<p class="kcard-note">${escapeHtml(item.note)}</p>` : ''}
`;

const renderBoard = () => {
  boardEl.querySelectorAll('.column').forEach((col) => {
    const status = col.dataset.status;
    const body = col.querySelector('.column-body');
    const items = boardItems.filter((it) => it.status === status && (activeArea === 'All' || it.area === activeArea));
    body.innerHTML = '';
    items.forEach((item, i) => {
      const card = document.createElement('article');
      card.className = 'kcard tilt';
      card.draggable = true;
      card.style.setProperty('--i', i);
      card.innerHTML = cardHtml(item);
      card.addEventListener('dragstart', (e) => {
        dragged = item;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.title);
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        dragged = null;
      });
      body.appendChild(card);
    });
    col.querySelector('.count').textContent = items.length;
  });
  bindTilt(boardEl.querySelectorAll('.tilt'));
};

boardEl.querySelectorAll('.column').forEach((col) => {
  col.addEventListener('dragover', (e) => {
    if (!dragged) return;
    e.preventDefault();
    col.classList.add('drop-target');
  });
  col.addEventListener('dragleave', (e) => {
    if (!col.contains(e.relatedTarget)) col.classList.remove('drop-target');
  });
  col.addEventListener('drop', (e) => {
    e.preventDefault();
    col.classList.remove('drop-target');
    if (!dragged || dragged.status === col.dataset.status) return;
    dragged.status = col.dataset.status;
    renderBoard();
  });
});

const areas = ['All', ...new Set(boardItems.map((it) => it.area))];
areas.forEach((area) => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip' + (area === activeArea ? ' active' : '');
  chip.textContent = area;
  chip.setAttribute('aria-pressed', area === activeArea);
  chip.addEventListener('click', () => {
    activeArea = area;
    filtersEl.querySelectorAll('.chip').forEach((c) => {
      const on = c.textContent === area;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on);
    });
    renderBoard();
  });
  filtersEl.appendChild(chip);
});

/* ---------- Tilt on hover ---------- */
function bindTilt(nodes) {
  if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
  nodes.forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${x * 6}deg`);
      el.style.setProperty('--rx', `${-y * 6}deg`);
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    });
  });
}

document.querySelectorAll('.card, .skill-group').forEach((el) => el.classList.add('tilt'));
renderBoard();
bindTilt(document.querySelectorAll('.tilt'));

/* ---------- Reveal on scroll ---------- */
const revealGroups = [
  '.section-title',
  '#about p',
  '.exp-item',
  '.grid-cards .card',
  '.board-lede',
  '.board-filters',
  '.board .column',
  '.skill-group',
  '.edu-block',
  'details.coursework',
  'footer .wrap',
];

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', `${Math.min(i, 8) * 70}ms`);
  });
});

const revealer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  if (reduceMotion) el.classList.add('in');
  else revealer.observe(el);
});
