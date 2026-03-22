/* ═══════════════════════════════════════════════════════
   KAILAS PORTFOLIO — PORTFOLIO.JS
   Contact form, UI interactions for portfolio page
═══════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────
// 0. JS ACTIVE FLAG — must run first
// ──────────────────────────────────────────────────────
document.body.classList.add('js-active');

// ──────────────────────────────────────────────────────
// SAFETY FALLBACK — reveal ALL hidden elements after 3s
// ──────────────────────────────────────────────────────
setTimeout(function revealFallback() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
    el.classList.add('revealed');
  });
}, 3000);


// ──────────────────────────────────────────────────────
// CONFIG — Update API URL after Vercel deployment
// ──────────────────────────────────────────────────────
const API_BASE = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  // Production — Render backend API 
  return 'https://kailas-first.onrender.com';
})();

// ──────────────────────────────────────────────────────
// 1. FLOATING NOTES (DOM)
// ──────────────────────────────────────────────────────
(function initMusicNotes() {
  const container = document.getElementById('musicNotesBg');
  if (!container) return;
  const symbols = ['♩', '♪', '♫', '♬', '𝄞', '🎵', '🎶', '♯', '♭'];
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const note = document.createElement('div');
    note.className = 'music-note';
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.left = Math.random() * 100 + 'vw';
    note.style.fontSize = (Math.random() * 1.4 + 0.7) + 'rem';
    note.style.animationDuration = (Math.random() * 14 + 10) + 's';
    note.style.animationDelay = (Math.random() * 10) + 's';
    note.style.opacity = (Math.random() * 0.12 + 0.04).toString();
    container.appendChild(note);
  }
})();

// ──────────────────────────────────────────────────────
// 2. CUSTOM CURSOR
// ──────────────────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;
  let mouseX = 0, mouseY = 0, outX = 0, outY = 0;
  let hasMoved = false;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!hasMoved) {
      outX = mouseX; outY = mouseY;
      dot.style.opacity = 1;
      outline.style.opacity = 1;
      hasMoved = true;
    }
    dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
  });
  (function animateOutline() {
    if (hasMoved) {
      outX += (mouseX - outX) * 0.16;
      outY += (mouseY - outY) * 0.16;
      outline.style.transform = `translate3d(${outX - 18}px, ${outY - 18}px, 0)`;
    }
    requestAnimationFrame(animateOutline);
  })();
  document.querySelectorAll('a, button, .achievement-card, .cert-item, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hover-active'));
  });
})();

// ──────────────────────────────────────────────────────
// 3. NAVBAR SCROLL + HAMBURGER
// ──────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
})();

// ──────────────────────────────────────────────────────
// 4. SCROLL REVEAL
// ──────────────────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.style.getPropertyValue('--delay') || '0');
      setTimeout(() => el.classList.add('revealed'), delay * 1000);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────────────
// 5. COUNTER ANIMATION
// ──────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stats-num');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      let curr = 0;
      const step = target / 55;
      const timer = setInterval(() => {
        curr += step;
        if (curr >= target) { curr = target; clearInterval(timer); }
        el.textContent = Math.floor(curr);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ──────────────────────────────────────────────────────
// 6. ACHIEVEMENT FILTER
// ──────────────────────────────────────────────────────
(function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.achievement-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ──────────────────────────────────────────────────────
// 7. CONTACT FORM
// ──────────────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successDiv = document.getElementById('formSuccess');
  const errorDiv = document.getElementById('formError');
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (!form) return;

  // Helpers
  function showError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (!input || !err) return;
    if (show) {
      input.classList.add('invalid');
      input.classList.remove('valid');
      err.classList.add('show');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
      err.classList.remove('show');
    }
  }

  function validateField(input) {
    const id = input.id;
    const val = input.value.trim();
    switch (id) {
      case 'contactName':
        showError('contactName', 'nameError', val.length < 1);
        return val.length >= 1;
      case 'contactAge': {
        const age = parseInt(val, 10);
        const valid = !isNaN(age) && age >= 1 && age <= 120;
        showError('contactAge', 'ageError', !valid);
        return valid;
      }
      case 'contactGmail': {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRe.test(val);
        showError('contactGmail', 'gmailError', !valid);
        return valid;
      }
      case 'contactSubject':
        showError('contactSubject', 'subjectError', val.length < 1);
        return val.length >= 1;
      case 'contactMessage':
        showError('contactMessage', 'messageError', val.length < 1 || val.length > 2000);
        return val.length >= 1 && val.length <= 2000;
      default:
        return true;
    }
  }

  // Live validation
  ['contactName', 'contactAge', 'contactGmail', 'contactSubject', 'contactMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) validateField(el);
      });
    }
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous alerts
    successDiv.classList.remove('show');
    errorDiv.classList.remove('show');

    // Validate all fields
    const fields = ['contactName', 'contactAge', 'contactGmail', 'contactSubject', 'contactMessage'];
    let allValid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && !validateField(el)) allValid = false;
    });

    if (!allValid) {
      errorMsg.textContent = 'Please fill all required fields correctly.';
      errorDiv.classList.add('show');
      // Scroll to first error
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Show loading
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

    const payload = {
      name: document.getElementById('contactName').value.trim(),
      age: parseInt(document.getElementById('contactAge').value.trim(), 10),
      gmail: document.getElementById('contactGmail').value.trim(),
      subject: document.getElementById('contactSubject').value.trim(),
      message: document.getElementById('contactMessage').value.trim(),
    };

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successMsg.textContent = data.message || 'Thank you! Kailas will get back to you soon. 🎵';
        successDiv.classList.add('show');
        form.reset();
        // Remove valid states
        fields.forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.classList.remove('valid', 'invalid'); }
        });
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Server error. Please try again.');
      }
    } catch (err) {
      let msg = err.message;
      if (err instanceof TypeError) {
        // Network / CORS — likely no backend yet in dev
        msg = 'Could not connect to the server. If you\'re running locally, please start the backend.';
      }
      errorMsg.textContent = msg;
      errorDiv.classList.add('show');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('span').textContent = 'Send Message';
      submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
    }
  });
})();

// ──────────────────────────────────────────────────────
// 8. SMOOTH SCROLL
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
