(function () {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /**
   * Header: scrolled state + mobile menu toggle
   */
  const header = document.querySelector('#header');
  const headerToggleBtn = document.querySelector('.header-toggle');

  function toggleHeaderScrolled() {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
  window.addEventListener('load', toggleHeaderScrolled);
  document.addEventListener('scroll', toggleHeaderScrolled);

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', () => {
      header.classList.toggle('menu-open');
    });
  }

  document.querySelectorAll('#navmenu a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
    });
  });

  /**
   * Scroll-top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 300 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * AOS init. AOS computes each element's scroll-trigger offset on window
   * 'load', but the Portfolio section's Isotope masonry layout (and any
   * slow-loading images) settle asynchronously right around that same
   * moment, changing page height afterward -- which can leave everything
   * below Portfolio permanently stuck at opacity:0. Re-running AOS's
   * calculations once things have visually settled fixes it.
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (window.AOS) AOS.refreshHard();
    }, 700);
  });

  /**
   * Typed.js rotating role text
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typedStrings = selectTyped.getAttribute('data-typed-items').split(',');
    new Typed('.typed', {
      strings: typedStrings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * GLightbox + "Visit Live Site" button injected into the open lightbox
   * for slides whose trigger has a data-live-url, so visitors don't have
   * to close the screenshot preview first to reach the live link.
   */
  const glightbox = GLightbox({ selector: '.glightbox' });

  function updateVisitButton(trigger) {
    const btn = document.querySelector('.gvisit');
    if (!btn) return;
    const url = trigger && trigger.getAttribute ? trigger.getAttribute('data-live-url') : null;
    if (url) {
      btn.href = url;
      btn.style.display = 'flex';
    } else {
      btn.removeAttribute('href');
      btn.style.display = 'none';
    }
  }
  glightbox.on('open', function () {
    const container = document.querySelector('.gcontainer');
    if (container && !container.querySelector('.gvisit')) {
      const btn = document.createElement('a');
      btn.className = 'gbtn gvisit';
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.setAttribute('aria-label', 'Visit Live Site');
      btn.innerHTML = '<i class="bi bi-box-arrow-up-right"></i>';
      container.appendChild(btn);
    }
  });
  glightbox.on('slide_changed', function (data) {
    updateVisitButton(data.current && data.current.trigger);
  });

  /**
   * Isotope portfolio filtering
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filterEl) {
      filterEl.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({ filter: this.getAttribute('data-filter') });
        if (typeof aosInit === 'function') aosInit();
      }, false);
    });
  });

  /**
   * Smooth-scroll correction for URLs containing hash links on load
   */
  window.addEventListener('load', function () {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setTimeout(() => {
        let section = document.querySelector(window.location.hash);
        window.scrollTo({ top: section.offsetTop - 76, behavior: 'smooth' });
      }, 100);
    }
  });

  /**
   * Navmenu scrollspy
   */
  let navLinks = document.querySelectorAll('#navmenu a[href^="#"]');

  function navScrollspy() {
    navLinks.forEach((link) => {
      let section = document.querySelector(link.getAttribute('href'));
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('load', navScrollspy);
  document.addEventListener('scroll', navScrollspy);

  /**
   * Web3Forms contact form submission
   */
  const form = document.getElementById('web3formsContactForm');
  if (form) {
    const loadingEl = form.querySelector('.loading');
    const errorEl = form.querySelector('.error-message');
    const sentEl = form.querySelector('.sent-message');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (form.botcheck && form.botcheck.checked) return;
      loadingEl.style.display = 'block';
      errorEl.style.display = 'none';
      sentEl.style.display = 'none';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: '7c3c7b35-20ba-422e-bd9c-e40ecf3fac34',
            subject: 'New message from your portfolio site',
            from_name: 'Portfolio Contact Form',
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
          })
        });
        const json = await res.json();
        loadingEl.style.display = 'none';
        if (json.success) {
          sentEl.style.display = 'block';
          form.reset();
        } else {
          errorEl.textContent = json.message || 'Something went wrong. Please try again.';
          errorEl.style.display = 'block';
        }
      } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.style.display = 'block';
      }
    });
  }

})();
