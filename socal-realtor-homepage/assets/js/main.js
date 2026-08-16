/* =========================================================================
   Marieth Martin — SoCal Realtor homepage
   Vanilla JS, no dependencies. Everything degrades gracefully without it:
   the full listing grid is in the HTML, links still work, the form posts nowhere.
   ========================================================================= */
(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------- */
  /* Header: solid background once scrolled past the top of the hero    */
  /* ----------------------------------------------------------------- */
  var header = $('#siteHeader');
  var nav = $('#nav');
  var navToggle = $('#navToggle');

  function onScrollHeader() {
    header.classList.toggle('is-stuck', window.scrollY > 40);
  }
  onScrollHeader();

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close the mobile menu after tapping a link.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  });

  /* ----------------------------------------------------------------- */
  /* Listing search / filter                                            */
  /* ----------------------------------------------------------------- */
  var form        = $('#searchBar');
  var grid        = $('#listingGrid');
  var cards       = $$('.card', grid);
  var resultsLine = $('#resultsLine');
  var emptyState  = $('#emptyState');
  var chipsBox    = $('#chips');

  var inputs = {
    city:  $('#f-city'),
    beds:  $('#f-beds'),
    baths: $('#f-baths'),
    min:   $('#f-min'),
    max:   $('#f-max')
  };

  function money(n) {
    return n >= 1000000
      ? '$' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M'
      : '$' + Math.round(n / 1000) + 'k';
  }

  function readFilters() {
    return {
      city:  inputs.city.value,
      beds:  parseInt(inputs.beds.value, 10) || 0,
      baths: parseInt(inputs.baths.value, 10) || 0,
      min:   parseInt(inputs.min.value, 10) || 0,
      max:   parseInt(inputs.max.value, 10) || 0
    };
  }

  function matches(card, f) {
    var price = parseInt(card.dataset.price, 10);
    if (f.city && card.dataset.city !== f.city) return false;
    if (parseInt(card.dataset.beds, 10) < f.beds) return false;
    if (parseInt(card.dataset.baths, 10) < f.baths) return false;
    if (f.min && price < f.min) return false;
    if (f.max && price > f.max) return false;
    return true;
  }

  function renderChips(f) {
    var chips = [];
    if (f.city)  chips.push({ key: 'city',  label: f.city });
    if (f.beds)  chips.push({ key: 'beds',  label: f.beds + '+ beds' });
    if (f.baths) chips.push({ key: 'baths', label: f.baths + '+ baths' });
    if (f.min)   chips.push({ key: 'min',   label: 'From ' + money(f.min) });
    if (f.max)   chips.push({ key: 'max',   label: 'Up to ' + money(f.max) });

    chipsBox.innerHTML = '';
    chips.forEach(function (c) {
      var el = document.createElement('span');
      el.className = 'chip';
      el.textContent = c.label;

      var x = document.createElement('button');
      x.type = 'button';
      x.textContent = '×';
      x.setAttribute('aria-label', 'Remove filter: ' + c.label);
      x.addEventListener('click', function () {
        inputs[c.key].selectedIndex = 0;
        applyFilters();
      });

      el.appendChild(x);
      chipsBox.appendChild(el);
    });
    chipsBox.hidden = chips.length === 0;
  }

  function applyFilters(opts) {
    var f = readFilters();
    var shown = 0;

    cards.forEach(function (card) {
      var ok = matches(card, f);
      card.hidden = !ok;
      if (ok) shown++;
    });

    var filtered = !!(f.city || f.beds || f.baths || f.min || f.max);
    resultsLine.textContent = shown === 0
      ? 'No homes match your filters'
      : 'Showing ' + shown + (filtered ? ' matching ' : ' ') + (shown === 1 ? 'home' : 'homes');

    emptyState.hidden = shown !== 0;
    renderChips(f);

    if (opts && opts.scroll) {
      $('#listings').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters({ scroll: true });
  });

  // Live-filter as soon as a dropdown changes — no need to press Search.
  Object.keys(inputs).forEach(function (k) {
    inputs[k].addEventListener('change', function () { applyFilters(); });
  });

  $('#resetFilters').addEventListener('click', function () {
    Object.keys(inputs).forEach(function (k) { inputs[k].selectedIndex = 0; });
    applyFilters({ scroll: true });
  });

  // Neighborhood tiles drive the same filter.
  $$('.hood').forEach(function (hood) {
    hood.addEventListener('click', function (e) {
      e.preventDefault();
      inputs.city.value = hood.dataset.hood;
      applyFilters({ scroll: true });
    });
  });

  /* ----------------------------------------------------------------- */
  /* Save (heart) toggles                                               */
  /* ----------------------------------------------------------------- */
  $$('.fav').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Remove from saved listings' : 'Save this listing');
    });
  });

  /* ----------------------------------------------------------------- */
  /* Testimonial carousel                                               */
  /* ----------------------------------------------------------------- */
  var carousel = $('#carousel');
  var track    = $('#carTrack');
  var viewport = $('#carViewport');
  var dotsBox  = $('#carDots');
  var slides   = $$('.quote', track);
  var index    = 0;
  var timer    = null;
  var DELAY    = 7000;

  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(dot);
  });
  var dots = $$('button', dotsBox);

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); });
    slides.forEach(function (s, i) { s.setAttribute('aria-hidden', String(i !== index)); });
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = window.setInterval(function () { go(index + 1); }, DELAY);
  }
  function stop() { window.clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  $('.car-prev', carousel).addEventListener('click', function () { go(index - 1); restart(); });
  $('.car-next', carousel).addEventListener('click', function () { go(index + 1); restart(); });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', function (e) {
    if (!carousel.contains(e.relatedTarget)) start();
  });

  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { go(index - 1); restart(); }
    if (e.key === 'ArrowRight') { go(index + 1); restart(); }
  });

  // Touch swipe.
  var startX = null;
  viewport.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    stop();
  }, { passive: true });
  viewport.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    startX = null;
    start();
  });

  go(0);
  start();

  /* ----------------------------------------------------------------- */
  /* Sticky call-to-action bar                                          */
  /* ----------------------------------------------------------------- */
  var sticky   = $('#stickyCta');
  var contact  = $('#contact');
  sticky.hidden = false;

  function onScrollSticky() {
    // Show once the hero is behind us; hide again over the contact section
    // so it never covers the form it points at.
    var past = window.scrollY > window.innerHeight * 0.75;
    var atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.85;
    var show = past && !atContact;

    sticky.classList.toggle('is-visible', show);
    document.documentElement.style.setProperty('--sticky-pad', show ? sticky.offsetHeight + 'px' : '0px');
  }

  /* ----------------------------------------------------------------- */
  /* Scroll listener (one, throttled with rAF)                          */
  /* ----------------------------------------------------------------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      onScrollSticky();
      ticking = false;
    });
  }, { passive: true });
  onScrollSticky();

  /* ----------------------------------------------------------------- */
  /* Reveal-on-scroll + stat count-up                                   */
  /* ----------------------------------------------------------------- */
  var revealTargets = $$('.section-head, .card, .hood, .hood-copy, .quote, .contact-form, .stat');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target) || reduceMotion) return;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 900, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) window.requestAnimationFrame(step);
    }
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        var counter = entry.target.querySelector('[data-count]');
        if (counter) countUp(counter);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ----------------------------------------------------------------- */
  /* Contact form — client-side validation only                         */
  /* No backend is wired up; point `action` at your CRM or form service. */
  /* ----------------------------------------------------------------- */
  var contactForm = $('#contactForm');
  var success     = $('#formSuccess');

  var RULES = {
    'c-name':  { test: function (v) { return v.trim().length >= 2; },              msg: 'Please enter your name.' },
    'c-phone': { test: function (v) { return v.replace(/\D/g, '').length >= 10; }, msg: 'Please enter a 10-digit phone number.' },
    'c-email': { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, msg: 'Please enter a valid email address.' }
  };

  function validateField(id) {
    var input = document.getElementById(id);
    var ok = RULES[id].test(input.value);
    input.closest('.form-field').classList.toggle('is-invalid', !ok);
    $('.err[data-for="' + id + '"]').textContent = ok ? '' : RULES[id].msg;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  Object.keys(RULES).forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener('blur', function () { validateField(id); });
    input.addEventListener('input', function () {
      if (input.closest('.form-field').classList.contains('is-invalid')) validateField(id);
    });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(RULES).forEach(function (id) {
      if (!validateField(id) && !firstBad) firstBad = document.getElementById(id);
    });
    if (firstBad) { firstBad.focus(); return; }

    var name = $('#c-name').value.trim().split(' ')[0];
    success.hidden = false;
    success.textContent = 'Thanks, ' + name + ' — your request is in. I\'ll reach out within one business day.';
    contactForm.reset();
  });
})();
