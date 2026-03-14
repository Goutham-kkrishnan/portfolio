/* ===================================================
   SCROLL-EFFECTS.JS — GSAP ScrollTrigger Animations
   =================================================== */

function initScrollEffects() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Section reveal with grid background ---
    document.querySelectorAll('.section').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            onEnter: () => section.classList.add('in-view'),
        });
    });

    // --- Reveal text elements with smooth fade-up ---
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30, filter: 'blur(4px)' },
            {
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    // --- Reveal cards with elegant staggered entrances ---
    const cardGroups = [
        { sel: '.about-cards', dir: 'up' },
        { sel: '.skills-grid', dir: 'up' },
        { sel: '.projects-list', dir: 'up' },
        { sel: '.research-grid', dir: 'up' },
        { sel: '.experience-timeline', dir: 'left' },
        { sel: '.achievements-timeline', dir: 'right' },
        { sel: '.contact-cards', dir: 'up' }
    ];

    cardGroups.forEach(({ sel, dir }) => {
        const container = document.querySelector(sel);
        if (!container) return;
        const cards = container.querySelectorAll('.reveal-card');

        cards.forEach((card, i) => {
            const fromVars = { opacity: 0, filter: 'blur(4px)' };

            if (dir === 'up') { fromVars.y = 60; fromVars.rotateX = -4; }
            else if (dir === 'left') { fromVars.x = -60; fromVars.rotateY = 4; }
            else if (dir === 'right') { fromVars.x = 60; fromVars.rotateY = -4; }

            gsap.fromTo(card, fromVars, {
                opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)',
                duration: 0.7,
                delay: i * 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                }
            });
        });
    });

    // --- Skill tags staggered pop-in ---
    document.querySelectorAll('.skill-card').forEach(card => {
        const tags = card.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
            gsap.fromTo(tag,
                { opacity: 0, scale: 0.5, y: 10 },
                {
                    opacity: 1, scale: 1, y: 0,
                    duration: 0.3,
                    delay: i * 0.08,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
    });

    // --- Tech tags in projects/experience stagger ---
    document.querySelectorAll('.project-tech, .exp-tech').forEach(container => {
        const tags = container.querySelectorAll('.tech-tag');
        tags.forEach((tag, i) => {
            gsap.fromTo(tag,
                { opacity: 0, scale: 0.6 },
                {
                    opacity: 1, scale: 1,
                    duration: 0.25,
                    delay: i * 0.05,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
    });

    // --- Timeline line draw animation ---
    document.querySelectorAll('.exp-timeline-line, .ach-timeline-line').forEach(line => {
        gsap.fromTo(line,
            { scaleY: 0 },
            {
                scaleY: 1,
                transformOrigin: 'top',
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: line.parentElement,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // --- Timeline dots scale in ---
    gsap.utils.toArray('.exp-timeline-dot, .ach-timeline-dot, .timeline-dot').forEach((dot, i) => {
        gsap.fromTo(dot,
            { scale: 0, rotation: -180 },
            {
                scale: 1, rotation: 0,
                duration: 0.4,
                delay: i * 0.15,
                ease: 'back.out(3)',
                scrollTrigger: {
                    trigger: dot,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // --- Project images parallax zoom ---
    gsap.utils.toArray('.project-image img').forEach(img => {
        gsap.fromTo(img,
            { scale: 1.15 },
            {
                scale: 1,
                scrollTrigger: {
                    trigger: img.closest('.project-card'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            }
        );
    });

    // --- Parallax on hero photo rings ---
    gsap.utils.toArray('.hero-photo-ring').forEach((ring, i) => {
        gsap.to(ring, {
            y: -60 - i * 20,
            scrollTrigger: {
                trigger: '.section-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });

    // --- Hero photo parallax ---
    const heroPhoto = document.querySelector('.hero-photo-wrap');
    if (heroPhoto) {
        gsap.to(heroPhoto, {
            y: -40,
            scrollTrigger: {
                trigger: '.section-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }

    // --- Navbar scroll behavior ---
    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;
            if (self.direction === 1 && self.progress > 0) {
                navbar.classList.add('scrolled');
            }
            if (self.progress === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- Active nav link tracking ---
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 40%',
            end: 'bottom 40%',
            onEnter: () => updateNav(section.id),
            onEnterBack: () => updateNav(section.id),
        });
    });

    function updateNav(id) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
        });
    }

    // --- Section divider lines animate in ---
    gsap.utils.toArray('.section-divider').forEach(div => {
        gsap.fromTo(div,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: div,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // --- Interest cards rotate in from alternating sides ---
    const interestCards = document.querySelectorAll('.interest-card');
    interestCards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -30 : 30;
        gsap.fromTo(card,
            { opacity: 0, x: fromX, rotateZ: fromX > 0 ? 3 : -3 },
            {
                opacity: 1, x: 0, rotateZ: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // --- Research topics list stagger ---
    document.querySelectorAll('.research-card').forEach(card => {
        const items = card.querySelectorAll('.research-topics li');
        items.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -15 },
                {
                    opacity: 1, x: 0,
                    duration: 0.35,
                    delay: i * 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
    });

    // --- Resume download card entrance ---
    const resumeCard = document.querySelector('.resume-download-card');
    if (resumeCard) {
        gsap.fromTo(resumeCard,
            { opacity: 0, scale: 0.85, y: 40 },
            {
                opacity: 1, scale: 1, y: 0,
                duration: 0.8,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: resumeCard,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }

    // --- Contact form fields stagger ---
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, i) => {
        gsap.fromTo(group,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.4,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: group,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // --- Footer fade in ---
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(footer,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 95%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }
}

// --- Project Filter ---
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach((card, i) => {
                const cats = card.dataset.categories || '';
                if (filter === 'all' || cats.includes(filter)) {
                    card.classList.remove('hidden');
                    gsap.fromTo(card,
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(card, {
                        opacity: 0, scale: 0.9, duration: 0.3,
                        onComplete: () => card.classList.add('hidden')
                    });
                }
            });

            // Refresh ScrollTrigger after cards are hidden (0.3s duration + buffer)
            setTimeout(() => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 350);
        });
    });
}

// --- Project Modal ---
function initProjectModal() {
    const overlay = document.getElementById('projectModal');
    const body = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const cards = document.querySelectorAll('.project-card');
    let currentIndex = 0;

    if (!overlay || !body) return;

    function openModal(index) {
        currentIndex = index;
        const card = cards[index];
        if (!card) return;

        const clone = card.querySelector('.project-body').cloneNode(true);
        body.innerHTML = '';
        body.appendChild(clone);

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate modal content in
        gsap.fromTo(overlay.querySelector('.modal'),
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' }
        );
    }

    function closeModal() {
        gsap.to(overlay.querySelector('.modal'), {
            scale: 0.9, opacity: 0, duration: 0.25,
            onComplete: () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn')) return;
            openModal(i);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (overlay.classList.contains('active') && e.key === 'ArrowRight') navigateModal(1);
        if (overlay.classList.contains('active') && e.key === 'ArrowLeft') navigateModal(-1);
    });

    function navigateModal(dir) {
        const visibleCards = [...cards].filter(c => !c.classList.contains('hidden'));
        const idx = visibleCards.indexOf(cards[currentIndex]);
        const newIdx = (idx + dir + visibleCards.length) % visibleCards.length;
        currentIndex = [...cards].indexOf(visibleCards[newIdx]);
        openModal(currentIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1));
}
