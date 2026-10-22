/* ═══════════════════════════════════════════════════
   Ahmed Nazif Portfolio — Script v5.0
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
    const yr = document.getElementById('ftYear');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ════════════════════════════════
       PRELOADER
    ════════════════════════════════ */
    const pl    = document.getElementById('preloader');
    const plBar = document.getElementById('plBar');
    const plPct = document.getElementById('plPct');
    let pct = 0;
    const plTick = setInterval(() => {
        pct += Math.random() * 18 + 4;
        if (pct >= 100) { pct = 100; clearInterval(plTick); }
        plBar.style.width = pct + '%';
        if (plPct) plPct.textContent = Math.floor(pct) + '%';
        if (pct === 100) setTimeout(() => pl.classList.add('hide'), 500);
    }, 80);

    /* ════════════════════════════════
       CUSTOM CURSOR
    ════════════════════════════════ */
    const cursor = document.getElementById('cursor');
    const dot    = document.getElementById('cursorDot');
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => { if (cursor) cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (cursor) cursor.style.opacity = '1'; });

    const animCursor = () => {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
        if (dot)    { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
        requestAnimationFrame(animCursor);
    };
    animCursor();

    document.querySelectorAll('a, button, .vc, .svc-card, .ac, .pf-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
    });

    /* ════════════════════════════════
       NAV
    ════════════════════════════════ */
    const nav     = document.getElementById('nav');
    const burger  = document.getElementById('navBurger');
    const mNav    = document.getElementById('mobileNav');
    const mnClose = document.getElementById('mnClose');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    burger && burger.addEventListener('click', () => mNav.classList.add('open'));
    mnClose && mnClose.addEventListener('click', () => mNav.classList.remove('open'));
    mNav.querySelectorAll('.mn-link').forEach(l => l.addEventListener('click', () => mNav.classList.remove('open')));

    /* ════════════════════════════════
       HERO PARTICLE CANVAS
    ════════════════════════════════ */
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const COLS = ['rgba(167,139,250,', 'rgba(56,189,248,', 'rgba(52,211,153,'];

        class Particle {
            constructor(init = false) {
                this.x = Math.random() * W;
                this.y = init ? Math.random() * H : H + 5;
                this.r = Math.random() * 1.2 + 0.2;
                this.vy = -(Math.random() * 0.35 + 0.08);
                this.vx = (Math.random() - 0.5) * 0.15;
                this.a = 0;
                this.maxA = Math.random() * 0.4 + 0.1;
                this.fading = false;
                this.col = COLS[Math.floor(Math.random() * COLS.length)];
                this.life = 0;
                this.maxLife = Math.random() * 400 + 200;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                if (!this.fading) {
                    this.a = Math.min(this.a + 0.005, this.maxA);
                    if (this.a >= this.maxA) this.fading = true;
                } else {
                    this.a = Math.max(this.a - 0.002, 0);
                }
                if (this.a <= 0 || this.life > this.maxLife || this.y < -10) {
                    this.x = Math.random() * W;
                    this.y = H + 5;
                    this.a = 0; this.fading = false; this.life = 0;
                    this.maxLife = Math.random() * 400 + 200;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.col + this.a + ')';
                ctx.shadowColor = this.col + '0.6)';
                ctx.shadowBlur = 5;
                ctx.fill();
            }
        }

        for (let i = 0; i < 90; i++) particles.push(new Particle(true));

        const drawCanvas = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(drawCanvas);
        };
        drawCanvas();
    }

    /* ════════════════════════════════
       LUT COMPARE SLIDER
    ════════════════════════════════ */
    const compare  = document.getElementById('pcCompare');
    const divider  = document.getElementById('pcDivider');
    const graded   = document.getElementById('pcGraded');

    if (compare && divider && graded) {
        let dragging = false;
        let pos = 50; // %

        const setPos = (x) => {
            const rect = compare.getBoundingClientRect();
            pos = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
            divider.style.left = pos + '%';
            graded.style.clipPath = `inset(0 0 0 ${pos}%)`;
        };

        setPos(compare.getBoundingClientRect().left + compare.offsetWidth * 0.5);

        compare.addEventListener('mousedown',  () => dragging = true);
        compare.addEventListener('touchstart', () => dragging = true, { passive: true });
        window.addEventListener('mouseup',   () => dragging = false);
        window.addEventListener('touchend',  () => dragging = false);

        window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
        window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });

        // Auto-animate when not interacting
        let autoDir = 1, autoPos = 50;
        setInterval(() => {
            if (!dragging) {
                autoPos += autoDir * 0.3;
                if (autoPos > 75 || autoPos < 25) autoDir *= -1;
                setPos(compare.getBoundingClientRect().left + compare.offsetWidth * (autoPos / 100));
            }
        }, 16);
    }

    /* ════════════════════════════════
       AOS (Animate On Scroll)
    ════════════════════════════════ */
    const aosEls = document.querySelectorAll('[data-aos]');
    const aosObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-visible');
                aosObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    aosEls.forEach(el => aosObs.observe(el));

    /* ════════════════════════════════
       STAT COUNTERS
    ════════════════════════════════ */
    const formatNum = (n) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000)    return (n / 1000).toFixed(0)   + 'K';
        return n.toString();
    };

    const counters = document.querySelectorAll('.sg-num[data-target]');
    const cntObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                const duration = 1600;
                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - t, 4);
                    el.textContent = prefix + formatNum(Math.round(eased * target)) + suffix;
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                cntObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => cntObs.observe(c));

    /* ════════════════════════════════
       HERO VIDEO CONTROLS (PLAY/PAUSE, SOUND, SEEKER)
    ════════════════════════════════ */
    const heroVideo         = document.getElementById('heroVideo');
    const heroFrame         = document.getElementById('heroFrame');
    const heroPlayPauseBtn  = document.getElementById('heroPlayPauseBtn');
    const heroPlayPauseIcon = document.getElementById('heroPlayPauseIcon');
    const heroPlayPauseText = document.getElementById('heroPlayPauseText');
    const heroCenterPlay    = document.getElementById('heroCenterPlay');
    const heroSoundBtn      = document.getElementById('heroSoundBtn');
    const heroSoundIcon     = document.getElementById('heroSoundIcon');
    const heroSoundText     = document.getElementById('heroSoundText');
    const heroFullBtn       = document.getElementById('heroFullBtn');
    const heroProg          = document.getElementById('heroProg');
    const heroSeeker        = document.getElementById('heroSeeker');

    const updatePlayState = (isPlaying) => {
        const isAr = document.documentElement.lang === 'ar';
        if (heroPlayPauseIcon) {
            heroPlayPauseIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
        if (heroPlayPauseText) {
            heroPlayPauseText.textContent = isPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تشغيل' : 'Play');
        }
        if (heroCenterPlay) {
            heroCenterPlay.classList.toggle('show', !isPlaying);
        }
        if (heroFrame) {
            heroFrame.classList.toggle('is-paused', !isPlaying);
        }
    };

    const toggleHeroPlay = () => {
        if (!heroVideo) return;
        if (heroVideo.paused) {
            heroVideo.play().then(() => updatePlayState(true)).catch(() => {});
        } else {
            heroVideo.pause();
            updatePlayState(false);
        }
    };

    if (heroVideo) {
        // Click video to toggle play/pause
        heroVideo.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHeroPlay();
        });

        // Dedicated play/pause button
        if (heroPlayPauseBtn) {
            heroPlayPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHeroPlay();
            });
        }

        // Center circle overlay click
        if (heroCenterPlay) {
            heroCenterPlay.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHeroPlay();
            });
        }

        // Live progress bar update
        if (heroProg) {
            heroVideo.addEventListener('timeupdate', () => {
                if (heroVideo.duration) {
                    const pct = (heroVideo.currentTime / heroVideo.duration) * 100;
                    heroProg.style.width = pct + '%';
                }
            });
        }

        // Click on seeker to scrub
        if (heroSeeker) {
            heroSeeker.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = heroSeeker.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (heroVideo.duration) {
                    heroVideo.currentTime = pos * heroVideo.duration;
                }
            });
        }

        // Sound toggle button
        if (heroSoundBtn) {
            heroSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                heroVideo.muted = !heroVideo.muted;
                const isAr = document.documentElement.lang === 'ar';
                if (heroVideo.muted) {
                    if (heroSoundIcon) heroSoundIcon.className = 'fa-solid fa-volume-xmark';
                    if (heroSoundText) heroSoundText.textContent = isAr ? 'الصوت' : 'Sound';
                } else {
                    if (heroSoundIcon) heroSoundIcon.className = 'fa-solid fa-volume-high';
                    if (heroSoundText) heroSoundText.textContent = isAr ? 'كتم' : 'Mute';
                }
            });
        }

        // Watch full project in cinema modal
        if (heroFullBtn) {
            heroFullBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const src = heroFullBtn.dataset.video || 'boise-renderhouse.mp4';
                openLB('video', src, { vertical: false });
            });
        }

        heroVideo.addEventListener('play', () => updatePlayState(true));
        heroVideo.addEventListener('pause', () => updatePlayState(false));
    }

    /* ════════════════════════════════
       VORAL VERTICAL SHORT REEL CONTROLS
    ════════════════════════════════ */
    const vcvVideo     = document.getElementById('vcvVideo');
    const vcvPlayBtn   = document.getElementById('vcvPlayBtn');
    const vcvSoundBtn  = document.getElementById('vcvSoundBtn');
    const vcvSoundIcon = document.getElementById('vcvSoundIcon');
    const vcvWatchBtn  = document.getElementById('vcvWatchBtn');
    const vcvWrap      = document.getElementById('vcvWrap');

    if (vcvVideo && vcvPlayBtn) {
        const toggleVcv = () => {
            if (vcvVideo.paused) {
                vcvVideo.play();
                vcvPlayBtn.style.opacity = '0';
            } else {
                vcvVideo.pause();
                vcvPlayBtn.style.opacity = '1';
            }
        };
        vcvPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleVcv(); });
        vcvWrap && vcvWrap.addEventListener('click', toggleVcv);

        if (vcvSoundBtn) {
            vcvSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                vcvVideo.muted = !vcvVideo.muted;
                if (vcvSoundIcon) {
                    vcvSoundIcon.className = vcvVideo.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
                }
            });
        }
    }

    if (vcvWatchBtn) {
        vcvWatchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLB('video', 'voral-reel.mp4', { vertical: true });
        });
    }

    /* ════════════════════════════════
       PORTFOLIO FILTER
    ════════════════════════════════ */
    const pfBtns   = document.querySelectorAll('.pf-btn');
    const allCards = document.querySelectorAll('.vc, .vc-spotlight, .vc-vertical-card');

    pfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pfBtns.forEach(b => b.classList.remove('pf-active'));
            btn.classList.add('pf-active');
            const filter = btn.dataset.filter;
            allCards.forEach(card => {
                const cat = card.dataset.cat;
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('filtered-out');
                    card.style.display = '';
                } else {
                    card.classList.add('filtered-out');
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ════════════════════════════════
       LIGHTBOX (ENHANCED FOR YOUTUBE & MP4)
    ════════════════════════════════ */
    const lb      = document.getElementById('lightbox');
    const lbBg    = document.getElementById('lbBg');
    const lbClose = document.getElementById('lbClose');
    const lbFrame = document.getElementById('lbFrame');
    const lbVideo = document.getElementById('lbVideo');
    const lbBox   = document.querySelector('.lb-box');

    const openLB = (type, src, options = {}) => {
        if (!lb) return;

        // Pause hero video to prevent overlapping audio
        if (heroVideo && !heroVideo.paused) {
            heroVideo.dataset.wasPlaying = 'true';
            heroVideo.pause();
        }

        if (type === 'youtube') {
            if (lbVideo) { lbVideo.style.display = 'none'; lbVideo.pause(); lbVideo.src = ''; }
            if (lbFrame) {
                lbFrame.style.display = 'block';
                lbFrame.src = `https://www.youtube.com/embed/${src}?autoplay=1&start=${options.start || 0}`;
            }
            if (lbBox) lbBox.classList.remove('is-vertical');
        } else if (type === 'video') {
            if (lbFrame) { lbFrame.style.display = 'none'; lbFrame.src = ''; }
            if (lbVideo) {
                lbVideo.style.display = 'block';
                lbVideo.src = src;
                lbVideo.currentTime = options.start || 0;
                lbVideo.play().catch(() => {});
            }
            if (lbBox) {
                if (options.vertical) {
                    lbBox.classList.add('is-vertical');
                } else {
                    lbBox.classList.remove('is-vertical');
                }
            }
        }

        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLB = () => {
        if (!lb) return;
        lb.classList.remove('open');
        if (lbFrame) { lbFrame.src = ''; lbFrame.style.display = 'none'; }
        if (lbVideo) { lbVideo.pause(); lbVideo.src = ''; lbVideo.style.display = 'none'; }
        if (lbBox) lbBox.classList.remove('is-vertical');
        document.body.style.overflow = '';

        // Resume hero video if it was playing
        if (heroVideo && heroVideo.dataset.wasPlaying === 'true') {
            heroVideo.play().catch(() => {});
            delete heroVideo.dataset.wasPlaying;
        }
    };

    // YouTube Card Clicks
    document.querySelectorAll('.vc[data-vid]').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('filtered-out')) return;
            const vid   = card.dataset.vid;
            const start = parseInt(card.dataset.start || '0', 10);
            if (vid) openLB('youtube', vid, { start });
        });
    });

    // Spotlight Local Video Clicks (Render House)
    document.querySelectorAll('.vc-spotlight[data-video]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (card.classList.contains('filtered-out')) return;
            const src = card.dataset.video;
            if (src) openLB('video', src, { vertical: false });
        });
    });

    lbBg    && lbBg.addEventListener('click',    closeLB);
    lbClose && lbClose.addEventListener('click', closeLB);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    /* ════════════════════════════════
       SMOOTH SCROLL
    ════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});

/* ════════════════════════════════
   CONTACT FORM WIZARD
════════════════════════════════ */
let cfData = { name: '', email: '', type: '', msg: '' };
let cfCurrent = 0;
const CF_TOTAL = 5;

