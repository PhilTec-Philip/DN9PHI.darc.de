const lightboxImgs = [];

function initLightbox(selector) {
  document.querySelectorAll(selector).forEach(img => {
    const src = img.getAttribute('src');
    if (lightboxImgs.some(e => e.src === src)) return;
    const name = src.split('/').pop();
    lightboxImgs.push({ src, name });
    img.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(lightboxImgs.findIndex(i => i.src === src));
    });
    img.style.cursor = 'pointer';
  });
}

let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const img = document.getElementById('lightbox-img');
  img.classList.remove('show');
  img.src = lightboxImgs[currentIdx].src;
  document.getElementById('lightbox-filename').textContent = lightboxImgs[currentIdx].name;
  document.getElementById('lightbox').classList.add('show');
  requestAnimationFrame(() => img.classList.add('show'));
  updateCounter();
  document.body.style.overflow = 'hidden';
}

function downloadImage() {
  const src = lightboxImgs[currentIdx].src;
  const name = lightboxImgs[currentIdx].name;
  const a = document.createElement('a');
  a.href = src;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}

function switchImage(dir) {
  const img = document.getElementById('lightbox-img');
  img.classList.remove('show');
  setTimeout(() => {
    currentIdx = (currentIdx + dir + lightboxImgs.length) % lightboxImgs.length;
    img.src = lightboxImgs[currentIdx].src;
    document.getElementById('lightbox-filename').textContent = lightboxImgs[currentIdx].name;
    requestAnimationFrame(() => img.classList.add('show'));
    updateCounter();
  }, 250);
}

function prevImage() { switchImage(-1); }
function nextImage() { switchImage(1); }

function toggleNav() {
  const header = document.querySelector('header');
  header.classList.toggle('nav-open');
  if (!header.classList.contains('nav-open')) hideSubnav();
}

function showSubnav(id) {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.add('showing-subnav');
  nav.querySelectorAll('.subnav, .dropdown').forEach(s => {
    s.classList.remove('show');
    s.classList.remove('active');
  });
  const target = document.getElementById('subnav-' + id);
  if (target) target.classList.add('show');
  const dd = document.querySelector(`.dropdown[data-subnav="${id}"]`);
  if (dd) dd.classList.add('active');
}

function hideSubnav() {
  document.querySelectorAll('.subnav, .dropdown').forEach(s => {
    s.classList.add('no-transition');
    s.classList.remove('show');
    s.classList.remove('active');
  });
  const nav = document.querySelector('nav');
  if (nav) nav.classList.remove('showing-subnav');
  requestAnimationFrame(() => {
    document.querySelectorAll('.subnav').forEach(s => s.classList.remove('no-transition'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a, .subnav a').forEach(a => {
    a.addEventListener('click', () => {
      if (a.classList.contains('subnav-back')) return;
      if (!a.classList.contains('dropbtn')) {
        document.querySelector('header').classList.remove('nav-open');
        hideSubnav();
      }
    });
  });

  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', e => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      const dd = btn.closest('.dropdown');
      if (!dd) return;
      const id = dd.dataset.subnav;
      if (id) showSubnav(id);
    });
  });
});

function updateCounter() {
  const el = document.getElementById('lightbox-counter');
  if (!el) return;
  el.textContent = (currentIdx + 1) + ' / ' + lightboxImgs.length;
  el.style.transform = 'translateX(-50%) scale(1.15)';
  setTimeout(() => el.style.transform = 'translateX(-50%) scale(1)', 150);
}

document.addEventListener('DOMContentLoaded', () => {
  initLightbox('.card img');
  initLightbox('.sstv-gallery .card img');
  initLightbox('.lb-img');

  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  document.querySelectorAll('.lightbox-download').forEach(function(el) {
    el.innerHTML = '';
  });

  function warningPath() {
    const depth = location.pathname.split('/').filter(Boolean).length - 1;
    const base = (depth ? '../'.repeat(depth) : '') + 'media/';
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return base + (dark ? 'warning-dark.svg' : 'warning-light.svg');
  }
  document.querySelectorAll('main img:not(.hero-canvas)').forEach(function(img) {
    img.loading = 'lazy';
    img.onerror = function() { this.src = warningPath(); this.onerror = null; };
  });
  var lbImg = document.getElementById('lightbox-img');
  if (lbImg) lbImg.addEventListener('error', function handler() {
    if (this.src.indexOf('warning.svg') !== -1) return;
    this.src = warningPath();
  });
});

const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = (winScroll / height) * 100 + '%';
  });
}

function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let animId;

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.speed = 0.2 + Math.random() * 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.radius = 1 + Math.random() * 1.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      this.x = Math.max(0, Math.min(w, this.x));
      this.y = Math.max(0, Math.min(h, this.y));
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fill();
    }
  }

  function connect(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 160;
    if (dist < maxDist) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / maxDist) * 0.12})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connect(particles[i], particles[j]);
      }
    }
    animId = requestAnimationFrame(animate);
  }

  resize();

  const count = Math.min(35, Math.floor(w * h / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      const newCount = Math.min(35, Math.floor(w * h / 15000));
      while (particles.length < newCount) {
        particles.push(new Particle());
      }
      if (particles.length > newCount) {
        particles.length = newCount;
      }
    }, 200);
  });

  window._heroCleanup = () => {
    if (animId) cancelAnimationFrame(animId);
    canvas.remove();
  };
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06 });

initHeroParticles();

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<span class="arrow-up"></span>';
backToTop.setAttribute('aria-label', 'Nach oben');
document.body.appendChild(backToTop);
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('section, .hero, .grid-2, .grid-3').forEach(el => {
  el.classList.add('reveal');
});

requestAnimationFrame(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      requestAnimationFrame(() => el.classList.add('visible'));
    } else {
      revealObserver.observe(el);
    }
  });
});
