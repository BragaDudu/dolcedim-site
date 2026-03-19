/* ============================================================
   DOLCEDIM — script.js
   Interações elegantes e refinadas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     1. CURSOR CUSTOMIZADO
  ──────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function trackRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  document.querySelectorAll('a, button, .sabor-tab, .menu-card, .gal-cell, .dep-card, .tamanho-item').forEach((el) => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorRing.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
  });

  /* ────────────────────────────────────────
     2. NAVBAR
  ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ────────────────────────────────────────
     3. MOBILE MENU
  ──────────────────────────────────────── */
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ────────────────────────────────────────
     4. REVEAL ON SCROLL
  ──────────────────────────────────────── */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right';
  const revealEls = document.querySelectorAll(revealSelectors);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));

  /* ────────────────────────────────────────
     5. CONTADORES
  ──────────────────────────────────────── */
  function animCount(el, end, suffix, dur = 1600) {
    const t0 = performance.now();
    (function frame(t) {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * end) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
  }

  const statsEl = document.querySelector('[data-stats]');
  if (statsEl) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statsEl.querySelectorAll('[data-count]').forEach(el => {
          animCount(el, +el.dataset.count, el.dataset.suffix || '');
        });
      }
    }, { threshold: 0.6 }).observe(statsEl);
  }

  /* ────────────────────────────────────────
     6. ABAS DO CARDÁPIO
  ──────────────────────────────────────── */
  const saborTabs   = document.querySelectorAll('.sabor-tab');
  const saborPanels = document.querySelectorAll('.sabor-panel');

  saborTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      saborTabs.forEach(t => t.classList.remove('active'));
      saborPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('sabor-' + tab.dataset.sabor);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 90);
        });
      }
    });
  });

  /* ────────────────────────────────────────
     7. PARALLAX SUAVE NO HERO
  ──────────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img-wrap img');
  window.addEventListener('scroll', () => {
    if (heroImg) heroImg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });

  /* ────────────────────────────────────────
     8. LIGHTBOX — GALERIA
  ──────────────────────────────────────── */
  // Cria overlay
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position:fixed;inset:0;z-index:99000;display:none;
    align-items:center;justify-content:center;
    background:rgba(44,24,16,0.95);
    backdrop-filter:blur(8px);
  `;
  lb.innerHTML = `
    <img id="lb-img" src="" alt="" style="max-width:90vw;max-height:88vh;object-fit:contain;
      box-shadow:0 20px 80px rgba(0,0,0,0.8);transition:opacity 0.3s;"/>
    <button id="lb-close" style="position:absolute;top:24px;right:28px;background:none;
      border:1px solid rgba(245,237,216,0.25);color:#F5EDD8;width:40px;height:40px;
      font-size:1rem;cursor:pointer;font-family:serif;">✕</button>
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('#lb-img');

  document.querySelectorAll('.gal-cell img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => { lb.style.display = 'none'; document.body.style.overflow = ''; };
  lb.querySelector('#lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ────────────────────────────────────────
     9. TAMANHO SELECIONADO — feedback visual
  ──────────────────────────────────────── */
  document.querySelectorAll('.tamanho-item').forEach(item => {
    item.addEventListener('click', () => {
      const grid = item.closest('.tamanhos-grid');
      grid.querySelectorAll('.tamanho-item').forEach(i => {
        i.style.background = '';
        i.querySelectorAll('.tam-peso, .tam-preco').forEach(el => el.style.color = '');
      });
      item.style.background = 'var(--cacau)';
      item.querySelector('.tam-peso').style.color = 'var(--creme)';
      item.querySelector('.tam-preco').style.color = 'var(--creme)';
    });
  });

  /* ────────────────────────────────────────
     10. HERO — hover zoom sutil
  ──────────────────────────────────────── */
  const heroSection = document.getElementById('hero');
  if (heroSection && heroImg) {
    heroSection.addEventListener('mouseenter', () => {
      heroImg.style.transform = `scale(1.03)`;
      heroImg.style.transition = 'transform 6s ease-out';
    });
  }

  console.log('%c✨ DolceDim — O Pudim Perfeito Existe', 'color:#B8773A;font-size:14px;font-style:italic;');
  console.log('%cPor Fernanda Braga', 'color:#5C2E14;font-size:11px;');
});
