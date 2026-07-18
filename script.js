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
  document.getElementById('lightbox-img').src = lightboxImgs[currentIdx].src;
  document.getElementById('lightbox-filename').textContent = lightboxImgs[currentIdx].name;
  document.getElementById('lightbox').classList.add('show');
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

function prevImage() {
  currentIdx = (currentIdx - 1 + lightboxImgs.length) % lightboxImgs.length;
  document.getElementById('lightbox-img').src = lightboxImgs[currentIdx].src;
  document.getElementById('lightbox-filename').textContent = lightboxImgs[currentIdx].name;
  updateCounter();
}

function nextImage() {
  currentIdx = (currentIdx + 1) % lightboxImgs.length;
  document.getElementById('lightbox-img').src = lightboxImgs[currentIdx].src;
  document.getElementById('lightbox-filename').textContent = lightboxImgs[currentIdx].name;
  updateCounter();
}

function toggleNav() {
  const header = document.querySelector('header');
  header.classList.toggle('nav-open');
  if (!header.classList.contains('nav-open')) hideSubnav();
}

function showSubnav(id) {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.add('showing-subnav');
  nav.querySelectorAll('.subnav').forEach(s => s.classList.remove('show'));
  const target = document.getElementById('subnav-' + id);
  if (target) target.classList.add('show');
}

function hideSubnav() {
  document.querySelectorAll('.subnav').forEach(s => {
    s.classList.add('no-transition');
    s.classList.remove('show');
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
  document.getElementById('lightbox-counter').textContent = (currentIdx + 1) + ' / ' + lightboxImgs.length;
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
});

const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress.style.width = (winScroll / height) * 100 + '%';
  });
}
