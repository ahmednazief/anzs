/* ═══════════════════════════════════════════════════
   Cutify Page — Script v5.0
   Ahmed Nazif
═══════════════════════════════════════════════════ */

// Clean tracking parameters from URL
try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('fbclid')) {
        url.searchParams.delete('fbclid');
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }
} catch (e) {
    console.error(e);
}

document.addEventListener('DOMContentLoaded', () => {

    /* ── Footer year ── */
    const yr = document.getElementById('footYear');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ── Navbar scroll class ── */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ── Cursor glow ── */
    const glow = document.getElementById('cursorGlow');
    if (glow) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let cx = mx, cy = my;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        const animCursor = () => {
            cx += (mx - cx) * 0.08;
            cy += (my - cy) * 0.08;
            glow.style.left = cx + 'px';
            glow.style.top  = cy + 'px';
            requestAnimationFrame(animCursor);
        };
        animCursor();
    }

    /* ── Particle Canvas ── */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const COLORS = ['rgba(123,97,255,', 'rgba(0,245,255,', 'rgba(0,229,195,'];

        class Particle {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = Math.random() * W;
                this.y = initial ? Math.random() * H : H + 10;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedY = -(Math.random() * 0.4 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.alpha = 0;
                this.maxAlpha = Math.random() * 0.5 + 0.15;
                this.fadeIn = true;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.life = 0;
                this.maxLife = Math.random() * 300 + 200;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;
                if (this.fadeIn) {
                    this.alpha += 0.008;
                    if (this.alpha >= this.maxAlpha) this.fadeIn = false;
                } else {
                    this.alpha -= 0.003;
                }
                if (this.alpha <= 0 || this.life > this.maxLife || this.y < -10) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowColor = this.color + '0.8)';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        const drawParticles = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(drawParticles);
        };
        drawParticles();
    }

    /* ── Scroll Reveal ── */
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el, i) => {
        el.dataset.delay = (i % 4) * 80;
        revealObs.observe(el);
    });

    /* ── Stats Counter ── */
    const counters = document.querySelectorAll('.stat-num');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = 1400;
                const start = performance.now();
                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quad
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));

    /* ── Screenshot Tabs ── */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const stageImg = document.getElementById('stageImg');
    const stageLabel = document.getElementById('stageLabel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('tab-active'));
            btn.classList.add('tab-active');
            if (stageImg) {
                stageImg.style.opacity = '0';
                setTimeout(() => {
                    stageImg.src = btn.dataset.img;
                    stageImg.style.opacity = '1';
                }, 200);
            }
            if (stageLabel) stageLabel.textContent = btn.dataset.label;
        });
    });

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── Hero Preview image cycling ── */
    const previewImg = document.getElementById('previewImg');
    const previewImages = ['images/cutify_app1.png', 'images/cutify_app2.png'];
    if (previewImg) {
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % previewImages.length;
            previewImg.style.opacity = '0.4';
            setTimeout(() => {
                previewImg.src = previewImages[idx];
                previewImg.style.opacity = '1';
            }, 400);
        }, 5000);
        previewImg.style.transition = 'opacity 0.4s ease';
    }

    /* ── Pro Tour Modal & Slider ── */
    const proModal = document.getElementById('proModal');
    const tourTriggers = document.querySelectorAll('.btn-tour');
    const modalCloseBtn = document.querySelector('.modal-close');
    const slides = document.querySelectorAll('.modal-slide');
    const prevArrow = document.querySelector('.arrow-prev');
    const nextArrow = document.querySelector('.arrow-next');
    const dots = document.querySelectorAll('.slider-dot');

    if (proModal && slides.length > 0) {
        let currentSlide = 0;

        const showSlide = (idx) => {
            // Bounds/wrap-around
            if (idx < 0) idx = slides.length - 1;
            if (idx >= slides.length) idx = 0;
            currentSlide = idx;

            // Update active classes on slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('slide-active', i === currentSlide);
            });

            // Update active classes on dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('dot-active', i === currentSlide);
            });
        };

        const openModal = () => {
            proModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            showSlide(0); // always start at first slide
        };

        const closeModal = () => {
            proModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        // Open triggers
        tourTriggers.forEach(btn => btn.addEventListener('click', openModal));

        // Close triggers
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        proModal.addEventListener('click', (e) => {
            if (e.target === proModal) closeModal();
        });

        // Keyboard navigation (Escape, Left, Right)
        document.addEventListener('keydown', (e) => {
            if (!proModal.classList.contains('open')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
        });

        // Prev/Next buttons
        if (prevArrow) prevArrow.addEventListener('click', () => showSlide(currentSlide - 1));
        if (nextArrow) nextArrow.addEventListener('click', () => showSlide(currentSlide + 1));

        // Dot buttons
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showSlide(i));
        });
    }

    /* ── Installer Tab Toggle ── */
    const installTabFree = document.getElementById('installTabFree');
    const installTabPro = document.getElementById('installTabPro');
    const stepsFree = document.getElementById('stepsFree');
    const stepsPro = document.getElementById('stepsPro');

    if (installTabFree && installTabPro && stepsFree && stepsPro) {
        const toggleInstallTab = (type) => {
            if (type === 'free') {
                installTabFree.classList.add('tab-active');
                installTabPro.classList.remove('tab-active');
                stepsFree.style.display = 'flex';
                stepsPro.style.display = 'none';
            } else {
                installTabFree.classList.remove('tab-active');
                installTabPro.classList.add('tab-active');
                stepsFree.style.display = 'none';
                stepsPro.style.display = 'flex';
            }
        };

        installTabFree.addEventListener('click', () => toggleInstallTab('free'));
        installTabPro.addEventListener('click', () => toggleInstallTab('pro'));
    }

});

