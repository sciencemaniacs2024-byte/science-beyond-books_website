// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); showPage(el.dataset.page); });
});

// Hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Scroll progress
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  const fill = document.querySelector('.progress-fill');
  if (fill) fill.style.width = scrolled + '%';
});

// Quiz logic
document.querySelectorAll('.quiz-opt').forEach(btn => {
  btn.addEventListener('click', function () {
    const q = this.closest('.quiz-q');
    if (q.dataset.answered) return;
    q.dataset.answered = true;
    const isCorrect = this.dataset.correct === 'true';
    this.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) {
      q.querySelector('[data-correct="true"]').classList.add('correct');
    }
    const fb = q.querySelector('.quiz-feedback');
    if (fb) fb.classList.add('show');
  });
});

// States of Matter canvas animations
function drawParticles(canvas, type) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const particles = [];
  const count = type === 'solid' ? 16 : type === 'liquid' ? 14 : 10;
  const color = type === 'solid' ? '#4f8ef7' : type === 'liquid' ? '#22d3a5' : '#a855f7';
  const speed = type === 'solid' ? 0.3 : type === 'liquid' ? 1.2 : 3;

  for (let i = 0; i < count; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    particles.push({
      x: type === 'solid' ? 15 + col * 20 : Math.random() * (w - 10) + 5,
      y: type === 'solid' ? 15 + row * 20 : Math.random() * (h - 10) + 5,
      ox: type === 'solid' ? 15 + col * 20 : 0,
      oy: type === 'solid' ? 15 + row * 20 : 0,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: type === 'gas' ? 3 : 4
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      if (type === 'solid') {
        p.x += (p.ox - p.x) * 0.1 + (Math.random() - 0.5) * 0.4;
        p.y += (p.oy - p.y) * 0.1 + (Math.random() - 0.5) * 0.4;
      } else {
        p.x += p.vx; p.y += p.vy;
        if (p.x < p.r || p.x > w - p.r) p.vx *= -1;
        if (p.y < p.r || p.y > h - p.r) p.vy *= -1;
        if (type === 'liquid' && p.y < h * 0.35) { p.vy = Math.abs(p.vy); }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

document.querySelectorAll('.state-canvas').forEach(canvas => {
  drawParticles(canvas, canvas.dataset.type);
});

// Atom animation
function setupAtom(containerId, electrons, colors) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const orbits = container.querySelectorAll('.orbit');
  orbits.forEach((orbit, i) => {
    const size = parseInt(orbit.dataset.size);
    orbit.style.width = size + 'px';
    orbit.style.height = size + 'px';
    const el = orbit.querySelector('.electron');
    if (el) {
      el.style.setProperty('--orbit-r', (size / 2) + 'px');
      el.style.top = '50%'; el.style.left = '50%';
      el.style.marginTop = '-5px'; el.style.marginLeft = '-5px';
      el.style.transformOrigin = '5px 5px';
      el.style.animationDuration = (2 + i * 1.5) + 's';
    }
  });
}

// Tooltip for elements
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', function (e) {
    const tip = document.createElement('div');
    tip.className = 'tooltip-popup';
    tip.textContent = this.dataset.tooltip;
    tip.style.cssText = `position:fixed;background:#1a2540;border:1px solid rgba(79,142,247,0.3);color:#e2e8f0;
      padding:6px 12px;border-radius:8px;font-size:0.8rem;z-index:9999;pointer-events:none;
      box-shadow:0 4px 20px rgba(0,0,0,0.5);max-width:200px;line-height:1.5;`;
    document.body.appendChild(tip);
    const rect = this.getBoundingClientRect();
    tip.style.top = (rect.bottom + 8) + 'px';
    tip.style.left = Math.min(rect.left, window.innerWidth - 220) + 'px';
    this._tip = tip;
  });
  el.addEventListener('mouseleave', function () {
    if (this._tip) { this._tip.remove(); this._tip = null; }
  });
});

// Periodic table element hover
document.querySelectorAll('.pt-cell').forEach(cell => {
  cell.addEventListener('click', function () {
    document.querySelectorAll('.pt-cell').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
  });
});

// Smooth fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.concept-block, .activity-box, .quiz-section, .diagram-container').forEach(el => {
  observer.observe(el);
});

// Init
showPage('home');
