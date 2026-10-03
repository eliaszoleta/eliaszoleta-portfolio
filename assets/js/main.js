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
   * 'load', but slow-loading images can settle asynchronously right
   * around that same moment, changing page height afterward -- which can
   * leave everything below permanently stuck at opacity:0. Re-running
   * AOS's calculations once things have visually settled fixes it.
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
   * Portfolio: fixed-frame sliding gallery, one item at a time, auto-
   * advancing per category -- instead of a scrolling grid of
   * differently-sized cards. Category tabs swap which subset of
   * PORTFOLIO_ITEMS the gallery cycles through.
   */
  (function portfolioGallery() {
    const root = document.getElementById('portfolioGallery');
    if (!root || !window.PORTFOLIO_ITEMS) return;

    const CATEGORY_LABEL = {};
    (window.PORTFOLIO_CATEGORIES || []).forEach((c) => { CATEGORY_LABEL[c.key] = c.label; });

    const filtersEl = document.getElementById('portfolioFilters');
    const stageEl = document.getElementById('galleryStage');
    const frameEl = document.getElementById('galleryFrame');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const counterEl = document.getElementById('galleryCounter');
    const thumbsEl = document.getElementById('galleryThumbs');
    const dotsEl = document.getElementById('galleryDots');
    const categoryEl = document.getElementById('galleryCategory');
    const titleEl = document.getElementById('galleryTitle');
    const descEl = document.getElementById('galleryDesc');
    const ctaEl = document.getElementById('galleryCta');

    let category = 'all';
    let index = 0;
    let timer = null;
    let paused = false;

    const AUTO_ADVANCE_MS = 4500;

    function filteredItems() {
      return category === 'all'
        ? window.PORTFOLIO_ITEMS
        : window.PORTFOLIO_ITEMS.filter((it) => it.category === category);
    }

    function renderFrame(item) {
      frameEl.innerHTML = '';

      const backdrop = document.createElement('img');
      backdrop.className = 'gallery-backdrop';
      backdrop.alt = '';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.src = item.type === 'video' ? item.poster : item.src;
      frameEl.appendChild(backdrop);

      let media;
      if (item.type === 'video') {
        media = document.createElement('video');
        media.className = 'gallery-media';
        media.src = item.src;
        media.poster = item.poster;
        media.autoplay = true;
        media.loop = true;
        media.muted = true;
        media.playsInline = true;
      } else {
        media = document.createElement('img');
        media.className = 'gallery-media';
        media.src = item.src;
        media.alt = item.title;
      }
      frameEl.appendChild(media);

      const zoomBtn = document.createElement('button');
      zoomBtn.type = 'button';
      zoomBtn.className = 'gallery-zoom';
      zoomBtn.setAttribute('aria-label', 'View full size');
      zoomBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
      zoomBtn.addEventListener('click', () => {
        if (window.GLightbox) {
          GLightbox({
            elements: [{ href: item.src, type: item.type, title: item.title }]
          }).open();
        }
      });
      frameEl.appendChild(zoomBtn);
    }

    function renderCaption(item, list) {
      categoryEl.textContent = CATEGORY_LABEL[item.category] || item.category;
      titleEl.textContent = item.title;
      descEl.textContent = item.description;
      if (item.liveUrl) {
        ctaEl.href = item.liveUrl;
        ctaEl.style.visibility = 'visible';
      } else {
        ctaEl.removeAttribute('href');
        ctaEl.style.visibility = 'hidden';
      }
      counterEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    }

    function renderThumbsAndDots(list) {
      thumbsEl.innerHTML = '';
      dotsEl.innerHTML = '';
      list.forEach((item, i) => {
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'gallery-thumb' + (i === index ? ' active' : '');
        thumb.setAttribute('aria-label', 'Jump to ' + item.title);
        const img = document.createElement('img');
        img.src = item.type === 'video' ? item.poster : item.src;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
        thumb.addEventListener('click', () => goTo(i, true));
        thumbsEl.appendChild(thumb);

        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-dot' + (i === index ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i, true));
        dotsEl.appendChild(dot);
      });
    }

    function updateActiveThumbDot() {
      thumbsEl.querySelectorAll('.gallery-thumb').forEach((el, i) => el.classList.toggle('active', i === index));
      dotsEl.querySelectorAll('.gallery-dot').forEach((el, i) => el.classList.toggle('active', i === index));
      const activeThumb = thumbsEl.children[index];
      if (activeThumb && thumbsEl.scrollWidth > thumbsEl.clientWidth) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    function render(rebuildThumbs) {
      const list = filteredItems();
      if (!list.length) return;
      if (index >= list.length) index = 0;
      const item = list[index];
      renderFrame(item);
      renderCaption(item, list);
      if (rebuildThumbs) {
        renderThumbsAndDots(list);
      } else {
        updateActiveThumbDot();
      }
    }

    function restartTimer() {
      if (timer) clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(() => {
        index = (index + 1) % filteredItems().length;
        render(false);
        restartTimer();
      }, AUTO_ADVANCE_MS);
    }

    function goTo(i, manual) {
      const list = filteredItems();
      index = ((i % list.length) + list.length) % list.length;
      render(false);
      if (manual) restartTimer();
    }

    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    if (stageEl) {
      stageEl.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        paused = true;
        if (timer) clearTimeout(timer);
      });
      stageEl.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        paused = false;
        restartTimer();
      });
    }

    if (filtersEl) {
      filtersEl.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', function () {
          filtersEl.querySelector('.filter-active')?.classList.remove('filter-active');
          this.classList.add('filter-active');
          category = this.getAttribute('data-filter');
          index = 0;
          render(true);
          restartTimer();
        });
      });
    }

    render(true);
    restartTimer();
  })();

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
