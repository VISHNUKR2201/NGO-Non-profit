/* ─────────────────────────────────────────────────────────────
   STACKLY Premium Brand Preloader — Shared Library v2.0
   Handles both:
     • Simple 2-curtain layout (index.html)
     • Cinematic 3-curtain layout with collage (all other pages)
───────────────────────────────────────────────────────────── */
function runPreloader(preloader, mainTimeline, lenis) {
  if (!preloader) return;

  if (typeof gsap === 'undefined') {
    // Fallback: instantly remove preloader if GSAP is missing
    preloader.style.display = 'none';
    preloader.remove();
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (mainTimeline) mainTimeline.play();
    return;
  }

  /* ── Detect layout variant ────────────────────────────── */
  const hasCenterCurtain = preloader.querySelector('.curtain-center') !== null;
  const logoWrapper   = preloader.querySelector('.preloader-logo-wrapper');
  const counterEl     = preloader.querySelector('.preloader-counter');
  const progressFill  = preloader.querySelector('.preloader-progress-fill');
  const statusText    = preloader.querySelector('.preloader-status-text');
  const brandLetters  = preloader.querySelectorAll('.pl-letter');
  const taglineEl     = preloader.querySelector('.pl-tagline-text');
  const imgCards      = preloader.querySelectorAll('.pl-img-card');
  const plRing        = preloader.querySelector('.pl-ring');
  const plDots        = preloader.querySelectorAll('.pl-dot');
  const preloaderContent = preloader.querySelector('.preloader-content');

  const messages = [
    'Sowing seeds of hope...',
    'Gathering community support...',
    'Cultivating opportunities...',
    'Ready to change lives.'
  ];

  /* ── Master loader timeline ───────────────────────────── */
  const loaderTimeline = gsap.timeline({
    onComplete: () => {
      preloader.style.display = 'none';
      preloader.remove();
    }
  });

  /* ── 1. Initial hidden states ─────────────────────────── */
  if (logoWrapper)      gsap.set(logoWrapper,   { scale: 0.85, opacity: 0 });
  if (brandLetters.length) gsap.set(brandLetters, { y: 30, opacity: 0 });
  if (taglineEl)        gsap.set(taglineEl,     { y: 12, opacity: 0 });
  if (statusText)       gsap.set(statusText,    { y: 10, opacity: 0 });
  if (counterEl)        gsap.set(counterEl,     { y: 10, opacity: 0 });
  if (plDots.length)    gsap.set(plDots,        { scale: 0, opacity: 0 });

  if (imgCards.length) {
    gsap.set('.pl-img-1', { x: -80, y:  40, rotate: -12, opacity: 0 });
    gsap.set('.pl-img-2', { x:  80, y: -30, rotate:  10, opacity: 0 });
    gsap.set('.pl-img-3', { x: -40, y: -70, rotate:   6, opacity: 0 });
  }
  if (plRing)           gsap.set(plRing,        { scale: 0.3, opacity: 0 });

  /* ── 2. Particle dots entrance (cinematic pages only) ─── */
  if (plDots.length) {
    loaderTimeline.to(plDots, {
      scale: 1, opacity: 0.5,
      duration: 0.6, stagger: 0.05, ease: 'back.out(2)'
    });
  }

  /* ── 3. Image collage float in (cinematic pages only) ─── */
  if (imgCards.length) {
    loaderTimeline.to('.pl-img-1', {
      x: 0, y: 0, rotate: -6, opacity: 1,
      duration: 1.0, ease: 'power3.out'
    }, plDots.length ? '-=0.4' : '0');
    loaderTimeline.to('.pl-img-2', {
      x: 0, y: 0, rotate: 5, opacity: 1,
      duration: 1.0, ease: 'power3.out'
    }, '-=0.8');
    loaderTimeline.to('.pl-img-3', {
      x: 0, y: 0, rotate: 3, opacity: 1,
      duration: 1.0, ease: 'power3.out'
    }, '-=0.8');
    if (plRing) {
      loaderTimeline.to(plRing, {
        scale: 1, opacity: 0.6,
        duration: 1.2, ease: 'power2.out'
      }, '-=1.0');
    }
  }

  /* ── 4. Logo entrance ─────────────────────────────────── */
  if (logoWrapper) {
    loaderTimeline.to(logoWrapper, {
      opacity: 1, scale: 1,
      duration: 0.9, ease: 'power3.out'
    }, imgCards.length ? '-=0.6' : '0');
  }

  /* ── 5. Brand name letter stagger ────────────────────── */
  if (brandLetters.length) {
    loaderTimeline.to(brandLetters, {
      y: 0, opacity: 1,
      duration: 0.6, stagger: 0.07, ease: 'power3.out'
    }, '-=0.5');
  }

  /* ── 6. Tagline fade in ───────────────────────────────── */
  if (taglineEl) {
    loaderTimeline.to(taglineEl, {
      y: 0, opacity: 1,
      duration: 0.5, ease: 'power2.out'
    }, '-=0.3');
  }

  /* ── 7. Counter + status reveal ──────────────────────── */
  loaderTimeline.to([statusText, counterEl].filter(Boolean), {
    y: 0, opacity: 1,
    duration: 0.5, stagger: 0.1, ease: 'power2.out'
  }, '-=0.3');

  /* ── 8. Progress count-up ────────────────────────────── */
  const countObj = { value: 0 };
  loaderTimeline.to(countObj, {
    value: 100,
    duration: 2.4,
    ease: 'power2.inOut',
    onUpdate: () => {
      const val = Math.floor(countObj.value);
      const formatted = val < 10 ? '0' + val : '' + val;
      if (counterEl) {
        // preserve the % span if it exists inside counter
        const pctSpan = counterEl.querySelector('.pl-percent');
        if (pctSpan) {
          counterEl.firstChild.textContent = formatted;
        } else {
          counterEl.textContent = formatted;
        }
      }
      if (progressFill) progressFill.style.width = val + '%';
      if (statusText) {
        if (val < 25)      statusText.textContent = messages[0];
        else if (val < 55) statusText.textContent = messages[1];
        else if (val < 85) statusText.textContent = messages[2];
        else               statusText.textContent = messages[3];
      }
    }
  }, '-=0.3');

  /* ── 9. Content fade out ─────────────────────────────── */
  if (preloaderContent) {
    loaderTimeline.to(preloaderContent, {
      opacity: 0, y: -24,
      duration: 0.55, ease: 'power3.in'
    }, '+=0.15');
  }

  /* ── 10. Curtain wipe exit ───────────────────────────── */
  if (hasCenterCurtain) {
    // 3-panel cinematic wipe: left exits left, right exits right, center exits up
    loaderTimeline.to('.curtain-left', {
      xPercent: -102,
      duration: 0.9, ease: 'power4.inOut'
    }, '-=0.1');
    loaderTimeline.to('.curtain-right', {
      xPercent: 102,
      duration: 0.9, ease: 'power4.inOut',
      onStart: () => {
        if (mainTimeline) mainTimeline.play();
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    }, '-=0.9');
    loaderTimeline.to('.curtain-center', {
      yPercent: -102,
      duration: 0.9, ease: 'power4.inOut'
    }, '-=0.9');
  } else {
    // 2-panel simple split
    loaderTimeline.to('.curtain-left', {
      xPercent: -102,
      duration: 1.0, ease: 'power4.inOut'
    }, '-=0.1');
    loaderTimeline.to('.curtain-right', {
      xPercent: 102,
      duration: 1.0, ease: 'power4.inOut',
      onStart: () => {
        if (mainTimeline) mainTimeline.play();
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    }, '-=1.0');
  }
}
