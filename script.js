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
  document.querySelector('header').classList.toggle('nav-open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('header').classList.remove('nav-open');
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
