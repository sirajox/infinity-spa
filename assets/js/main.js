/**
 * INFINITY LUXURY SPA & AESTHETICS
 * Shared JavaScript — v2.0 | Production
 */

(function () {
  'use strict';

  /* ── NAV SCROLL ───────────────────────────────── */
  var navbar = document.getElementById('navbar');
  var backTop = document.getElementById('backTop');
  if (navbar) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 60);
      if (backTop) backTop.classList.toggle('visible', y > 400);
    }, { passive: true });
  }

  /* ── BACK TO TOP ──────────────────────────────── */
  if (backTop) {
    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── MOBILE MENU ──────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var mobileClose = document.getElementById('mobileClose');

  function openMobileNav() {
    if (mobileNav) mobileNav.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.toggleNav = function () {
    if (mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  };
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ── ACTIVE NAV LINK ──────────────────────────── */
  (function () {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      // Normalize
      var linkPath = href.replace(/^(\.\.\/)*/, '/').replace(/^\//, '');
      var currentPath = path.replace(/^\//, '');
      if (currentPath === '' && (linkPath === 'index.html' || linkPath === '')) {
        link.classList.add('active');
      } else if (currentPath && linkPath && currentPath.includes(linkPath.split('/').pop().replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  })();

  /* ── DROPDOWN MOBILE TOGGLE ───────────────────── */
  var hasDropdowns = document.querySelectorAll('.has-dropdown > a');
  hasDropdowns.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        // Let mobile nav handle clicks
      }
    });
  });

  /* ── SERVICE TABS ─────────────────────────────── */
  window.showTab = function (e, id) {
    document.querySelectorAll('.service-panel').forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    var panel = document.getElementById('panel-' + id);
    if (panel) {
      panel.classList.add('active');
      setTimeout(function () {
        panel.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('visible'); });
      }, 50);
    }
    var btn = (e && e.currentTarget) ? e.currentTarget : (e && e.target) ? e.target : null;
    if (btn) btn.classList.add('active');
  };

  /* ── FADE-UP OBSERVER ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Active panel on load
  document.querySelectorAll('.service-panel.active .fade-up').forEach(function (el) {
    el.classList.add('visible');
  });

  /* ── VIDEO SLIDESHOW ──────────────────────────── */
  var vidIdx = 0;
  var vidSlides = document.querySelectorAll('.vid-track .vid-slide');
  var vidDotsEl = document.getElementById('vidDots');
  var vidCounterEl = document.getElementById('vidCounter');
  var total = vidSlides.length;

  function buildDots() {
    if (!vidDotsEl || total === 0) return;
    vidDotsEl.innerHTML = '';
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var d = document.createElement('button');
        d.className = 'vid-dot' + (idx === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (idx + 1));
        d.addEventListener('click', function () { goToSlide(idx); });
        vidDotsEl.appendChild(d);
      })(i);
    }
  }
  function updateSlide() {
    vidSlides.forEach(function (s, i) { s.classList.toggle('active', i === vidIdx); });
    document.querySelectorAll('.vid-dot').forEach(function (d, i) { d.classList.toggle('active', i === vidIdx); });
    if (vidCounterEl) vidCounterEl.textContent = (vidIdx + 1) + ' / ' + total;
  }
  window.slideVid = function (dir) {
    if (total === 0) return;
    vidIdx = (vidIdx + dir + total) % total;
    updateSlide();
  };
  function goToSlide(i) {
    if (i < 0 || i >= total) return;
    vidIdx = i; updateSlide();
  }
  // Touch swipe
  (function () {
    var track = document.getElementById('vidTrack');
    if (!track) return;
    var sx = 0;
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 45) window.slideVid(dx > 0 ? 1 : -1);
    }, { passive: true });
  })();
  if (total > 0) { buildDots(); updateSlide(); }

  /* ── FAQ ACCORDION ────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function (fi) { fi.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ── STAT COUNTER ANIMATION ───────────────────── */
  function animateCounter(el) {
    var target = el.getAttribute('data-target');
    var isNum = !isNaN(parseFloat(target));
    if (!isNum) return;
    var num = parseFloat(target);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1800;
    var steps = 60;
    var stepVal = num / steps;
    var current = 0;
    var counter = 0;
    var interval = setInterval(function () {
      counter++;
      current = Math.min(current + stepVal, num);
      el.textContent = prefix + (Number.isInteger(num) ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (counter >= steps) clearInterval(interval);
    }, duration / steps);
  }

  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statObserver.observe(el); });
  }

  /* ── CONTACT FORM HANDLER ─────────────────────── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        contactForm.reset();
        setTimeout(function () { success.style.display = 'none'; }, 5000);
      }
      // Redirect to WhatsApp with form data
      var name = (document.getElementById('cfName') || {}).value || '';
      var service = (document.getElementById('cfService') || {}).value || '';
      var msg = encodeURIComponent('Hi! My name is ' + name + '. I am interested in: ' + service + '. Please get back to me.');
      window.open('https://wa.me/2348069146781?text=' + msg, '_blank');
    });
  }

  /* ── KEYBOARD NAV FOR DROPDOWNS ───────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') window.slideVid(-1);
    if (e.key === 'ArrowRight') window.slideVid(1);
  });

})();
