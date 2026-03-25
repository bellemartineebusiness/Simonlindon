/* ===================================================
   Lindon Digital – app.js
   =================================================== */

(function () {
  'use strict';

  /* ---- Navbar scroll behaviour ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile hamburger ---- */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close when link is clicked
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, observerOpts);
  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Back to top button ---- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Portfolio filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      const privacyCheck = document.getElementById('privacy-check');
      if (privacyCheck && !privacyCheck.checked) {
        alert('Du måste godkänna integritetspolicyn för att skicka formuläret.');
        return;
      }
      // Simulate send
      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }

  /* ===================================================
     COOKIE CONSENT
     =================================================== */
  const COOKIE_KEY = 'ld_cookie_consent';

  function getCookiePrefs() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
  }
  function setCookiePrefs(prefs) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
  }

  const banner      = document.querySelector('.cookie-banner');
  const modalOverlay= document.querySelector('.cookie-modal-overlay');

  function hideBanner() { if (banner) banner.classList.remove('show'); }
  function showBanner() { if (banner) banner.classList.add('show'); }
  function hideModal()  { if (modalOverlay) modalOverlay.classList.remove('show'); }
  function showModal()  { if (modalOverlay) modalOverlay.classList.add('show'); }

  function applyPrefs(prefs) {
    // In a real site you'd load/block analytics, marketing scripts here
    setCookiePrefs(prefs);
    hideBanner();
    hideModal();
  }

  // Show banner if no consent yet
  const savedPrefs = getCookiePrefs();
  if (!savedPrefs) {
    setTimeout(showBanner, 800);
  }

  // Accept all
  document.querySelector('.cookie-accept') &&
    document.querySelector('.cookie-accept').addEventListener('click', () => {
      applyPrefs({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() });
    });

  // Reject non-essential
  document.querySelector('.cookie-reject') &&
    document.querySelector('.cookie-reject').addEventListener('click', () => {
      applyPrefs({ necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString() });
    });

  // Open settings
  document.querySelector('.cookie-settings') &&
    document.querySelector('.cookie-settings').addEventListener('click', () => {
      hideBanner();
      showModal();
      // Pre-fill toggles from saved prefs
      const p = getCookiePrefs() || {};
      const analyticsToggle  = document.getElementById('toggle-analytics');
      const marketingToggle  = document.getElementById('toggle-marketing');
      if (analyticsToggle) analyticsToggle.checked = p.analytics !== false;
      if (marketingToggle) marketingToggle.checked  = p.marketing !== false;
    });

  // Save settings from modal
  document.getElementById('save-cookie-settings') &&
    document.getElementById('save-cookie-settings').addEventListener('click', () => {
      const analytics = document.getElementById('toggle-analytics')?.checked ?? true;
      const marketing = document.getElementById('toggle-marketing')?.checked ?? false;
      applyPrefs({ necessary: true, analytics, marketing, timestamp: new Date().toISOString() });
    });

  // Accept all from modal
  document.getElementById('accept-all-cookies') &&
    document.getElementById('accept-all-cookies').addEventListener('click', () => {
      applyPrefs({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() });
    });

  // Close modal by clicking overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) { hideModal(); showBanner(); }
    });
  }

  /* ---- "Ändra cookie-inställningar" link in footer ---- */
  document.querySelectorAll('.open-cookie-settings').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showModal();
    });
  });

  /* ---- Animate numbers in hero stats ---- */
  function animateCount(el, target, suffix) {
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  }

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animateCount(el, target, suffix);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats').forEach(el => statObserver.observe(el));

})();
