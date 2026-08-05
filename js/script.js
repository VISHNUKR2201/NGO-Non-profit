/* -------------------------------------------------------------
 * STACKLY Premium Nonprofit Theme JS
 * GSAP Animations, 3D Tilt, Counter Stats, Spotlight Nav,
 * and Infinite Auto-Scrolling Carousel
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded.');
    return;
  }

  // Initialize Lenis Smooth Scrolling
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const preloader = document.getElementById('preloader');
  const hasPreloader = preloader !== null;

  if (hasPreloader) {
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  const mainTimeline = gsap.timeline({
    paused: hasPreloader,
    defaults: { ease: 'power4.out', duration: 1.2 }
  });

  initNavSpotlight();
  runEntranceAnimations(mainTimeline);
  runStatsCountUp(mainTimeline);

  if (hasPreloader) {
    runPreloader(preloader, mainTimeline, lenis);
  }

  initThreeDTilt();
  initInfiniteMarquee();
  initStickyHeader();
  initWhatWeDoAnimations();
  initOurStoryAnimations();
  initAboutStackAnimations();
  initResultsAnimations();
  initCausesAnimations();
  initActionAnimations();
  initVoicesImpactAnimations();
  initVideoCTAAnimations();
  initMobileMenu();
  initBlogAnimations();
  initFooterAnimations();
  initTouchGrayscale();
});

/* ─────────────────────────────────────────────────────────────
   1. Navigation Spotlight Effect
───────────────────────────────────────────────────────────── */
function initNavSpotlight() {
  const navMenu  = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const spotlight = document.querySelector('.nav-spotlight');
  if (!navMenu || !spotlight) return;

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', e => {
      const linkRect = e.target.getBoundingClientRect();
      const menuRect = navMenu.getBoundingClientRect();
      spotlight.style.width   = `${linkRect.width}px`;
      spotlight.style.left    = `${linkRect.left - menuRect.left}px`;
      spotlight.style.opacity = '1';
    });
  });
  navMenu.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; });
}

