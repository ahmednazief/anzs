/* ═══════════════════════════════════════════════════
   Ahmed Nazif Portfolio — Script v7.5
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
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    if (burger && mNav) burger.addEventListener('click', () => mNav.classList.add('open'));
    if (mnClose && mNav) mnClose.addEventListener('click', () => mNav.classList.remove('open'));
    if (mNav) {
        mNav.querySelectorAll('.mn-link').forEach(l => l.addEventListener('click', () => mNav.classList.remove('open')));
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
       POLISHED CINEMA VIDEO CONTROLLER
    ════════════════════════════════ */
    const heroVideo        = document.getElementById('heroVideo');
    const heroFrame        = document.getElementById('heroFrame');
    const heroPlayPauseBtn = document.getElementById('heroPlayPauseBtn');
    const heroPlayPauseIcon= document.getElementById('heroPlayPauseIcon');
    const heroCenterPlay   = document.getElementById('heroCenterPlay');
    const heroRipple       = document.getElementById('heroRipple');
    const heroRippleIcon   = document.getElementById('heroRippleIcon');
    const heroSoundBtn     = document.getElementById('heroSoundBtn');
    const heroSoundIcon    = document.getElementById('heroSoundIcon');
    const heroVolSlider    = document.getElementById('heroVolSlider');
    const heroCurTime      = document.getElementById('heroCurTime');
    const heroDurTime      = document.getElementById('heroDurTime');
    const heroSeeker       = document.getElementById('heroSeeker');
    const heroSeekerTrack  = document.getElementById('heroSeekerTrack');
    const heroProg         = document.getElementById('heroProg');
    const heroBuffer       = document.getElementById('heroBuffer');
    const heroSeekerTip    = document.getElementById('heroSeekerTip');
    const heroFsBtn        = document.getElementById('heroFsBtn');
    const heroFsIcon       = document.getElementById('heroFsIcon');
    const heroFullBtn      = document.getElementById('heroFullBtn');

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

        if (heroFullBtn) {
            heroFullBtn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

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
    // 1. Direct Copy Link Buttons for Uploaded Portfolio Videos
    const copyToast = document.getElementById('copyToast');
    const copyToastText = document.getElementById('copyToastText');
    let toastTimer = null;
    const isAr = document.documentElement.lang === 'ar';

    const buildShareUrl = (slug) => {
        const origin = (window.location.origin && window.location.origin !== 'null')
            ? window.location.origin
            : 'https://ahmednazif.com';
        if (origin.includes('ahmednazif.com')) {
            return `${origin}/${slug}`;
        }
        return `${origin}/${slug}.html`;
    };

    const copyText = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            resolve();
        });
    };

    document.querySelectorAll('[data-copy-slug]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const slug = btn.dataset.copySlug || 'boise';
            const url = buildShareUrl(slug);
            const icon = btn.querySelector('i');
            const label = btn.querySelector('span');
            const origText = label ? label.textContent : '';

            copyText(url).then(() => {
                btn.classList.add('copied');
                if (icon) icon.className = 'fa-solid fa-check';
                if (label) label.textContent = isAr ? 'تم النسخ!' : 'Copied!';

                if (copyToast && copyToastText) {
                    copyToastText.textContent = isAr
                        ? `تم نسخ الرابط: ${url}`
                        : `Link copied: ${url}`;
                    copyToast.classList.add('show');
                    clearTimeout(toastTimer);
                    toastTimer = setTimeout(() => copyToast.classList.remove('show'), 2600);
                }

                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (icon) icon.className = 'fa-solid fa-link';
                    if (label) label.textContent = origText;
                }, 2200);
            });
        });
    });

    // 2. Voral Media 9:16 Vertical Reel Card
    const vcvVideo       = document.getElementById('vcvVideo');
    const vcvWrap        = document.getElementById('vcvWrap');
    const vcvPlayOverlay = document.getElementById('vcvPlayOverlay');
    const vcvSoundBtn    = document.getElementById('vcvSoundBtn');
    const vcvSoundIcon   = document.getElementById('vcvSoundIcon');

    if (vcvVideo && vcvWrap) {
        const updateVcvSoundIcon = () => {
            if (vcvSoundIcon) {
                vcvSoundIcon.className = vcvVideo.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
            }
        };

        const toggleVcv = () => {
            if (vcvVideo.paused) {
                // Pause hero video so audio doesn't clash
                if (heroVideo && !heroVideo.paused) heroVideo.pause();
                vcvVideo.play().then(() => {
                    if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '0';
                    updateVcvSoundIcon();
                }).catch(() => {});
            } else {
                vcvVideo.pause();
                if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '1';
            }
        };

        vcvWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('#vcvSoundBtn')) return;
            toggleVcv();
        });

        if (vcvSoundBtn) {
            vcvSoundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                vcvVideo.muted = !vcvVideo.muted;
                updateVcvSoundIcon();
            });
        }

        vcvVideo.addEventListener('play', () => {
            if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '0';
            updateVcvSoundIcon();
        });
        vcvVideo.addEventListener('pause', () => {
            if (vcvPlayOverlay) vcvPlayOverlay.style.opacity = '1';
        });
    }

    /* ════════════════════════════════
       PORTFOLIO FILTER
    ════════════════════════════════ */
    const pfBtns       = document.querySelectorAll('.pf-btn');
    const featuredGrid = document.querySelector('.work-grid-featured');
    const ytGrid       = document.getElementById('videoGrid');
    const allCards     = document.querySelectorAll('.vc, .vc-spotlight');

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

            if (featuredGrid) {
                if (filter === 'youtube') {
                    featuredGrid.style.display = 'none';
                } else if (filter === 'commercial' || filter === 'shorts') {
                    featuredGrid.style.display = 'grid';
                    featuredGrid.style.gridTemplateColumns = '1fr';
                    featuredGrid.style.justifyItems = 'center';
                } else {
                    featuredGrid.style.display = '';
                    featuredGrid.style.gridTemplateColumns = '';
                    featuredGrid.style.justifyItems = '';
                }
            }

            if (ytGrid) {
                const showYt = (filter === 'all' || filter === 'youtube');
                ytGrid.style.display = showYt ? '' : 'none';
                document.querySelectorAll('.creator-samples-header, .portfolio-disclaimer, .work-cta').forEach(el => {
                    el.style.display = showYt ? '' : 'none';
                });
            }
        });
    });

    /* ════════════════════════════════
       LIGHTBOX (YOUTUBE & MP4)
    ════════════════════════════════ */
    const lb      = document.getElementById('lightbox');
    const lbBg    = document.getElementById('lbBg');
    const lbClose = document.getElementById('lbClose');
    const lbFrame = document.getElementById('lbFrame');
    const lbVideo = document.getElementById('lbVideo');
    const lbBox   = document.querySelector('.lb-box');

    const openLB = (type, src, options = {}) => {
        if (!lb) return;

        // Pause inline videos to prevent overlapping audio
        if (heroVideo && !heroVideo.paused) {
            heroVideo.dataset.wasPlaying = 'true';
            heroVideo.pause();
        }
        if (vcvVideo && !vcvVideo.paused) {
            vcvVideo.pause();
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
                lbBox.classList.toggle('is-vertical', !!options.vertical);
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

    if (lbBg)    lbBg.addEventListener('click', closeLB);
    if (lbClose) lbClose.addEventListener('click', closeLB);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

    /* ════════════════════════════════
       SMOOTH SCROLL
    ════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
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
    if (s) s.classList.add('active');

    const pct = ((n + 1) / CF_TOTAL) * 100;
    const bar = document.getElementById('cfProgBar');
    if (bar) bar.style.width = pct + '%';

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
    setTimeout(() => { cfCurrent = 3; cfShowStep(3); }, 250);
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
    if (sent)   sent.style.display   = 'flex';
    if (launch) launch.style.display = 'none';
}

function cfRestart() {
    cfData = { name: '', email: '', type: '', msg: '' };
    cfCurrent = 0;
    document.getElementById('cf-name').value  = '';
    document.getElementById('cf-email').value = '';
    document.getElementById('cf-msg').value   = '';
    const sent = document.getElementById('cfSent');
    const launch = document.getElementById('cfLaunch');
    if (sent)   sent.style.display   = 'none';
    if (launch) launch.style.display = '';
    cfShowStep(0);
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA') return;
        const active = document.querySelector('.cf-step.active');
        if (!active) return;
        const btn = active.querySelector('.cf-next');
        if (btn) btn.click();
    });
});
