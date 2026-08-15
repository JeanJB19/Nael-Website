// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('nav-icon-open');
const iconClose = document.getElementById('nav-icon-close');

navToggle.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Shared: honor the user's OS-level motion preference everywhere below
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------
// 1) Floating AI network background (hero canvas)
// ---------------------------------------------------------------
(function initHeroNetwork() {
  const canvas = document.getElementById('hero-network');
  const heroSection = canvas && canvas.closest('section');
  if (!canvas || !heroSection) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr, nodes;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createNodes() {
    const count = Math.max(18, Math.min(55, Math.round((width * height) / 18000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: 3.2 + Math.random() * 2.4,
      pulseSpeed: 0.3 + Math.random() * 0.5,
      pulseOffset: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // drift
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      n.x = Math.max(0, Math.min(width, n.x));
      n.y = Math.max(0, Math.min(height, n.y));
    });

    // connecting lines between nearby nodes
    const maxDist = Math.min(160, width / 4);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - dist / maxDist) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes — sharp, infrequent pulses (peaked sine, phase-shifted per node)
    nodes.forEach(n => {
      const raw = prefersReducedMotion ? 0 : Math.sin(time * 0.001 * n.pulseSpeed + n.pulseOffset);
      const pulse = Math.pow(Math.max(0, raw), 5);
      const radius = n.r + pulse * 3;

      ctx.beginPath();
      ctx.fillStyle = `rgba(45, 212, 191, ${0.45 + pulse * 0.45})`;
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (pulse > 0.5) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(45, 212, 191, ${pulse * 0.12})`;
        ctx.arc(n.x, n.y, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  if (prefersReducedMotion) {
    draw(0); // single static frame — no motion
  } else {
    requestAnimationFrame(draw);
  }
})();

// ---------------------------------------------------------------
// 2) Typewriter headline with blinking cursor
// ---------------------------------------------------------------
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = 'Technical Assistance for Results Measurement & Client Needs';

  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }

  let i = 0;
  (function typeNext() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) {
      setTimeout(typeNext, 28 + Math.random() * 35);
    }
  })();
})();

// ---------------------------------------------------------------
// 3) Staggered card reveal — "What I Offer" section
// ---------------------------------------------------------------
(function initCardReveal() {
  const cards = document.querySelectorAll('.reveal-card');
  if (!cards.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('is-visible'));
    return;
  }

  const staggerMs = 150;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => {
          const index = Number(card.dataset.revealIndex || 0);
          card.style.transitionDelay = `${index * staggerMs}ms`;
          card.classList.add('is-visible');
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  observer.observe(cards[0]);
})();
