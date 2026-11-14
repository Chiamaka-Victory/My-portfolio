/*
  ==========================================================================
  js/main.js — Shared Website Interactivity and Animations
  Handles:
  1. Sticky navbar scroll shrink and soft shadow
  2. Mobile hamburger navigation toggle
  3. Dynamic time of day greeting
  4. Homepage typing effect rotating through roles
  5. Scroll reveal (IntersectionObserver) for sections, cards, and visuals
  6. Animated number counters and skill bars when scrolled into view
  7. Local profile photo upload preview (saved in localStorage)
  8. Back to top floating button
  9. Current year update in the footer
  ==========================================================================
*/

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileNavigation();
  initDynamicGreeting();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initBackToTop();
  initFooterYear();
});

/**
 * Adds a compact scrolled state to the sticky header after scrolling down.
 */
function initStickyNavbar() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/**
 * Toggles the mobile navigation drawer and hamburger icon animation.
 */
function initMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (!navToggle || !primaryNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Displays a time of day greeting on the homepage.
 */
function initDynamicGreeting() {
  const greetingEl = document.getElementById('dynamic-greeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  if (hour < 12) {
    greetingEl.textContent = 'Good morning, welcome to my portfolio.';
  } else if (hour < 17) {
    greetingEl.textContent = 'Good afternoon, welcome to my portfolio.';
  } else {
    greetingEl.textContent = 'Good evening, welcome to my portfolio.';
  }
}

/**
 * Rotates smoothly between three roles on the homepage hero.
 */
function initTypingEffect() {
  const roleEl = document.getElementById('typing-role');
  if (!roleEl) return;

  const roles = ['Data Science Student', 'Marketing Strategist', 'Business Manager'];

  if (REDUCED_MOTION) {
    roleEl.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  function step() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
      roleEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        window.setTimeout(step, 320);
        return;
      }
      window.setTimeout(step, 42);
    } else {
      charIndex += 1;
      roleEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        isDeleting = true;
        window.setTimeout(step, 2000);
        return;
      }
      window.setTimeout(step, 72);
    }
  }

  window.setTimeout(step, 1800);
}

/**
 * Reveals sections, cards, and images smoothly as they enter the viewport.
 */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/**
 * Counts numbers up smoothly once when counter cards scroll into view.
 */
function initCounters() {
  const counters = document.querySelectorAll('[data-count-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-count-target') || '0');
    const suffix = el.getAttribute('data-count-suffix') || '';

    if (REDUCED_MOTION) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1100;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  };

  if (!('IntersectionObserver' in window) || REDUCED_MOTION) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Animates skill bars when the skills section scrolls into view on about.html.
 */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  if (!skillBars.length) return;

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    skillBars.forEach((bar) => bar.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

/**
 * Shows a Back to Top button after scrolling down and scrolls smoothly on click.
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 360);
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: REDUCED_MOTION ? 'auto' : 'smooth'
    });
  });
}

/**
 * Updates the footer copyright year automatically.
 */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
