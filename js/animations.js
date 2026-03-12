/* ===================================================
   ANIMATIONS.JS — Entry Animations & Interactive Effects
   =================================================== */

// --- Hero Particle Network ---
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const particleCount = 80;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2.5 + 0.5;
            this.baseAlpha = Math.random() * 0.4 + 0.2;
            this.alpha = this.baseAlpha;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x += dx * 0.02;
                    this.y += dy * 0.02;
                    this.alpha = Math.min(1, this.baseAlpha + (1 - dist / 150) * 0.5);
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = 0.15 * (1 - dist / 130);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // Connect to mouse
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 78, 80, ${0.2 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Hero Text Split Animation ---
function initHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.3 });

    // Split hero name into chars
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.innerHTML = text.split('').map(char =>
            char === ' ' ? '<span class="char">&nbsp;</span>' :
            `<span class="char">${char}</span>`
        ).join('');

        tl.fromTo('.hero-name .char',
            { opacity: 0, y: 40, rotateX: -90 },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.08,
                stagger: 0.025,
                ease: 'back.out(1.5)'
            }
        );
    }

    // Sequence the rest with varied effects
    const fadeEls = document.querySelectorAll('.section-hero .anim-fade-up');
    fadeEls.forEach((el, i) => {
        tl.fromTo(el,
            { opacity: 0, y: 25, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
            `-=${i === 0 ? 0 : 0.35}`
        );
    });

    // Animate hero photo with scale and blur
    const photoWrap = document.querySelector('.hero-photo-wrap');
    if (photoWrap) {
        tl.fromTo(photoWrap,
            { scale: 0.5, opacity: 0, rotate: -10 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.3)' },
            '-=1.2'
        );
    }

    // Animate rings
    const rings = document.querySelectorAll('.hero-photo-ring');
    rings.forEach((ring, i) => {
        tl.fromTo(ring,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
            `-=${0.6 - i * 0.1}`
        );
    });
}

// --- Typewriter Effect ---
function initTypewriter() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';

    let i = 0;
    function type() {
        if (i < text.length) {
            tagline.textContent = text.substring(0, i + 1);
            tagline.appendChild(cursor);
            i++;
            setTimeout(type, 25 + Math.random() * 35);
        } else {
            // Remove cursor after a delay
            setTimeout(() => cursor.remove(), 2500);
        }
    }

    // Wait for hero animation to mostly complete
    setTimeout(type, 1800);
}

// --- Cursor Glow ---
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    function tick() {
        cx += (mx - cx) * 0.06;
        cy += (my - cy) * 0.06;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(tick);
    }
    tick();
}

// --- 3D Tilt Effect for Cards ---
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// --- Tilt on All Hoverable Cards ---
function initCardTilt() {
    const cards = document.querySelectorAll('.interest-card, .skill-card, .research-card, .contact-card, .ach-card-inner, .exp-card-inner, .resume-download-card');
    cards.forEach(card => {
        // Add shine overlay
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotX = (y - 0.5) * -6;
            const rotY = (x - 0.5) * 6;

            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

            // Move shine
            const shinePosX = x * 100;
            const shinePosY = y * 100;
            shine.style.background = `radial-gradient(circle at ${shinePosX}% ${shinePosY}%, rgba(255,255,255,0.08), transparent 60%)`;
            shine.style.opacity = '1';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            shine.style.opacity = '0';
        });
    });
}

// --- Magnetic Buttons ---
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('btn-magnetic');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// --- Preloader ---
function initPreloader() {
    return new Promise((resolve) => {
        const preloader = document.getElementById('preloader');
        const progress = document.querySelector('.preloader-progress');
        if (!preloader || !progress) { resolve(); return; }

        let w = 0;
        const interval = setInterval(() => {
            w += Math.random() * 20 + 10;
            if (w > 100) w = 100;
            progress.style.width = w + '%';
            if (w >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    gsap.to(preloader, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            resolve();
                        }
                    });
                }, 200);
            }
        }, 80);
    });
}

// --- Button Ripple ---
function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// --- Scroll Progress Bar ---
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (window.scrollY / maxScroll) * 100;
        bar.style.width = pct + '%';
    });
}

// --- Parallax on Scroll for Various Elements ---
function initParallaxElements() {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            if (heroVisual) heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    });
}
