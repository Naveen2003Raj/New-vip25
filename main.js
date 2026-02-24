/**
 * VIP25 — Main JavaScript
 * Handles: Navbar, Mobile Menu, Scroll Reveals, Form Validation, Skill Tags
 */

/* ============================================
   NAVBAR: Scroll effect + Active link tracking
   ============================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger ? hamburger.querySelectorAll('span') : [];
    spans.forEach(s => s.style.transform = s.style.opacity = '');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 120) current = section.getAttribute('id');
  });
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}


/* ============================================
   PREMIUM SCROLL REVEAL SYSTEM
   ============================================
   Supported animation types (via data-animate attribute):
     - fade-up      : fades in while translating upward
     - fade-left    : fades in while sliding from the left
     - fade-right   : fades in while sliding from the right
     - zoom-in      : fades in while scaling up from slightly smaller

   Additional options (via data attributes):
     - data-delay   : stagger delay in ms (e.g. data-delay="200")
     - data-duration: animation duration override in ms (e.g. data-duration="900")

   IMPORTANT: Animations reset when elements leave the viewport
   so they replay every time the user scrolls back to them.
   ============================================ */

const ANIMATION_DEFAULTS = {
  duration: 700,      // ms — base transition duration
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // smooth deceleration curve
};

/**
 * Apply the "hidden" (pre-animation) state to an element
 * based on its data-animate type.
 */
function setHiddenState(el) {
  const type = el.dataset.animate;

  // Shared base styles
  el.style.transition = 'none'; // prevent flash on reset
  el.style.opacity = '0';
  el.style.willChange = 'transform, opacity'; // GPU hint

  switch (type) {
    case 'fade-up':
      el.style.transform = 'translateY(40px)';
      break;
    case 'fade-left':
      el.style.transform = 'translateX(-50px)';
      break;
    case 'fade-right':
      el.style.transform = 'translateX(50px)';
      break;
    case 'zoom-in':
      el.style.transform = 'scale(0.92)';
      el.style.filter = 'blur(4px)';
      break;
    default:
      el.style.transform = 'translateY(30px)';
  }
}

/**
 * Apply the "visible" (post-animation) state to an element,
 * triggering the CSS transition.
 */
function setVisibleState(el) {
  const type = el.dataset.animate;
  const delay = parseInt(el.dataset.delay || 0, 10);
  const duration = parseInt(el.dataset.duration || ANIMATION_DEFAULTS.duration, 10);

  // Determine which properties to transition
  const transitionProps = type === 'zoom-in'
    ? 'opacity, transform, filter'
    : 'opacity, transform';

  // A tiny rAF delay ensures the browser has painted the hidden state
  // before we flip to visible — preventing the "no animation" flash.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = `${transitionProps} ${duration}ms ${ANIMATION_DEFAULTS.easing} ${delay}ms`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) translateX(0) scale(1)';
      el.style.filter = 'blur(0)';
    });
  });
}

/**
 * Main IntersectionObserver for scroll-triggered animations.
 *
 * rootMargin: negative bottom margin means the animation fires
 * slightly before the element fully enters — feels more responsive.
 *
 * threshold: 0.1 means trigger when 10% of the element is visible.
 */
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element has entered the viewport → play animation
      setVisibleState(entry.target);
    } else {
      // Element has left the viewport → reset to hidden state
      // This enables re-animation on every scroll-in
      setHiddenState(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

/**
 * Initialize all animated elements on the page.
 * Targets: any element with a [data-animate] attribute.
 * Also supports legacy .reveal, .reveal-left, .reveal-right classes
 * by mapping them to data-animate equivalents.
 */
function initScrollReveal() {
  // Support legacy class-based reveals by mapping to data attributes
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.dataset.animate) el.dataset.animate = 'fade-up';
  });
  document.querySelectorAll('.reveal-left').forEach(el => {
    if (!el.dataset.animate) el.dataset.animate = 'fade-left';
  });
  document.querySelectorAll('.reveal-right').forEach(el => {
    if (!el.dataset.animate) el.dataset.animate = 'fade-right';
  });

  // Observe all elements with a data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    setHiddenState(el); // Set initial hidden state immediately
    scrollRevealObserver.observe(el);
  });
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', initScrollReveal);


/* ============================================
   STAGGERED CHILDREN ANIMATION HELPER
   ============================================
   For containers with multiple children (e.g. card grids),
   add data-animate-children="fade-up" to the parent and
   each child will be auto-staggered.

   Optional: data-stagger="150" to control ms between children (default 100ms)
   ============================================ */
function initStaggeredChildren() {
  document.querySelectorAll('[data-animate-children]').forEach(parent => {
    const type = parent.dataset.animateChildren;
    const stagger = parseInt(parent.dataset.stagger || 100, 10);

    Array.from(parent.children).forEach((child, i) => {
      child.dataset.animate = type;
      child.dataset.delay = i * stagger;
      setHiddenState(child);
      scrollRevealObserver.observe(child);
    });
  });
}

document.addEventListener('DOMContentLoaded', initStaggeredChildren);


