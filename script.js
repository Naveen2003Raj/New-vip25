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

// Add scrolled class to navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Update active nav link based on scroll position
  updateActiveLink();
});

// Mobile hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger spans
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

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger ? hamburger.querySelectorAll('span') : [];
    spans.forEach(s => s.style.transform = s.style.opacity = '');
  });
});

// Smooth scroll for anchor links
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

// Active link updater
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 120) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}


/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


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

// Trigger counters when hero stats are visible
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animate each stat number
      const statNums = document.querySelectorAll('.stat-number');
      const targets = [50, 100, 6];
      const suffixes = ['+', '%', ''];

      statNums.forEach((el, i) => {
        setTimeout(() => {
          animateCounter(el, targets[i], suffixes[i]);
        }, i * 200);
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

    // Name validation
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('err-name', name);
      valid = false;
    } else {
      hideError('err-name', name);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError('err-email', email);
      valid = false;
    } else {
      hideError('err-email', email);
    }

    // Phone validation
    if (!phone.value.trim() || phone.value.trim().length < 7) {
      showError('err-phone', phone);
      valid = false;
    } else {
      hideError('err-phone', phone);
    }

    // Service validation
    if (!service.value) {
      showError('err-service', service);
      valid = false;
    } else {
      hideError('err-service', service);
    }

    // Message validation
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('err-message', message);
      valid = false;
    } else {
      hideError('err-message', message);
    }

    if (valid) {
      // Show success
      clientForm.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    }
  });
}

// Live validation on input
['cf-name', 'cf-email', 'cf-phone', 'cf-service', 'cf-message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      const errMap = {
        'cf-name': 'err-name',
        'cf-email': 'err-email',
        'cf-phone': 'err-phone',
        'cf-service': 'err-service',
        'cf-message': 'err-message'
      };
      if (el.value.trim()) hideError(errMap[id], el);
    });
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

    if (!skills.value || skills.value.split(',').filter(Boolean).length === 0) {
      showError('ca-err-skills', null);
      valid = false;
    } else {
      hideError('ca-err-skills', null);
    }

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
    // Update hidden input
    const skillsInput = document.getElementById('ca-skills');
    if (skillsInput) {
      skillsInput.value = Array.from(selectedSkills).join(',');
    }
  });
});


/* ============================================
   HELPER FUNCTIONS
   ============================================ */
function showError(errId, input) {
  const errEl = document.getElementById(errId);
  if (errEl) {
    errEl.style.display = 'block';
  }
  if (input) {
    input.style.borderColor = '#ff5555';
    input.style.boxShadow = '0 0 12px rgba(255,85,85,0.15)';
  }
}

function hideError(errId, input) {
  const errEl = document.getElementById(errId);
  if (errEl) {
    errEl.style.display = 'none';
  }
  if (input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }
}


/* ============================================
   CURSOR TRAIL EFFECT (subtle, green dots)
   ============================================ */
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) { // Only 15% of moves, for subtle effect
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
  // Trigger initial scroll check
  updateActiveLink();

  // Ensure hero content is visible on mobile immediately
  document.querySelectorAll('.hero-badge, .hero-heading, .hero-sub, .hero-buttons, .hero-stats').forEach(el => {
    el.style.visibility = 'visible';
  });
});
