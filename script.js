
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let w, h;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const count = Math.floor((w * h) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawStars(time) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#e3b23c';
  for (const s of stars) {
    const alpha = reduceMotion
      ? s.baseAlpha
      : s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.25;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = '#f2ede0';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

let rafId;
function animate(time) {
  drawStars(time);
  if (!reduceMotion) rafId = requestAnimationFrame(animate);
}

resizeCanvas();
animate(0);
if (reduceMotion) drawStars(0);
window.addEventListener('resize', resizeCanvas);

const cursorStar = document.getElementById('cursorStar');
if (window.matchMedia('(hover: hover)').matches) {
  cursorStar.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" fill="currentColor"/>
  </svg>`;
  document.addEventListener('mousemove', (e) => {
    cursorStar.style.left = e.clientX + 'px';
    cursorStar.style.top = e.clientY + 'px';
    cursorStar.style.opacity = '0.9';
  });
  document.addEventListener('mouseleave', () => {
    cursorStar.style.opacity = '0';
  });
}

const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const revealTargets = document.querySelectorAll(
  '.section-title, .about-body, .skills-grid, .projects-grid, .contact-grid, .skill-card, .project-card'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => observer.observe(el));

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if (!name) return;
  formStatus.textContent = `Rahmat, ${name}! Xabaringiz qabul qilindi.`;
  contactForm.reset();
  setTimeout(() => (formStatus.textContent = ''), 5000);
});

const sections = document.querySelectorAll('main section, header.hero');
const navAnchors = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent-gold)' : '';
        });
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => navObserver.observe(s));