/* ============================================
   ANIMATED COUNTER for hero stats
   ============================================ */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const statNums = document.querySelectorAll('.stat-number');
      const targets = [50, 100, 6];
      const suffixes = ['+', '%', ''];
      statNums.forEach((el, i) => {
        setTimeout(() => animateCounter(el, targets[i], suffixes[i]), i * 200);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}


/* ============================================
   CLIENT SERVICE FORM VALIDATION
   ============================================ */
const clientForm = document.getElementById('clientForm');
if (clientForm) {
  clientForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('cf-name');
    const email = document.getElementById('cf-email');
    const phone = document.getElementById('cf-phone');
    const service = document.getElementById('cf-service');
    const message = document.getElementById('cf-message');

    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim() || name.value.trim().length < 2) { showError('err-name', name); valid = false; }
    else { hideError('err-name', name); }

    if (!email.value.trim() || !emailRegex.test(email.value.trim())) { showError('err-email', email); valid = false; }
    else { hideError('err-email', email); }

    if (!phone.value.trim() || phone.value.trim().length < 7) { showError('err-phone', phone); valid = false; }
    else { hideError('err-phone', phone); }

    if (!service.value) { showError('err-service', service); valid = false; }
    else { hideError('err-service', service); }

    if (!message.value.trim() || message.value.trim().length < 10) { showError('err-message', message); valid = false; }
    else { hideError('err-message', message); }

    if (valid) {
      clientForm.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    }
  });
}

['cf-name', 'cf-email', 'cf-phone', 'cf-service', 'cf-message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    const errMap = { 'cf-name': 'err-name', 'cf-email': 'err-email', 'cf-phone': 'err-phone', 'cf-service': 'err-service', 'cf-message': 'err-message' };
    el.addEventListener('input', () => { if (el.value.trim()) hideError(errMap[id], el); });
  }
});


/* ============================================
   CAREER FORM VALIDATION
   ============================================ */
const careerForm = document.getElementById('careerForm');
if (careerForm) {
  careerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('ca-name');
    const email = document.getElementById('ca-email');
    const phone = document.getElementById('ca-phone');
    const exp = document.getElementById('ca-experience');
    const skills = document.getElementById('ca-skills');
    const portfolio = document.getElementById('ca-portfolio');
    const message = document.getElementById('ca-message');
    const avail = document.getElementById('ca-availability');

    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim() || name.value.trim().length < 2) { showError('ca-err-name', name); valid = false; }
    else { hideError('ca-err-name', name); }

    if (!email.value.trim() || !emailRegex.test(email.value.trim())) { showError('ca-err-email', email); valid = false; }
    else { hideError('ca-err-email', email); }

    if (!phone.value.trim() || phone.value.trim().length < 7) { showError('ca-err-phone', phone); valid = false; }
    else { hideError('ca-err-phone', phone); }

    if (!exp.value) { showError('ca-err-exp', exp); valid = false; }
    else { hideError('ca-err-exp', exp); }

    if (!skills.value || skills.value.split(',').filter(Boolean).length === 0) { showError('ca-err-skills', null); valid = false; }
    else { hideError('ca-err-skills', null); }

    if (!portfolio.value.trim()) { showError('ca-err-portfolio', portfolio); valid = false; }
    else { hideError('ca-err-portfolio', portfolio); }

    if (!message.value.trim() || message.value.trim().length < 20) { showError('ca-err-message', message); valid = false; }
    else { hideError('ca-err-message', message); }

    if (!avail.value) { showError('ca-err-avail', avail); valid = false; }
    else { hideError('ca-err-avail', avail); }

    if (valid) {
      careerForm.style.display = 'none';
      document.getElementById('careerFormSuccess').style.display = 'block';
    }
  });
}


/* ============================================
   SKILL TAGS (Career Form)
   ============================================ */
const skillTags = document.querySelectorAll('#skillTags .skill-tag');
const selectedSkills = new Set();

skillTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const val = tag.dataset.val;
    if (selectedSkills.has(val)) {
      selectedSkills.delete(val);
      tag.classList.remove('active');
    } else {
      selectedSkills.add(val);
      tag.classList.add('active');
    }
    const skillsInput = document.getElementById('ca-skills');
    if (skillsInput) skillsInput.value = Array.from(selectedSkills).join(',');
  });
});


/* ============================================
   HELPER FUNCTIONS
   ============================================ */
function showError(errId, input) {
  const errEl = document.getElementById(errId);
  if (errEl) errEl.style.display = 'block';
  if (input) {
    input.style.borderColor = '#ff5555';
    input.style.boxShadow = '0 0 12px rgba(255,85,85,0.15)';
  }
}

function hideError(errId, input) {
  const errEl = document.getElementById(errId);
  if (errEl) errEl.style.display = 'none';
  if (input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }
}


/* ============================================
   CURSOR TRAIL EFFECT (subtle, green dots)
   ============================================ */
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: #4CAF50;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0.6;
      transition: opacity 0.8s, transform 0.8s;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(3)';
    });
    setTimeout(() => dot.remove(), 800);
  }
});


/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();

  // Ensure hero content is immediately visible (hero is above fold, no reveal needed)
  document.querySelectorAll('.hero-badge, .hero-heading, .hero-sub, .hero-buttons, .hero-stats').forEach(el => {
    el.style.visibility = 'visible';
  });
});