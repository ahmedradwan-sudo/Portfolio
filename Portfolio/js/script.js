/**
 * ============================================================================
 * Ahmed Mohamed - Developer Portfolio JavaScript
 * Role: Computer Engineering | Embedded Systems & Cybersecurity
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark Mode Default)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'amm_portfolio_theme';
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  /**
   * Initializes theme on load.
   * Default theme is explicitly 'dark'.
   */
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light') {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  }

  /**
   * Applies the chosen theme to the DOM and updates accessible labels.
   * @param {'dark' | 'light'} theme
   */
  function applyTheme(theme) {
    if (theme === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    } else {
      htmlElement.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /**
   * Toggles between dark and light themes.
   */
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Hamburger Navigation Menu
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMobileMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  // Close mobile drawer when any link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------------------------------
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Graceful fallback for legacy environments
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 4. Active Navigation Link Highlighting on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNavLink() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Floating Back-to-Top Button
  // --------------------------------------------------------------------------
  const scrollTopFloat = document.getElementById('scrollTopFloat');

  function handleScrollTopVisibility() {
    if (!scrollTopFloat) return;
    if (window.scrollY > 380) {
      scrollTopFloat.classList.add('visible');
    } else {
      scrollTopFloat.classList.remove('visible');
    }
  }

  if (scrollTopFloat) {
    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    scrollTopFloat.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Copy Email to Clipboard Helper
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailAddressText = 'engahmedmohamed320@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailAddressText);
        const originalTitle = copyEmailBtn.getAttribute('title') || 'Copy Email';
        copyEmailBtn.setAttribute('title', 'Copied to clipboard!');
        
        // Visual indicator
        copyEmailBtn.style.color = 'var(--accent-emerald)';
        
        // Show brief alert badge or feedback
        const feedbackBadge = document.getElementById('copyFeedback');
        if (feedbackBadge) {
          feedbackBadge.textContent = 'Copied!';
          feedbackBadge.style.display = 'inline-block';
          setTimeout(() => {
            feedbackBadge.style.display = 'none';
          }, 2000);
        }

        setTimeout(() => {
          copyEmailBtn.setAttribute('title', originalTitle);
          copyEmailBtn.style.color = '';
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = emailAddressText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Contact Form Client-Side Validation & Feedback
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolioContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const subjectInput = document.getElementById('formSubject');
      const messageInput = document.getElementById('formMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Basic validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields before submitting.';
        formFeedback.style.display = 'block';
        return;
      }

      if (!emailPattern.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please provide a valid email address.';
        formFeedback.style.display = 'block';
        return;
      }

      if (message.length < 10) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a message with at least 10 characters.';
        formFeedback.style.display = 'block';
        return;
      }

      // Success simulation
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = `Thank you, ${name}! Your security inquiry has been recorded. Ahmed Mohamed will get back to you shortly.`;
      formFeedback.style.display = 'block';

      // Clear input fields
      contactForm.reset();

      // Automatically hide message after 8 seconds
      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 8000);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Initialize on DOMContentLoaded
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    highlightActiveNavLink();
  });

  // Run initial theme check immediately to prevent flash of wrong theme
  initTheme();
})();
