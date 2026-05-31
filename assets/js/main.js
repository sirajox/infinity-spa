/* Infinity Luxury Spa - Original JavaScript */
(function() {
  'use strict';

(function() {
  'use strict';

  // ── NAV SCROLL ──────────────────────────────────────────────
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      var bt = document.getElementById('backTop');
      if (bt) bt.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // ── MOBILE MENU ─────────────────────────────────────────────
  window.toggleNav = function() {
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
  };

  // ── SERVICE TABS ─────────────────────────────────────────────
  // Accepts (event, id) — fixes "event is not defined"
  window.showTab = function(e, id) {
    // Hide all panels
    document.querySelectorAll('.service-panel').forEach(function(p) {
      p.classList.remove('active');
    });
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    // Show selected panel
    var panel = document.getElementById('panel-' + id);
    if (panel) {
      panel.classList.add('active');
      // Trigger fade-up on newly visible cards
      setTimeout(function() {
        panel.querySelectorAll('.fade-up').forEach(function(el) {
          el.classList.add('visible');
        });
      }, 50);
    }
    // Activate the clicked button
    var btn = e && e.currentTarget ? e.currentTarget : e && e.target ? e.target : null;
    if (btn) btn.classList.add('active');
  };

  // ── FADE-UP INTERSECTION OBSERVER ───────────────────────────
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-up');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function(el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.fade-up').forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // Trigger on active panel cards at load
  document.querySelectorAll('.service-panel.active .fade-up').forEach(function(el) {
    el.classList.add('visible');
  });

  // ── VIDEO SLIDESHOW ─────────────────────────────────────────
  var vidIdx = 0;
  var vidSlides = document.querySelectorAll('.vid-track .vid-slide');
  var vidDotsEl = document.getElementById('vidDots');
  var vidCounterEl = document.getElementById('vidCounter');
  var total = vidSlides.length;

  function buildDots() {
    if (!vidDotsEl || total === 0) return;
    vidDotsEl.innerHTML = '';
    for (var i = 0; i < total; i++) {
      (function(idx) {
        var d = document.createElement('button');
        d.className = 'vid-dot' + (idx === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (idx + 1));
        d.addEventListener('click', function() { goToSlide(idx); });
        vidDotsEl.appendChild(d);
      })(i);
    }
  }

  function updateSlide() {
    vidSlides.forEach(function(s, i) {
      s.classList.toggle('active', i === vidIdx);
    });
    document.querySelectorAll('.vid-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === vidIdx);
    });
    if (vidCounterEl) vidCounterEl.textContent = (vidIdx + 1) + ' / ' + total;
  }

  window.slideVid = function(dir) {
    if (total === 0) return;
    vidIdx = (vidIdx + dir + total) % total;
    updateSlide();
  };

  function goToSlide(i) {
    if (i < 0 || i >= total) return;
    vidIdx = i;
    updateSlide();
  }

  // Keyboard arrow navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') window.slideVid(-1);
    if (e.key === 'ArrowRight') window.slideVid(1);
  });

  // Touch swipe support
  (function() {
    var track = document.getElementById('vidTrack');
    if (!track) return;
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, {passive: true});
    track.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) window.slideVid(diff > 0 ? 1 : -1);
    }, {passive: true});
  })();

  if (total > 0) {
    buildDots();
    updateSlide();
  }

})();

// Mobile nav open/close patch
window.toggleNav = function() {
  var nav = document.getElementById('mobileNav');
  if (!nav) return;
  var isOpen = nav.style.display === 'flex';
  nav.style.display = isOpen ? 'none' : 'flex';
  document.body.style.overflow = isOpen ? '' : 'hidden';
};
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var nav = document.getElementById('mobileNav');
    if (nav) { nav.style.display = 'none'; document.body.style.overflow = ''; }
  }
});