function cfShowStep(n) {
    document.querySelectorAll('.cf-step').forEach(s => s.classList.remove('active'));
    const s = document.getElementById('cfs' + n);
    if (s) { s.classList.add('active'); }

    const pct = ((n + 1) / CF_TOTAL) * 100;
    const bar = document.getElementById('cfProgBar');
    if (bar) bar.style.width = pct + '%';

    // Auto-focus
    setTimeout(() => {
        const input = s && s.querySelector('input, textarea');
        if (input) input.focus();
    }, 50);
}

function cfNext(step) {
    if (step === 0) {
        const v = document.getElementById('cf-name').value.trim();
        if (!v) { document.getElementById('cf-name').focus(); return; }
        cfData.name = v;
        const echo = document.getElementById('cf-name-echo');
        if (echo) echo.textContent = v;
    } else if (step === 1) {
        const v = document.getElementById('cf-email').value.trim();
        if (!v || !v.includes('@')) { document.getElementById('cf-email').focus(); return; }
        cfData.email = v;
    } else if (step === 3) {
        cfData.msg = document.getElementById('cf-msg').value.trim();
        cfBuildSummary();
    }
    cfCurrent = step + 1;
    cfShowStep(cfCurrent);
}

function cfSelectType(btn) {
    document.querySelectorAll('.cft-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    cfData.type = btn.dataset.val;
    setTimeout(() => { cfCurrent = 3; cfShowStep(3); }, 280);
}

function cfSkip() {
    cfData.msg = '';
    cfBuildSummary();
    cfCurrent = 4;
    cfShowStep(4);
}

function cfBuildSummary() {
    const s = document.getElementById('cfSummary');
    if (!s) return;
    const isAr = document.documentElement.lang === 'ar';
    s.innerHTML = `
        <div><strong>${isAr ? 'الاسم:' : 'Name:'}</strong> ${cfData.name}</div>
        <div><strong>${isAr ? 'البريد الإلكتروني:' : 'Email:'}</strong> ${cfData.email}</div>
        <div><strong>${isAr ? 'نوع المشروع:' : 'Project:'}</strong> ${cfData.type || '—'}</div>
        ${cfData.msg ? `<div><strong>${isAr ? 'ملاحظات:' : 'Notes:'}</strong> ${cfData.msg}</div>` : ''}
    `;
}

function cfTransmit() {
    const isAr = document.documentElement.lang === 'ar';
    const subject = encodeURIComponent(isAr ? `طلب مشروع أحمد نظيف — ${cfData.type || 'استفسار'}` : `Ahmed Nazif Project Brief — ${cfData.type || 'Inquiry'}`);
    const body = encodeURIComponent(
        `${isAr ? 'الاسم' : 'Name'}: ${cfData.name}\n${isAr ? 'البريد الإلكتروني' : 'Email'}: ${cfData.email}\n${isAr ? 'المشروع' : 'Project'}: ${cfData.type}\n\n${cfData.msg}`
    );
    window.location.href = `mailto:contact@ahmednazif.com?subject=${subject}&body=${body}`;
    const sent = document.getElementById('cfSent');
    const launch = document.getElementById('cfLaunch');
    if (sent)   { sent.style.display   = 'flex'; }
    if (launch) { launch.style.display = 'none'; }
}

function cfRestart() {
    cfData = { name: '', email: '', type: '', msg: '' };
    cfCurrent = 0;
    document.getElementById('cf-name').value  = '';
    document.getElementById('cf-email').value = '';
    document.getElementById('cf-msg').value   = '';
    const sent = document.getElementById('cfSent');
    const launch = document.getElementById('cfLaunch');
    if (sent)   { sent.style.display   = 'none'; }
    if (launch) { launch.style.display = ''; }
    cfShowStep(0);
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const active = document.querySelector('.cf-step.active');
        if (!active) return;
        const btn = active.querySelector('.cf-next');
        if (btn) btn.click();
    });
});
