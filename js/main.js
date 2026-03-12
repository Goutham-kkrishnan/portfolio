/* ===================================================
   MAIN.JS — Initialization & Utilities
   =================================================== */

// --- Debug Mode ---
function initDebugMode() {
    if (window.location.search.includes('debug=true')) {
        document.body.classList.add('debug');
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.defaults({ markers: true });
        }
        console.log('[Portfolio] Debug mode enabled');
    }
}

// --- Smooth Nav Scrolling ---
function initSmoothNav() {
    document.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const navLinks = document.getElementById('navLinks');
                const navToggle = document.getElementById('navToggle');
                if (navLinks) navLinks.classList.remove('open');
                if (navToggle) navToggle.classList.remove('active');

                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 70 },
                    duration: 0.8,
                    ease: 'power2.inOut'
                });

                history.pushState(null, null, link.getAttribute('href'));
            }
        });
    });

    // CTA buttons smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 70 },
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// --- Mobile Nav Toggle ---
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });
}

// --- Contact Form ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;

        // Success animation
        gsap.to(btn, {
            scale: 0.95,
            duration: 0.1,
            onComplete: () => {
                btn.textContent = '✓ Sent!';
                btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                gsap.to(btn, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    form.reset();
                }, 2500);
            }
        });
    });
}

// --- Image Error Fallback ---
function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.src = 'https://picsum.photos/800/400?grayscale';
            img.alt = 'Placeholder image';
        });
    });
}

// --- Resume Download Feedback ---
function initResumeDownload() {
    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', () => {
            gsap.to(link, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
        });
    });
}

// --- Section Dividers (insert between sections) ---
function initSectionDividers() {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, i) => {
        if (i < sections.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'section-divider';
            section.after(divider);
        }
    });
}

// ==============================
// INITIALIZE EVERYTHING
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
    initDebugMode();

    // Preloader first
    await initPreloader();

    // Hero animations
    initHeroAnimation();
    initTypewriter();
    initHeroParticles();

    // Interactive effects
    initCursorGlow();
    initTiltEffect();
    initCardTilt();
    initMagneticButtons();
    initButtonRipple();
    initScrollProgress();
    initParallaxElements();

    // Multi-layered scenery background
    initSceneryCanvas();

    // Insert section dividers
    initSectionDividers();

    // Scroll effects
    initScrollEffects();
    initProjectFilter();
    initProjectModal();

    // UI utilities
    initSmoothNav();
    initMobileNav();
    initContactForm();
    initImageFallbacks();
    initResumeDownload();

    // Refresh ScrollTrigger after images load
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
});
