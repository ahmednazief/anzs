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

    /* ── Pro Feature Navigator ── */
    const pfnItems = document.querySelectorAll('.pfn-item');
    const pfnPanels = document.querySelectorAll('.pfn-panel');

    if (pfnItems.length > 0 && pfnPanels.length > 0) {
        let activeFeat = 0;

        const showFeat = (idx) => {
            activeFeat = idx;

            pfnItems.forEach((item, i) => {
                item.classList.toggle('pfn-active', i === idx);
            });

            pfnPanels.forEach((panel, i) => {
                panel.classList.toggle('pfn-panel-active', i === idx);
            });
        };

        pfnItems.forEach((item, i) => {
            item.addEventListener('click', () => showFeat(i));
        });

        // Auto-rotate through features every 5 seconds (pause on hover)
        let autoFeatTimer;
        const pfnNav = document.querySelector('.pro-feature-nav');

        const startAutoRotate = () => {
            autoFeatTimer = setInterval(() => {
                showFeat((activeFeat + 1) % pfnItems.length);
            }, 5000);
        };

        const stopAutoRotate = () => clearInterval(autoFeatTimer);

        startAutoRotate();
        if (pfnNav) {
            pfnNav.addEventListener('mouseenter', stopAutoRotate);
            pfnNav.addEventListener('mouseleave', startAutoRotate);
        }
    }

    /* ── Installer Tab Toggle ── */
    const installTabFree = document.getElementById('installTabFree');
    const installTabPro  = document.getElementById('installTabPro');
    const stepsFree      = document.getElementById('stepsFree');
    const stepsPro       = document.getElementById('stepsPro');

    if (installTabFree && installTabPro && stepsFree && stepsPro) {
        const toggleInstallTab = (type) => {
            if (type === 'free') {
                installTabFree.classList.add('tab-active');
                installTabPro.classList.remove('tab-active');
                stepsFree.style.display = 'flex';
                stepsPro.style.display  = 'none';
            } else {
                installTabFree.classList.remove('tab-active');
                installTabPro.classList.add('tab-active');
                stepsFree.style.display = 'none';
                stepsPro.style.display  = 'flex';
            }
        };

        installTabFree.addEventListener('click', () => toggleInstallTab('free'));
        installTabPro.addEventListener('click',  () => toggleInstallTab('pro'));
    }

    /* ── Buy Pro button placeholder (link will be set once Payhip is live) ── */
    const buyProBtn = document.getElementById('buyProBtn');
    if (buyProBtn) {
        buyProBtn.addEventListener('click', (e) => {
            const href = buyProBtn.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                // Subtle shake + tooltip to indicate coming soon
                buyProBtn.style.animation = 'none';
                buyProBtn.offsetHeight; // reflow
                buyProBtn.style.animation = 'buyShake 0.4s ease';
            }
        });
    }

});