/* ─────────────────────────────────────────────────────────────
   2. Entrance Animation Sequence
───────────────────────────────────────────────────────────── */
function runEntranceAnimations(timeline) {
  timeline.from('header.site-header', { y: -30, opacity: 0, duration: 1.0, ease: 'power3.out' });
  timeline.from('.hero-heading span',  { yPercent: 100, stagger: 0.12, duration: 1.2, ease: 'power4.out' }, '-=0.6');
  timeline.from('.hero-description',   { y: 24, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.9');
  timeline.from('.hero-actions .btn-primary, .hero-actions .btn-outline', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.8');
  
  const isMobile = window.innerWidth < 1024;
  timeline.from('.hero-image-box',     { 
    x: isMobile ? 0 : 150, 
    y: isMobile ? 60 : 0, 
    scale: 0.92, 
    rotate: isMobile ? 0 : 2, 
    opacity: 0, 
    duration: 1.6, 
    ease: 'power4.out' 
  }, '-=1.2');
  
  timeline.from('.backdrop-circle',    { 
    scale: 0.2, 
    x: isMobile ? 0 : -60, 
    y: isMobile ? 0 : -60, 
    opacity: 0, 
    duration: 1.4, 
    ease: 'back.out(1.6)' 
  }, '-=1.4');
  
  timeline.from('.floating-glass-card',{ 
    x: isMobile ? 0 : 80, 
    y: isMobile ? 30 : 0, 
    scale: 0.85, 
    opacity: 0, 
    duration: 1.4, 
    ease: 'power3.out' 
  }, '-=1.1');
}

/* ─────────────────────────────────────────────────────────────
   3. Stats Count-Up Animation
───────────────────────────────────────────────────────────── */
function runStatsCountUp(timeline) {
  const stats = [
    { selector: '#stat-lives',     endValue: 128, suffix: 'k' },
    { selector: '#stat-countries', endValue: 37,  suffix: ''  },
    { selector: '#stat-programs',  prefix: '$', endValue: 14, suffix: 'M' }
  ];

  timeline.from('.stats-grid', { borderColor: 'rgba(18,42,38,0)', duration: 1.0 }, '-=0.8');
  timeline.from('.stat-item',  { y: 15, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.8');

  stats.forEach(stat => {
    const el = document.querySelector(stat.selector);
    if (!el) return;
    const obj = { value: 0 };
    timeline.to(obj, {
      value: stat.endValue, duration: 2.0, ease: 'power3.out',
      onUpdate: () => { el.textContent = `${stat.prefix || ''}${Math.floor(obj.value)}${stat.suffix || ''}`; }
    }, '-=0.8');
  });
}

/* ─────────────────────────────────────────────────────────────
   4. 3D Mouse Parallax & Tilt (Hero)
───────────────────────────────────────────────────────────── */
function initThreeDTilt() {
  const mediaContainer  = document.querySelector('.hero-media-wrapper');
  const imageBox        = document.querySelector('.hero-image-box');
  const backdropCircle  = document.querySelector('.backdrop-circle');
  const floatingCard    = document.querySelector('.floating-glass-card');
  if (!mediaContainer || !imageBox) return;

  // Disable 3D mouse tilt interaction on mobile/tablet viewports to prevent touch alignment bugs
  if (window.innerWidth < 1024) return;

  mediaContainer.addEventListener('mousemove', e => {
    const rect   = mediaContainer.getBoundingClientRect();
    const normX  = (e.clientX - rect.left) / rect.width  - 0.5;
    const normY  = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotateX = -normY * 10;
    const rotateY =  normX * 12;

    gsap.to(imageBox, { rotateX, rotateY, x: normX * 15, y: normY * 15, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    if (backdropCircle) gsap.to(backdropCircle, { x: -normX * 25 - 20, y: -normY * 25 - 20, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    if (floatingCard)   gsap.to(floatingCard,   { rotateX: rotateX * 0.8, rotateY: rotateY * 0.8, x: normX * 35, y: normY * 35, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  });

  mediaContainer.addEventListener('mouseleave', () => {
    gsap.to([imageBox, floatingCard], { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
    if (backdropCircle) gsap.to(backdropCircle, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
  });
}

/* ─────────────────────────────────────────────────────────────
   5. Infinite Marquee Loop
───────────────────────────────────────────────────────────── */
function initInfiniteMarquee() {
  const container = document.querySelector('.marquee-container');
  const tracks    = document.querySelectorAll('.marquee-track');
  if (!container || tracks.length < 2) return;
  gsap.to(tracks, { xPercent: -100, ease: 'none', duration: 25, repeat: -1 });
}

/* ─────────────────────────────────────────────────────────────
   6. Sticky Header Scroll Effect
───────────────────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.querySelector('header.site-header');
  if (!header) return;
  const handle = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handle);
  handle();
}

/* ─────────────────────────────────────────────────────────────
   7. What We Do — Carousel + Heading Reveal
   Features:
     • Auto-plays left → right (3.5s interval)
     • Pauses on hover / drag
     • Prev / Next button navigation
     • Dot indicator sync
     • Touch & mouse drag-to-slide
     • Seamless infinite loop via DOM cloning
     • GSAP scroll-triggered heading word-by-word 3D reveal
     • Per-card mouse-move 3D tilt via delegation
───────────────────────────────────────────────────────────── */
function initWhatWeDoAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section     = document.querySelector('.what-we-do-section');
  const heading     = document.querySelector('#what-we-do-title');
  const subLabel    = document.querySelector('.subheading-container');
  const allCausesLk = document.querySelector('.all-causes-link');

  /* ── GSAP Heading Reveal ─────────────────────────────────── */
  if (heading) {
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
      .join(' ');

    const wordInners = heading.querySelectorAll('.word-inner');
    gsap.set(wordInners,              { rotationX: 90, scaleY: 0.4, opacity: 0, transformOrigin: '50% 100%' });
    gsap.set([subLabel, allCausesLk], { opacity: 0, y: 14 });

    gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    })
      .to(subLabel,    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(allCausesLk, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<')
      .to(wordInners,  { rotationX: 0, scaleY: 1, opacity: 1, duration: 0.65, stagger: 0.06, ease: 'power3.out' }, '-=0.3');
  }

  /* ── Carousel Engine ────────────────────────────────────── */
  const track   = document.getElementById('carousel-track');
  const wrapper = document.querySelector('.carousel-track-wrapper');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');
  const dotsEl  = document.querySelectorAll('.carousel-dot');

  if (!track || !wrapper) return;

  const TOTAL   = 6;      // real card count
  const SPEED   = 3500;   // auto-advance interval ms
  const DUR     = 600;    // CSS transition duration ms

  function visCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 991) return 2;
    return 3;
  }

  function buildClones() {
    track.querySelectorAll('.carousel-clone').forEach(c => c.remove());
    const real  = [...track.querySelectorAll('.service-card:not(.carousel-clone)')];
    const n     = visCount();
    const end   = real.slice(0, n + 1).map(c => { const cl = c.cloneNode(true); cl.classList.add('carousel-clone'); return cl; });
    const start = real.slice(-(n + 1)).map(c => { const cl = c.cloneNode(true); cl.classList.add('carousel-clone'); return cl; });
    end.forEach(c   => track.appendChild(c));
    start.forEach(c => track.insertBefore(c, track.firstChild));
  }

  let idx = 0, transitioning = false, timer = null, paused = false;

  function cardW() {
    const vc  = visCount();
    const gap = vc === 1 ? 20 : 28;
    return (wrapper.offsetWidth - gap * (vc - 1)) / vc;
  }

  function cloneOffset() { return visCount() + 1; }

  function translateX(i) {
    const gap = visCount() === 1 ? 20 : 28;
    return -((i + cloneOffset()) * (cardW() + gap));
  }

  function setPos(x, animate) {
    track.style.transition = animate ? `transform ${DUR}ms cubic-bezier(0.25,1,0.5,1)` : 'none';
    track.style.transform  = `translateX(${x}px)`;
  }

  function syncDots() {
    dotsEl.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function goTo(i, animate = true) {
    if (transitioning) return;
    transitioning = true;
    if (i < 0)       i = TOTAL - 1;
    if (i >= TOTAL)  i = 0;
    idx = i;
    setPos(translateX(idx), animate);
    syncDots();
    setTimeout(() => { transitioning = false; }, DUR + 50);
  }

  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);

  // Seamless wrap after transition
  track.addEventListener('transitionend', () => {
    if (idx >= TOTAL) { idx = 0; setPos(translateX(0), false); }
  });

  function startAuto() { stopAuto(); timer = setInterval(() => { if (!paused) next(); }, SPEED); }
  function stopAuto()  { if (timer) clearInterval(timer); }

  wrapper.addEventListener('mouseenter', () => { paused = true; });
  wrapper.addEventListener('mouseleave', () => { paused = false; });

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  dotsEl.forEach(d => d.addEventListener('click', () => {
    stopAuto(); goTo(parseInt(d.dataset.dot, 10)); startAuto();
  }));

  // Drag / touch
  let dragX = 0, dragging = false;
  function dStart(x) { dragX = x; dragging = true; stopAuto(); }
  function dEnd(x) {
    if (!dragging) return;
    dragging = false;
    const diff = dragX - x;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAuto();
  }
  wrapper.addEventListener('mousedown',  e => dStart(e.clientX));
  wrapper.addEventListener('mouseup',    e => dEnd(e.clientX));
  wrapper.addEventListener('mouseleave', e => { if (dragging) dEnd(e.clientX); });
  wrapper.addEventListener('touchstart', e => dStart(e.touches[0].clientX),        { passive: true });
  wrapper.addEventListener('touchend',   e => dEnd(e.changedTouches[0].clientX));

  // Init
  function init() { buildClones(); setPos(translateX(0), false); syncDots(); startAuto(); }
  init();
  window.addEventListener('resize', () => { buildClones(); setPos(translateX(idx), false); });

  /* ── Per-card 3D tilt (event delegation) ────────────────── */
  track.addEventListener('mousemove', e => {
    const card = e.target.closest('.service-card');
    if (!card) return;
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    gsap.to(card, { rotationX: dy * -6, rotationY: dx * 8, transformPerspective: 900, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
  });
  track.addEventListener('mouseleave', e => {
    const card = e.target.closest('.service-card');
    if (!card) return;
    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.55, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
  });
}

/* ─────────────────────────────────────────────────────────────
   8. Our Story Section Animations
───────────────────────────────────────────────────────────── */
function initOurStoryAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.our-story-section');
  if (!section) return;

  const photo = section.querySelector('.story-photo');
  const ring = section.querySelector('.story-ring-decor');
  const badge = section.querySelector('.story-badge');
  const dots = section.querySelector('.story-dots');
  const statPill = section.querySelector('.story-stat-pill');

  const labelLine = section.querySelector('.story-label-line');
  const labelText = section.querySelector('.story-label-text');
  const heading = section.querySelector('#story-heading');
  const para1 = section.querySelector('#story-para-1');
  const para2 = section.querySelector('#story-para-2');
  const dividerLine = section.querySelector('.story-divider-line');
  const actions = section.querySelector('.story-actions');

  // Set initial states
  gsap.set(photo, { scale: 1.25, transformOrigin: 'left center' });
  gsap.set(ring, { scale: 0.8, opacity: 0 });
  gsap.set(badge, { scale: 0.5, y: 30, opacity: 0 });
  gsap.set(dots, { opacity: 0, x: -20 });
  gsap.set(statPill, { scale: 0.7, y: 30, opacity: 0 });

  if (labelLine) gsap.set(labelLine, { width: 0 });
  if (labelText) gsap.set(labelText, { opacity: 0, x: -10 });

  // Word wrapping heading
  if (heading) {
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
      .join(' ');
    
    const wordInners = heading.querySelectorAll('.word-inner');
    gsap.set(wordInners, { rotationX: 90, scaleY: 0.4, opacity: 0, transformOrigin: '50% 100%' });
  }

  if (para1) gsap.set(para1, { opacity: 0, y: 20 });
  if (para2) gsap.set(para2, { opacity: 0, y: 20 });
  if (dividerLine) gsap.set(dividerLine, { width: '0%' });
  if (actions) {
    const buttons = actions.querySelectorAll('a');
    gsap.set(buttons, { opacity: 0, y: 15 });
  }

  // Master Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  // Animate left side (Image and Decors)
  tl.to(ring, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.2)' })
    .to(photo, { scale: 1, duration: 1.4, ease: 'power3.out' }, '-=1.0')
    .to(dots, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=1.0')
    .to(badge, { scale: 1, y: 0, opacity: 1, duration: 1.0, ease: 'back.out(1.4)' }, '-=0.8')
    .to(statPill, { scale: 1, y: 0, opacity: 1, duration: 1.0, ease: 'back.out(1.4)' }, '-=0.8');

  // Animate right side (Content)
  if (labelLine) tl.to(labelLine, { width: 36, duration: 0.6, ease: 'power2.out' }, '-=1.2');
  if (labelText) tl.to(labelText, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=1.0');

  if (heading) {
    const wordInners = heading.querySelectorAll('.word-inner');
    tl.to(wordInners, {
      rotationX: 0,
      scaleY: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out'
    }, '-=0.8');
  }

  if (para1) tl.to(para1, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
  if (para2) tl.to(para2, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

  if (dividerLine) tl.to(dividerLine, { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.4');

  if (actions) {
    const buttons = actions.querySelectorAll('a');
    tl.to(buttons, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4');
  }

  // Add a subtle parallax scroll trigger on the photo itself during scroll
  gsap.to(photo, {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   9. Voices & Impact Section Animations
───────────────────────────────────────────────────────────── */
function initVoicesImpactAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.voices-impact-section');
  if (!section) return;

  const quoteCard = section.querySelector('.voices-quote-card');
  const quoteLine = section.querySelector('.quote-line-decor');
  const quoteLabel = section.querySelector('.quote-label-text');
  const quoteText = section.querySelector('#voices-quote-text');
  const quoteAuthor = section.querySelector('#voices-quote-author');

  const bannerCard = section.querySelector('.donation-banner-card');
  const bannerHeading = section.querySelector('#donation-banner-heading');
  const bannerSubtext = section.querySelector('#donation-banner-subtext');
  const bannerButton = section.querySelector('#btn-donate-banner');

  // 1. Initial States
  if (quoteLine) gsap.set(quoteLine, { width: 0 });
  if (quoteLabel) gsap.set(quoteLabel, { opacity: 0, x: -15 });
  if (quoteAuthor) gsap.set(quoteAuthor, { opacity: 0, y: 10 });

  if (bannerSubtext) gsap.set(bannerSubtext, { opacity: 0, y: 15 });
  if (bannerButton) gsap.set(bannerButton, { opacity: 0, scale: 0.9, y: 15 });

  // 2. 3D Text Splitting & Initial States for Quote
  if (quoteText) {
    const textContent = quoteText.textContent.trim();
    const words = textContent.split(/\s+/);
    quoteText.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
      .join(' ');

    const wordInners = quoteText.querySelectorAll('.word-inner');
    gsap.set(wordInners, { rotationX: 90, scaleY: 0.3, opacity: 0, transformOrigin: '50% 100%' });
  }

  // 3. 3D Text Splitting & Initial States for Banner Heading
  if (bannerHeading) {
    const bannerText = bannerHeading.textContent.trim();
    const words = bannerText.split(/\s+/);
    bannerHeading.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
      .join(' ');

    const bannerWordInners = bannerHeading.querySelectorAll('.word-inner');
    gsap.set(bannerWordInners, { rotationX: 70, scaleY: 0.5, opacity: 0, transformOrigin: '50% 100%' });
  }

  // 4. ScrollTrigger for Quote Card
  const tlQuote = gsap.timeline({
    scrollTrigger: {
      trigger: quoteCard,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  if (quoteLine) tlQuote.to(quoteLine, { width: 24, duration: 0.5, ease: 'power2.out' });
  if (quoteLabel) tlQuote.to(quoteLabel, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');

  if (quoteText) {
    const wordInners = quoteText.querySelectorAll('.word-inner');
    tlQuote.to(wordInners, {
      rotationX: 0,
      scaleY: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power3.out'
    }, '-=0.3');
  }

  if (quoteAuthor) tlQuote.to(quoteAuthor, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');

  // 5. ScrollTrigger for Banner Card
  const tlBanner = gsap.timeline({
    scrollTrigger: {
      trigger: bannerCard,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  if (bannerHeading) {
    const bannerWordInners = bannerHeading.querySelectorAll('.word-inner');
    tlBanner.to(bannerWordInners, {
      rotationX: 0,
      scaleY: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power3.out'
    });
  }

  if (bannerSubtext) tlBanner.to(bannerSubtext, { opacity: 0.5, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');
  if (bannerButton) tlBanner.to(bannerButton, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, '-=0.5');

  // 6. Interactive 3D Tilt for both cards (Event listeners)
  [quoteCard, bannerCard].forEach(card => {
    if (!card) return;
    
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      
      gsap.to(card, {
        rotationX: dy * -3, // subtle tilt
        rotationY: dx * 3,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   10. About Us Stacking Cards & Image Reveal Animations
───────────────────────────────────────────────────────────── */
function initAboutStackAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.about-stack-section');
  const stickyContainer = document.querySelector('.about-stack-sticky-container');
  if (!section || !stickyContainer) return;

  const mm = gsap.matchMedia();

  // Desktop Scroll-triggered Card Stacking & Image Reveal
  mm.add("(min-width: 1024px)", () => {
    const cards = gsap.utils.toArray('.about-stack-card');
    const images = gsap.utils.toArray('.about-stack-image-box');

    // 1. Initial States
    // Card 1 is active (scale 1, opacity 1, y 0)
    // Card 2, 3, 4 start shifted down, scaled down, and translucent
    gsap.set(cards[0], { scale: 1, opacity: 1, y: 0 });
    cards.slice(1).forEach((card, i) => {
      gsap.set(card, {
        y: 400 + i * 80,
        scale: 0.96,
        opacity: 0.5
      });
    });

    // Image 1 is active, others are wiped down
    gsap.set(images[0], { clipPath: 'inset(0% 0% 0% 0%)' });
    images.slice(1).forEach(img => {
      gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)' });
    });

    // 2. Main Timeline tied to ScrollTrigger pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: stickyContainer,
        pinSpacing: false,
        invalidateOnRefresh: true
      }
    });

    // 3. Staggered reveal of cards 2, 3, 4
    cards.slice(1).forEach((card, index) => {
      const targetIndex = index + 1;
      const imgTarget = images[targetIndex];

      const stepTimeline = gsap.timeline({ defaults: { ease: 'none', duration: 1 } });

      // Slide up and active state for current card
      stepTimeline.to(card, {
        y: 0,
        scale: 1,
        opacity: 1
      }, 0);

      // Scale down and push back previous cards
      for (let i = 0; i < targetIndex; i++) {
        const prevCard = cards[i];
        const depth = targetIndex - i;
        const scaleVal = 1 - depth * 0.035;
        const opacityVal = 1 - depth * 0.18;

        stepTimeline.to(prevCard, {
          scale: scaleVal,
          opacity: Math.max(opacityVal, 0.3)
        }, 0);
      }

      // Wipe reveal the corresponding image on the right
      if (imgTarget) {
        stepTimeline.to(imgTarget, {
          clipPath: 'inset(0% 0% 0% 0%)'
        }, 0);
      }

      // Append step to main timeline
      tl.add(stepTimeline, index * 1.5);
    });

    // Add extra space at the end of the timeline for a clean release
    tl.to({}, { duration: 0.5 });
  });

  // Mobile / Tablet: Simple entry animations without pinning
  mm.add("(max-width: 1023px)", () => {
    const cards = gsap.utils.toArray('.about-stack-card');
    const images = gsap.utils.toArray('.about-stack-image-box');

    // Reset absolute positions and scales
    gsap.set(cards, { clearProps: "all" });
    gsap.set(images, { clearProps: "all" });

    // Animate cards on scroll entry
    cards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Automatic transition slideshow for mobile view (cycles every 3.5s)
    let activeIndex = 0;
    let slideInterval = null;

    function showSlide(index) {
      if (cards.length === 0) return;
      activeIndex = index;
      
      // Deactivate all
      cards.forEach(c => c.classList.remove('active'));
      images.forEach(img => img.classList.remove('active'));

      // Activate selected
      cards[activeIndex].classList.add('active');
      images[activeIndex].classList.add('active');
    }

    function startSlideshow() {
      stopSlideshow();
      slideInterval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % cards.length;
        showSlide(nextIndex);
      }, 3500);
    }

    function stopSlideshow() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Click/tap handler for cards to update slideshow
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        showSlide(idx);
        startSlideshow(); // Reset timer on manual select
      });
      card.style.cursor = 'pointer';
    });

    // Start slideshow and initial state
    showSlide(0);
    startSlideshow();

    // Cleanup interval on matchMedia query change
    return () => {
      stopSlideshow();
      cards.forEach(c => {
        c.classList.remove('active');
        c.style.cursor = '';
      });
      images.forEach(img => img.classList.remove('active'));
    };
  });
}

/* ─────────────────────────────────────────────────────────────
   11. Results / Impact Bento Grid — Scramble Number Animations
───────────────────────────────────────────────────────────── */
function initResultsAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.results-section');
  if (!section) return;

  // ── 1. Entrance animations for header and cards ──
  const header = section.querySelector('.results-header');
  const cards  = gsap.utils.toArray('.results-card');

  if (header) {
    gsap.from(header.children, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.07,
      scrollTrigger: {
        trigger: section.querySelector('.results-bento-grid'),
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  // ── 2. Slot-machine / scramble number animation ──
  const numberEls = section.querySelectorAll('.results-number');

  numberEls.forEach(el => {
    const target = el.getAttribute('data-target'); // e.g. "10,000+"
    const rawVal = parseInt(el.getAttribute('data-raw'), 10); // numeric value
    const suffix = target.replace(/[\d,]/g, ''); // e.g. "+" or "+"
    let triggered = false;

    const scramble = () => {
      if (triggered) return;
      triggered = true;

      const totalDigits = String(rawVal).length;
      const duration = 1400; // ms of scrambling
      const interval = 55;   // ms between each frame
      const frames = Math.floor(duration / interval);
      let count = 0;

      el.classList.add('scrambling');

      const ticker = setInterval(() => {
        count++;
        // Generate a random number of the same digit length
        const randNum = Math.floor(Math.random() * Math.pow(10, totalDigits));
        // Format with comma if needed (crude but effective)
        const formatted = randNum.toLocaleString('en-US').slice(0, String(rawVal).length + 1);
        el.textContent = formatted + suffix;

        // In final 30% of frames, progressively lock digits from left
        if (count > frames * 0.7) {
          const progress = (count - frames * 0.7) / (frames * 0.3);
          const targetStr = target.replace(/\+/g, '');
          const lockChars = Math.floor(progress * targetStr.length);
          const locked = targetStr.slice(0, lockChars);
          el.textContent = locked + formatted.slice(lockChars) + suffix;
        }

        if (count >= frames) {
          clearInterval(ticker);
          el.classList.remove('scrambling');
          el.textContent = target; // Final exact value
        }
      }, interval);
    };

    // Trigger scramble on ScrollTrigger
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: scramble
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   12. Feature Causes — Blur-in Header + Card Entrance Animations
───────────────────────────────────────────────────────────── */
function initCausesAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.causes-section');
  if (!section) return;

  // ── 1. Blur-in header reveal ──
  const header = section.querySelector('#causes-header');
  if (header) {
    // Set initial blurred + faded state
    gsap.set(header, { opacity: 0, filter: 'blur(12px)', y: 20 });

    ScrollTrigger.create({
      trigger: header,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(header, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.1,
          ease: 'power3.out'
        });
      }
    });
  }

  // ── 2. Card slide-up entrance animations ──
  const cards = section.querySelectorAll('.cause-card');
  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: i % 2 === 0 ? 0 : 0.1
        });
      }
    });
  });

  // ── 3. Stagger child elements inside each card ──
  cards.forEach(card => {
    const children = card.querySelectorAll('.cause-tag-pill, .cause-title, .cause-desc, .cause-footer');
    gsap.set(children, { opacity: 0, y: 18 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1
        });
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   13. Take Action / Donation Section Entrance Animations
───────────────────────────────────────────────────────────── */
function initActionAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('.action-section');
  if (!section) return;

  const cols = section.querySelectorAll('.action-col');
  if (cols.length === 0) return;

  // Set initial state
  gsap.set(cols, { opacity: 0, y: 50 });

  ScrollTrigger.create({
    trigger: section.querySelector('.action-grid'),
    start: 'top 85%',
    onEnter: () => {
      gsap.to(cols, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.2
      });
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   14. Video CTA Section — Parallax Zoom + Content Fade-in
───────────────────────────────────────────────────────────── */
function initVideoCTAAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('#video-cta');
  if (!section) return;

  const video   = section.querySelector('.video-bg-media');
  const heading = section.querySelector('#video-cta-heading');
  const subtext = section.querySelector('.video-cta-subtext');
  const btn     = section.querySelector('#video-cta-btn');

  // ── 1. Slow continuous parallax zoom on the video (scrub) ──
  if (video) {
    gsap.fromTo(video,
      { scale: 1.08 },
      {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // ── 2. Content fade-in + slide-up on scroll enter ──
  const elements = [heading, subtext, btn].filter(Boolean);
  if (elements.length) {
    gsap.from(elements, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   15. Our Blog Section — Staggered Card Entrance
───────────────────────────────────────────────────────────── */
function initBlogAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const section = document.querySelector('#our-blog');
  if (!section) return;

  // ── 1. Blog header reveal ──
  const header = section.querySelector('#blog-header');
  if (header) {
    gsap.from(header.children, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ── 2. Blog cards staggered entrance ──
  const cards = section.querySelectorAll('.blog-card');
  if (cards.length > 0) {
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: section.querySelector('#blog-grid'),
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   16. Site Footer — Staggered Column Entrance + Copyright Fade
───────────────────────────────────────────────────────────── */
function initFooterAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  const footer   = document.querySelector('#site-footer');
  if (!footer) return;

  const cols     = footer.querySelectorAll('.footer-col');
  const bottom   = footer.querySelector('#footer-bottom');
  const logo     = footer.querySelector('.footer-logo-link');
  const desc     = footer.querySelector('.footer-brand-desc');
  const socials  = footer.querySelector('.footer-socials');

  // ── 1. Staggered columns entrance (left → right) ──
  if (cols.length) {
    gsap.from(cols, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: footer,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ── 2. Copyright bar fades in last ──
  if (bottom) {
    gsap.from(bottom, {
      opacity: 0,
      y: 12,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      delay: 0.8
    });
  }

  // ── 3. Newsletter form submit feedback ──
  const form  = footer.querySelector('.footer-newsletter-form');
  const input = footer.querySelector('.footer-email-input');
  const btn   = footer.querySelector('.footer-join-btn');

  if (form && input && btn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input.value.trim() || !emailRegex.test(input.value)) {
        input.style.borderColor = '#f87171';
        const orig = input.placeholder;
        input.placeholder = 'Enter a valid email first';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          input.placeholder = orig;
        }, { once: true });
        return;
      }
      // Valid — animate then redirect
      btn.textContent = '✓';
      btn.style.color = '#8EE3C2';
      btn.style.pointerEvents = 'none';
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(btn, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 800);
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   16. Mobile Menu Overlay Toggle
───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navWrapper = document.querySelector('.nav-menu-wrapper');
  
  if (!toggleBtn || !navWrapper) return;
  
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = document.body.classList.contains('mobile-menu-active');
    if (isActive) {
      document.body.classList.remove('mobile-menu-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      document.body.classList.add('mobile-menu-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking nav links
  const navLinks = navWrapper.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('mobile-menu-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside nav wrapper
  document.addEventListener('click', (e) => {
    const isActive = document.body.classList.contains('mobile-menu-active');
    if (isActive && !navWrapper.contains(e.target) && !toggleBtn.contains(e.target)) {
      document.body.classList.remove('mobile-menu-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   12. Global Touch Support for Grayscale Color Reveal
───────────────────────────────────────────────────────────── */
function initTouchGrayscale() {
  const touchContainers = document.querySelectorAll(
    '.cause-image-container, #causes-card-main, .service-card, .tilt-container, .story-image-frame, .about-stack-image-box, .results-card, .cause-card'
  );
  
  touchContainers.forEach(container => {
    container.addEventListener('click', (e) => {
      // Toggle color state on touch/click
      const isTouched = container.classList.contains('touched');
      touchContainers.forEach(c => c.classList.remove('touched'));
      
      if (!isTouched) {
        container.classList.add('touched');
      }
    });
  });

  // Clear color if tapping outside
  document.addEventListener('click', (e) => {
    if (!Array.from(touchContainers).some(c => c.contains(e.target))) {
      touchContainers.forEach(c => c.classList.remove('touched'));
    }
  });
}

