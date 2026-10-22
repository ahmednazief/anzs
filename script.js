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
       POLISHED CINEMA VIDEO CONTROLLER
    ════════════════════════════════ */
    const heroVideo       = document.getElementById('heroVideo');
    const heroFrame       = document.getElementById('heroFrame');
    const heroControls    = document.getElementById('heroControls');
    const heroPlayPauseBtn= document.getElementById('heroPlayPauseBtn');
    const heroPlayPauseIcon=document.getElementById('heroPlayPauseIcon');
    const heroCenterPlay  = document.getElementById('heroCenterPlay');
    const heroRipple      = document.getElementById('heroRipple');
    const heroRippleIcon  = document.getElementById('heroRippleIcon');
    const heroSoundBtn    = document.getElementById('heroSoundBtn');
    const heroSoundIcon   = document.getElementById('heroSoundIcon');
    const heroVolSlider   = document.getElementById('heroVolSlider');
    const heroVolWrap     = document.getElementById('heroVolWrap');
    const heroCurTime     = document.getElementById('heroCurTime');
    const heroDurTime     = document.getElementById('heroDurTime');
    const heroSeeker      = document.getElementById('heroSeeker');
    const heroSeekerTrack = document.getElementById('heroSeekerTrack');
    const heroProg        = document.getElementById('heroProg');
    const heroBuffer      = document.getElementById('heroBuffer');
    const heroSeekerTip   = document.getElementById('heroSeekerTip');
    const heroFsBtn       = document.getElementById('heroFsBtn');
    const heroFsIcon      = document.getElementById('heroFsIcon');
    const heroFullBtn     = document.getElementById('heroFullBtn');

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    };

    if (heroVideo && heroFrame) {
        let isDraggingSeeker = false;
        let controlsTimer = null;
        let lastVolume = 0.85;

        // Auto-hide controls
        const resetControlsTimer = () => {
            heroFrame.classList.remove('controls-hidden');
            clearTimeout(controlsTimer);
            if (!heroVideo.paused) {
                controlsTimer = setTimeout(() => {
                    if (!isDraggingSeeker && !heroVideo.paused) {
                        heroFrame.classList.add('controls-hidden');
                    }
                }, 2800);
            }
        };

        heroFrame.addEventListener('mousemove', resetControlsTimer);
        heroFrame.addEventListener('mouseenter', resetControlsTimer);
        heroFrame.addEventListener('mouseleave', () => {
            if (!heroVideo.paused && !isDraggingSeeker) {
                heroFrame.classList.add('controls-hidden');
            }
        });

        // Visual feedback ripple in center
        const triggerRipple = (isPlay) => {
            if (!heroRipple || !heroRippleIcon) return;
            heroRippleIcon.className = isPlay ? 'fa-solid fa-play' : 'fa-solid fa-pause';
            heroRipple.classList.remove('animate');
            void heroRipple.offsetWidth;
            heroRipple.classList.add('animate');
        };

        const updatePlayState = (isPlaying) => {
            if (heroPlayPauseIcon) {
                heroPlayPauseIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
            }
            if (heroCenterPlay) {
                heroCenterPlay.classList.toggle('show', !isPlaying);
            }
            heroFrame.classList.toggle('is-paused', !isPlaying);
            if (!isPlaying) {
                heroFrame.classList.remove('controls-hidden');
                clearTimeout(controlsTimer);
            } else {
                resetControlsTimer();
            }
        };

        const toggleHeroPlay = () => {
            if (heroVideo.paused) {
                heroVideo.play().then(() => {
                    updatePlayState(true);
                    triggerRipple(true);
                }).catch(() => {});
            } else {
                heroVideo.pause();
                updatePlayState(false);
                triggerRipple(false);
            }
        };

        // Frame / Center / Button click listeners
        heroVideo.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHeroPlay();
        });

        if (heroPlayPauseBtn) {
            heroPlayPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHeroPlay();
            });
        }

        if (heroCenterPlay) {
            heroCenterPlay.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHeroPlay();
            });
        }

        // Time updates & Buffer
        heroVideo.addEventListener('timeupdate', () => {
            if (!isDraggingSeeker && heroVideo.duration) {
                const pct = (heroVideo.currentTime / heroVideo.duration) * 100;
                if (heroProg) heroProg.style.width = pct + '%';
                if (heroCurTime) heroCurTime.textContent = formatTime(heroVideo.currentTime);
                if (heroSeeker) heroSeeker.setAttribute('aria-valuenow', Math.round(pct));
            }
        });

        heroVideo.addEventListener('loadedmetadata', () => {
            if (heroDurTime) heroDurTime.textContent = formatTime(heroVideo.duration || 218);
        });

        heroVideo.addEventListener('progress', () => {
            if (heroVideo.buffered.length > 0 && heroVideo.duration) {
                const end = heroVideo.buffered.end(heroVideo.buffered.length - 1);
                const bufPct = (end / heroVideo.duration) * 100;
                if (heroBuffer) heroBuffer.style.width = Math.min(100, bufPct) + '%';
            }
        });

        // High precision seeker with hover tooltip & drag scrubbing
        const seekByClientX = (clientX) => {
            if (!heroSeekerTrack) return;
            const rect = heroSeekerTrack.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            if (heroProg) heroProg.style.width = (pos * 100) + '%';
            if (heroVideo.duration) {
                heroVideo.currentTime = pos * heroVideo.duration;
                if (heroCurTime) heroCurTime.textContent = formatTime(heroVideo.currentTime);
            }
        };

        if (heroSeeker && heroSeekerTrack) {
            heroSeeker.addEventListener('mousemove', (e) => {
                const rect = heroSeekerTrack.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const hoverSec = (heroVideo.duration || 218) * pos;
                if (heroSeekerTip) {
                    heroSeekerTip.textContent = formatTime(hoverSec);
                    heroSeekerTip.style.left = (pos * 100) + '%';
                    heroSeekerTip.classList.add('visible');
                }
            });

            heroSeeker.addEventListener('mouseleave', () => {
                if (heroSeekerTip) heroSeekerTip.classList.remove('visible');
            });

            heroSeeker.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDraggingSeeker = true;
                seekByClientX(e.clientX);
            });

            window.addEventListener('mousemove', (e) => {
                if (isDraggingSeeker) seekByClientX(e.clientX);
            });

            window.addEventListener('mouseup', () => {
                if (isDraggingSeeker) {
                    isDraggingSeeker = false;
                    resetControlsTimer();
                }
            });
        }

        // Volume slider & mute control
        const updateVolUI = (vol, isMuted) => {
            if (heroVolSlider) heroVolSlider.value = isMuted ? 0 : vol;
            if (heroSoundIcon) {
                if (isMuted || vol === 0) {
                    heroSoundIcon.className = 'fa-solid fa-volume-xmark';
                } else if (vol < 0.5) {
                    heroSoundIcon.className = 'fa-solid fa-volume-low';
                } else {
                    heroSoundIcon.className = 'fa-solid fa-volume-high';
                }
            }
        };

        if (heroVolSlider) {
            heroVolSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                heroVideo.volume = val;
                heroVideo.muted = (val === 0);
                if (val > 0) lastVolume = val;
                updateVolUI(val, heroVideo.muted);
                resetControlsTimer();
            });
        }

        if (heroSoundBtn) {
            heroSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                heroVideo.muted = !heroVideo.muted;
                if (!heroVideo.muted && heroVideo.volume === 0) {
                    heroVideo.volume = lastVolume || 0.85;
                }
                updateVolUI(heroVideo.volume, heroVideo.muted);
                resetControlsTimer();
            });
        }

        // Fullscreen Toggle
        const toggleFullscreen = () => {
            if (!document.fullscreenElement) {
                if (heroFrame.requestFullscreen) {
                    heroFrame.requestFullscreen().catch(() => {});
                } else if (heroFrame.webkitRequestFullscreen) {
                    heroFrame.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            }
        };

        if (heroFsBtn) {
            heroFsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFullscreen();
            });
        }

        document.addEventListener('fullscreenchange', () => {
            const isFs = !!document.fullscreenElement;
            if (heroFsIcon) heroFsIcon.className = isFs ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
            heroFrame.classList.toggle('is-fullscreen', isFs);
        });

        // Full Project in Cinema Modal
        if (heroFullBtn) {
            heroFullBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const src = heroFullBtn.dataset.video || 'boise-renderhouse.mp4';
                openLB('video', src, { vertical: false });
            });
        }

        // Keyboard navigation for video
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            const rect = heroFrame.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            if (e.code === 'Space') {
                e.preventDefault();
                toggleHeroPlay();
            } else if (e.code === 'KeyM') {
                e.preventDefault();
                if (heroSoundBtn) heroSoundBtn.click();
            } else if (e.code === 'KeyF') {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                heroVideo.currentTime = Math.max(0, heroVideo.currentTime - 5);
                resetControlsTimer();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                heroVideo.currentTime = Math.min(heroVideo.duration || 9999, heroVideo.currentTime + 5);
                resetControlsTimer();
            }
        });

        heroVideo.addEventListener('play', () => updatePlayState(true));
        heroVideo.addEventListener('pause', () => updatePlayState(false));
    }
    /* ════════════════════════════════
       WORK SECTION FEATURED CONTROLS
    ════════════════════════════════ */
    // 1. Render House Commercial Card
    const vcsBoiseThumb = document.getElementById('vcsBoiseThumb');
    const vcsWatchBtn   = document.getElementById('vcsWatchBtn');
    const openBoiseFilm = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openLB('video', 'boise-renderhouse.mp4', { vertical: false });
    };
    vcsBoiseThumb && vcsBoiseThumb.addEventListener('click', openBoiseFilm);
    vcsWatchBtn && vcsWatchBtn.addEventListener('click', openBoiseFilm);

    // 2. Voral Media 9:16 Vertical Reel Card
    const vcvVideo       = document.getElementById('vcvVideo');
    const vcvWrap        = document.getElementById('vcvWrap');
    const vcvPlayOverlay = document.getElementById('vcvPlayOverlay');
    const vcvSoundBtn    = document.getElementById('vcvSoundBtn');
    const vcvSoundIcon   = document.getElementById('vcvSoundIcon');

    if (vcvVideo && vcvWrap) {
        const toggleVcv = () => {
            if (vcvVideo.paused) {
                vcvVideo.play().then(() => {
                    if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '0';
                }).catch(() => {});
            } else {
                vcvVideo.pause();
                if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '1';
            }
        };

        vcvWrap.addEventListener('click', (e) => {
            // don't toggle if clicking sound button
            if (e.target.closest('#vcvSoundBtn')) return;
            toggleVcv();
        });

        if (vcvSoundBtn) {
            vcvSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                vcvVideo.muted = !vcvVideo.muted;
                if (vcvSoundIcon) {
                    vcvSoundIcon.className = vcvVideo.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
                }
            });
        }

        vcvVideo.addEventListener('play', () => {
            if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '0';
        });
        vcvVideo.addEventListener('pause', () => {
            if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '1';
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

    // Spotlight Local Video Clicks (Render House & Voral Media)
    document.querySelectorAll('.vc-spotlight[data-video]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (card.classList.contains('filtered-out')) return;
            if (e.target.closest('button') || e.target.closest('a')) return;
            const src = card.dataset.video;
            const isVert = card.classList.contains('vc-vertical-spotlight');
            if (src) openLB('video', src, { vertical: isVert });
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
