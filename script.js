(() => {
  const root = document.documentElement;
  const media = typeof matchMedia === 'function'
    ? matchMedia('(prefers-color-scheme: dark)')
    : null;
  let saved = null;
  try {
    saved = localStorage.getItem('comfyclub-theme');
  } catch (_) {}
  if (!['light', 'dark'].includes(saved)) saved = null;

  const buttons = [...document.querySelectorAll('.theme-toggle,.floating-theme-toggle')];
  function applyTheme(theme) {
    root.dataset.theme = theme;
    buttons.forEach(button => {
      button.textContent = theme === 'dark' ? '☀' : '☾';
      const label = theme === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
      button.setAttribute('aria-label', label);
      button.title = label;
    });
  }
  applyTheme(saved || (media && media.matches ? 'dark' : 'light'));
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('comfyclub-theme', saved);
      } catch (_) {}
      applyTheme(saved);
    });
    button.disabled = false;
  });
  const handleSystemTheme = event => {
    if (!saved) applyTheme(event.matches ? 'dark' : 'light');
  };
  if (media) {
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleSystemTheme);
    } else if (typeof media.addListener === 'function') {
      media.addListener(handleSystemTheme);
    }
  }

  const query = document.querySelector('#q');
  const kind = document.querySelector('#kind');
  const grid = document.querySelector('#itemGrid');
  const empty = document.querySelector('#empty');
  const resultCount = document.querySelector('#resultCount');
  const items = [...document.querySelectorAll('.item')];
  const groups = [];
  [...kind.options].filter(option => option.value !== 'all').forEach((option, index) => {
    const members = items.filter(item => item.dataset.kind === option.value);
    if (!members.length) return;
    const heading = document.getElementById('item-group-' + index) || document.createElement('h3');
    heading.className = 'item-group-heading';
    heading.id = 'item-group-' + index;
    grid.append(heading, ...members);
    groups.push({ heading, members, label: option.value });
  });
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase('ja');
  const texts = items.map(item => normalize((item.dataset.text || '') + ' ' + item.textContent));
  function filterItems() {
    const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    items.forEach((item, index) => {
      const matches = (kind.value === 'all' || item.dataset.kind === kind.value)
        && terms.every(term => texts[index].includes(term));
      item.hidden = !matches;
      if (matches) count++;
    });
    groups.forEach(group => {
      const visible = group.members.filter(item => !item.hidden).length;
      group.heading.hidden = visible === 0 || kind.value !== 'all';
      group.heading.textContent = group.label + '（' + visible + '件）';
    });
    empty.hidden = count > 0;
    resultCount.textContent = `${count}件のアイテム`;
  }
  query.addEventListener('input', filterItems);
  kind.addEventListener('change', filterItems);
  filterItems();
  query.disabled = false;
  kind.disabled = false;

  const links = [...document.querySelectorAll('.nav a,.mobile-bottom a')];
  function markSection(id) {
    links.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  markSection(location.hash.slice(1) || 'items');
  addEventListener('hashchange', () => markSection(location.hash.slice(1)));
  const sections = ['items', 'events', 'about'].map(id => document.getElementById(id));
  let queued = false;
  function updateNav() {
    queued = false;
    const boundary = innerWidth <= 520 ? 80 : 150;
    let active = sections[0].id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= boundary) active = section.id;
    });
    if (scrollY + innerHeight >= root.scrollHeight - 3) active = 'about';
    markSection(active);
  }
  addEventListener('scroll', () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(updateNav);
    }
  }, { passive: true });
  addEventListener('resize', updateNav);
  updateNav();
})();
