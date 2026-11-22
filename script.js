/* ============================================
   Jalett — Landing
   - Tema claro/oscuro (toggle + preferencia)
   - Menú móvil
   - Catálogo dinámico + filtros
   - Scroll suave + sección activa
   - Año en footer
   ============================================ */

// ---------- Tema ----------
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');

function getPreferredTheme() {
  const saved = localStorage.getItem('jalett-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

applyTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('jalett-theme', next);
  applyTheme(next);
});

// ---------- Menú móvil ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Catálogo dinámico ----------
const products = [
  { name: 'Playera Básica Blanca',  category: 'basica',    badge: 'Básica',   meta: 'Algodón 100% · Desde 50 pz' },
  { name: 'Playera Básica Negra',   category: 'basica',    badge: 'Básica',   meta: 'Algodón 100% · Desde 50 pz' },
  { name: 'Playera Estampada Coral',category: 'estampada', badge: 'Estampada',meta: 'Diseño personalizado' },
  { name: 'Playera Estampada Frontal', category: 'estampada', badge: 'Estampada', meta: 'Diseño personalizado' },
  { name: 'Playera Premium',        category: 'premium',   badge: 'Premium',  meta: 'Tela de alto gramaje' },
  { name: 'Playera Premium Oversize', category: 'premium', badge: 'Premium',  meta: 'Corte holgado' },
  { name: 'Playera Básica Color',   category: 'basica',    badge: 'Básica',   meta: 'Variedad de colores' },
  { name: 'Playera Estampada Espalda', category: 'estampada', badge: 'Estampada', meta: 'Impresión a todo color' }
];

const tshirtSVG = `
  <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M60 20 L80 10 Q100 30 120 10 L140 20 L180 60 L155 85 L150 70 L150 200 Q100 215 50 200 L50 70 L45 85 L20 60 Z"
          fill="currentColor" opacity="0.9"/>
  </svg>`;

const catalogGrid = document.getElementById('catalogGrid');

function renderProducts(filter = 'all') {
  const list = filter === 'all' ? products : products.filter(p => p.category === filter);
  catalogGrid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product__media">
        <span class="product__badge">${p.badge}</span>
        ${tshirtSVG}
      </div>
      <div class="product__body">
        <h3 class="product__name">${p.name}</h3>
        <p class="product__meta">${p.meta}</p>
      </div>
    </article>
  `).join('');
}

renderProducts();

// ---------- Filtros ----------
const filterButtons = document.querySelectorAll('.filter');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    renderProducts(btn.dataset.filter);
  });
});

// ---------- Sección activa en nav ----------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => observer.observe(sec));

// ---------- Año en footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
