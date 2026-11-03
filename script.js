(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = !reduce && window.gsap && window.ScrollTrigger;

  /* ---------- Side menu ---------- */
  const menu = $('#menu'), overlay = $('#overlay'), openBtn = $('#menuOpen'), closeBtn = $('#menuClose');
  const setMenu = (open, returnFocus = true) => {
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
    openBtn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (open) closeBtn.focus(); else if (returnFocus) openBtn.focus();
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  overlay.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false, false)));

  /* ---------- Header turns solid after the hero starts to scroll ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Footer reveal sizing ----------
     Footer is fixed behind <main>; main's bottom margin equals the footer height.
     If the footer is taller than the viewport, fall back to normal flow. */
  const footer = $('#contact'), main = $('#main');
  const fitFooter = () => {
    footer.classList.remove('static');
    const tall = footer.offsetHeight > innerHeight;
    footer.classList.toggle('static', tall);
    main.style.marginBottom = tall ? '0' : footer.offsetHeight + 'px';
  };
  fitFooter();
  addEventListener('resize', fitFooter);
  addEventListener('load', () => { fitFooter(); window.ScrollTrigger && ScrollTrigger.refresh(); });

  /* ---------- Shared final-state helpers ---------- */
  const timeline = $('.timeline'), tlItems = $$('.tl-item');
  const counters = $$('[data-count]');
  const showFinal = () => {
    timeline.style.setProperty('--p', 1);
    tlItems.forEach(i => i.classList.add('on'));
  };
  if (!canAnimate) { showFinal(); return; }   // reduced motion or GSAP unavailable: static page

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero entrance ---------- */
  gsap.from('.hero-sub, .hero h1, .btns', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: .18, delay: .2 });
  gsap.from('.hero-img', { scale: 1.12, duration: 2.2, ease: 'power2.out' });

  /* ---------- Pinned hero: main content slides up over it ---------- */
  ScrollTrigger.create({ trigger: '#home', start: 'top top', end: 'bottom top', pin: true, pinSpacing: false });
  gsap.to('.hero-copy', { y: -60, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: '70% top', scrub: true } });

  /* ---------- Footer content settles as it is revealed ---------- */
  if (!footer.classList.contains('static')) {
    gsap.fromTo('.footer-inner', { y: -50, opacity: .3 }, { y: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: main, start: () => 'bottom bottom+=' + footer.offsetHeight, end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
  }

  /* ---------- Count-up statistics ---------- */
  gsap.delayedCall(.9, () => {
    counters.forEach(el => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '', o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
    });
  });
  counters.forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); });

  /* ---------- About: image reveal + copy ---------- */
  gsap.fromTo('.about-media', { clipPath: 'inset(0 0 100% 0 round 22px)' },
    { clipPath: 'inset(0 0 0% 0 round 22px)', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.about-media', start: 'top 80%', once: true } });
  gsap.from('.about-media img', { scale: 1.2, duration: 1.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-media', start: 'top 80%', once: true } });
  gsap.from('.about-copy > :not(.timeline)', { y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: .14,
    scrollTrigger: { trigger: '.about-copy', start: 'top 80%', once: true } });

  /* ---------- Connected timeline: progress line activates each icon in turn ---------- */
  const prog = { p: 0 };
  ScrollTrigger.create({ trigger: timeline, start: 'top 80%', once: true, onEnter: () => {
    gsap.to(prog, { p: 1, duration: 2.6, ease: 'none', onUpdate: () => {
      timeline.style.setProperty('--p', prog.p);
      tlItems.forEach((item, i) => { if (prog.p >= i / (tlItems.length - 1) - 0.001) item.classList.add('on'); });
    } });
  } });
})();


/* ---------- Plot Options ---------- */


document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".plots-options");

    if (!section) return;

    const slider = section.querySelector(".po-slider");
    const nextBtn = section.querySelector(".po-next");
    const prevBtn = section.querySelector(".po-prev");

    function getScrollAmount() {
        const card = slider.querySelector(".po-card");
        if (!card) return 300;

        const gap = parseFloat(getComputedStyle(slider).gap) || 0;

        return card.offsetWidth + gap;
    }

    nextBtn.addEventListener("click", function () {
        slider.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });
    });

    prevBtn.addEventListener("click", function () {
        slider.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    });

});




document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(".n101-section");

    sections.forEach(section => {

        const image = section.querySelector(".n101-main-image");

        // IMAGE FALLBACK
        if (image) {
            image.addEventListener("error", function () {
                this.style.opacity = "0";
                this.parentElement.style.background = "#d8c9b4";
            });
        }

        // SCROLL REVEAL ANIMATION
        const elements = section.querySelectorAll(
            ".n101-image-wrap, .n101-content"
        );

        if ("IntersectionObserver" in window) {

            const observer = new IntersectionObserver(
                function (entries) {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("n101-visible");

                            observer.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

            elements.forEach(element => {

                element.classList.add("n101-reveal");

                observer.observe(element);

            });

        }

    });

});





document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(".life-amenities");

    sections.forEach(section => {

        const cards = section.querySelectorAll(".life-amenity-card");

        if (!("IntersectionObserver" in window)) {
            return;
        }

        section.classList.add("la-js");

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const index = Array.from(cards).indexOf(entry.target);

                    entry.target.style.transitionDelay =
                        (index % 6) * 80 + "ms";

                    entry.target.classList.add("la-visible");

                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });

        cards.forEach(card => observer.observe(card));

    });

});



document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(".sl-section");

    sections.forEach(section => {

        const elements = section.querySelectorAll(
            ".sl-image-wrap, .sl-content"
        );

        if (!("IntersectionObserver" in window)) {
            return;
        }

        section.classList.add("sl-js");

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("sl-visible");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        elements.forEach(element => observer.observe(element));

    });

});



(function () {
    const faqSections = document.querySelectorAll('.faq-invest');

    faqSections.forEach(section => {
        const items = section.querySelectorAll('.faq-invest-item');

        items.forEach(item => {
            const button = item.querySelector('.faq-invest-question');
            const icon = item.querySelector('.faq-invest-toggle i');

            button.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                items.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-invest-question')
                        .setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-invest-toggle i').className =
                        'fa-solid fa-plus';
                });

                if (!isOpen) {
                    item.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                    icon.className = 'fa-solid fa-minus';
                }
            });
        });
    });
})();