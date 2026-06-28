/* ==========================================================================
   Cuttify Page — Streamlined Logic
   Ahmed Nazif
   ========================================================================== */

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
    const updateScrollStates = () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateScrollStates, { passive: true });
    updateScrollStates();


    /* ── Floating Canvas Particles ── */
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
                this.speedY = -(Math.random() * 0.35 + 0.08);
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.alpha = 0;
                this.maxAlpha = Math.random() * 0.4 + 0.1;
                this.fadeIn = true;
                this.colorIdx = Math.floor(Math.random() * 3);
                this.life = 0;
                this.maxLife = Math.random() * 350 + 200;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;
                if (this.fadeIn) {
                    this.alpha += 0.008;
                    if (this.alpha >= this.maxAlpha) this.fadeIn = false;
                } else {
                    this.alpha -= 0.002;
                }
                if (this.alpha <= 0 || this.life > this.maxLife || this.y < -10) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                const baseColor = COLORS[this.colorIdx];
                ctx.fillStyle = baseColor + this.alpha + ')';
                ctx.shadowColor = baseColor + '0.6)';
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        const drawParticles = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(drawParticles);
        };
        drawParticles();
    }

    /* ── Smooth Scroll for Links ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── Hero Preview Image Cycling ── */
    const previewImg = document.getElementById('previewImg');
    const previewImages = ['images/remove-silences.png', 'images/simple-home-ui.png'];
    if (previewImg) {
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % previewImages.length;
            previewImg.style.opacity = '0.4';
            setTimeout(() => {
                previewImg.src = previewImages[idx];
                previewImg.style.opacity = '1';
            }, 400);
        }, 6000);
        previewImg.style.transition = 'opacity 0.4s ease';
    }

    /* ── Download Thank-You & SmartScreen Modal Handler ── */
    const heroDownloadBtn = document.getElementById('heroDownloadBtn');
    const downloadModal = document.getElementById('downloadModal');
    const modalCloseX = document.getElementById('modalCloseX');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const ssReplica = document.getElementById('ssReplica');
    const ssMoreInfo = document.getElementById('ssMoreInfo');
    const stepLinkMoreInfo = document.getElementById('stepLinkMoreInfo');
    const ssRunBtn = document.getElementById('ssRunBtn');
    const ssCancelBtn = document.getElementById('ssCancelBtn');
    const ssCloseMockBtn = document.getElementById('ssCloseMockBtn');

    if (heroDownloadBtn && downloadModal) {
        heroDownloadBtn.addEventListener('click', (e) => {
            // Let the download proceed naturally in the background, then show modal
            setTimeout(() => {
                downloadModal.classList.add('active');
                if (ssReplica) ssReplica.classList.remove('expanded');
            }, 150);
        });
    }

    const closeModal = () => {
        if (downloadModal) downloadModal.classList.remove('active');
    };

    if (modalCloseX) modalCloseX.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (ssRunBtn) ssRunBtn.addEventListener('click', closeModal);
    if (ssCancelBtn) ssCancelBtn.addEventListener('click', closeModal);
    if (ssCloseMockBtn) ssCloseMockBtn.addEventListener('click', closeModal);

    const expandSmartScreen = (e) => {
        if (e) e.preventDefault();
        if (ssReplica) ssReplica.classList.add('expanded');
    };

    if (ssMoreInfo) ssMoreInfo.addEventListener('click', expandSmartScreen);
    if (stepLinkMoreInfo) stepLinkMoreInfo.addEventListener('click', expandSmartScreen);

});

