document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal animation
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // Headroom-like navigation scroll handler
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScrollY = 0;
    let ticking = false;
    const deadband = 8;
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      if (delta > deadband && currentY > 120) {
        nav.classList.add('is-hidden');
      } else if (delta < -deadband) {
        nav.classList.remove('is-hidden');
      }
      if (currentY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
      lastScrollY = currentY;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // FAQ Accordion with Accessibility Support
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all items first for single accordion behavior
        faqItems.forEach((i) => {
          i.classList.remove('active');
          const qBtn = i.querySelector('.faq-question');
          if (qBtn) {
            qBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Floating CTA Smart Visibility Logic (IntersectionObserver)
  const heroSection = document.getElementById('hero');
  const floatingCta = document.querySelector('.floating-cta');
  if (heroSection && floatingCta) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Hide Floating CTA when Hero is in viewport
            floatingCta.classList.remove('is-visible');
          } else {
            // Show Floating CTA when scrolled past Hero
            floatingCta.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 } // Fires when even 10% of Hero is visible
    );
    ctaObserver.observe(heroSection);
  }
});
