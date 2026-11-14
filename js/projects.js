/*
  ==========================================================================
  js/projects.js — Case Study Reading Progress, Anchor Navigation, and Lightbox
  New module for projects.html providing:
  1. Thin top reading progress bar synced to scroll depth
  2. Active anchor tab highlighting as the reader scrolls between case studies
  3. Accessible image lightbox modal when clicking any project visual
  ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initCaseStudyAnchorHighlight();
  initVisualLightbox();
});

/**
 * Updates the width of the thin reading progress bar at the top of projects.html.
 */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100) : 0;
    progressBar.style.width = `${percent}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
}

/**
 * Highlights the active case study anchor button when scrolling or clicking.
 */
function initCaseStudyAnchorHighlight() {
  const navLinks = document.querySelectorAll('.case-nav-link');
  const studies = document.querySelectorAll('.case-study[id]');
  if (!navLinks.length || !studies.length) return;

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${activeId}`);
          });
        }
      });
    },
    { rootMargin: '-25% 0px -60% 0px' }
  );

  studies.forEach((study) => observer.observe(study));
}

/**
 * Opens any clicked project chart or diagram in a full lightbox dialog.
 */
function initVisualLightbox() {
  const lightbox = document.getElementById('visual-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.visual-trigger');

  if (!lightbox || !lightboxImg || !closeBtn || !triggers.length) return;

  let lastFocusedTrigger = null;

  const openLightbox = (trigger) => {
    const img = trigger.querySelector('img');
    const figure = trigger.closest('figure');
    const captionEl = figure ? figure.querySelector('figcaption') : null;

    if (!img) return;

    lastFocusedTrigger = trigger;
    lightboxImg.src = img.getAttribute('src') || '';
    lightboxImg.alt = img.getAttribute('alt') || '';
    if (lightboxTitle) {
      lightboxTitle.textContent = trigger.getAttribute('data-title') || 'Project Visual';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
