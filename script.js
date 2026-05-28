/* =====================================================
   ANZS — Ahmed Nazif Solutions | Premium JS Engine
   ===================================================== */

// ===== PRELOADER =====
const preloader        = document.getElementById('preloader');
const preloaderBar     = document.getElementById('preloaderBar');
const preloaderPercent = document.getElementById('preloaderPercent');

let pVal = 0;
const pStep = 20;
const pIncr = 100 / (1800 / pStep);

const pTimer = setInterval(() => {
    pVal += pIncr + Math.random() * 1.8;
    if (pVal >= 100) {
        pVal = 100;
        clearInterval(pTimer);
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => { preloader.style.display = 'none'; }, 900);
            }
        }, 300);
    }
    const floored = Math.floor(pVal);
    if (preloaderPercent) preloaderPercent.textContent = (floored < 10 ? '0' : '') + floored + '%';
    if (preloaderBar) preloaderBar.style.width = floored + '%';
}, pStep);


// ===== NODE MESH CANVAS =====
const meshCanvas = document.getElementById('meshCanvas');
// Only run canvas if not on a very low-end device/tiny screen or scale particles
if (meshCanvas) {
    const ctx = meshCanvas.getContext('2d');
    let particles = [];
    let W = (meshCanvas.width  = window.innerWidth);
    let H = (meshCanvas.height = window.innerHeight);
    const MAX_P = window.innerWidth > 768 ? 70 : 25; // Drastically reduce on mobile
    let mouse = { x: null, y: null, r: 150 };

    window.addEventListener('resize', () => {
        W = meshCanvas.width  = window.innerWidth;
        H = meshCanvas.height = window.innerHeight;
    });

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', ()  => { mouse.x = null; mouse.y = null; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r  = Math.random() * 1.8 + 0.8;
            this.color = Math.random() > 0.5 ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 215, 0, 0.5)';
        }
        update() {
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.r) {
                    let f = (mouse.r - dist) / mouse.r * 0.07;
                    this.vx += (dx / dist) * f;
                    this.vy += (dy / dist) * f;
                }
            }
            const lim = 0.75;
            this.vx = Math.max(-lim, Math.min(lim, this.vx));
            this.vy = Math.max(-lim, Math.min(lim, this.vy));
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < MAX_P; i++) particles.push(new Particle());

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx   = particles[i].x - particles[j].x;
                let dy   = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    let alpha = (110 - dist) / 110 * 0.10;
                    ctx.strokeStyle = particles[i].color.replace('0.5', alpha);
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateMesh() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => p.update());
        connect();
        requestAnimationFrame(animateMesh);
    }
    animateMesh();
}


// ===== AURORA PARALLAX =====
const a1 = document.getElementById('aurora1');
const a2 = document.getElementById('aurora2');
const a3 = document.getElementById('aurora3');
document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) * 0.04;
    const dy = (e.clientY - cy) * 0.04;
    if (a1) a1.style.transform = `translate(${dx * 0.7}px, ${dy * 0.7}px)`;
    if (a2) a2.style.transform = `translate(${-dx * 0.5}px, ${-dy * 0.5}px)`;
    if (a3) a3.style.transform = `translate(${dx * 0.3}px, ${-dy * 0.3}px)`;
});


// ===== WEB AUDIO SYNTHESIZER =====
let audioCtx   = null;
let soundOn    = true;
const soundBtn = document.getElementById('soundToggle');

if (soundBtn) {
    soundBtn.addEventListener('click', e => {
        e.stopPropagation();
        soundOn = !soundOn;
        soundBtn.classList.toggle('muted', !soundOn);
        soundBtn.querySelector('i').className = soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        playUI('toggle');
    });
}

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playUI(type) {
    if (!soundOn) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;

        const presets = {
            click: () => {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1100, t);
                osc.frequency.exponentialRampToValueAtTime(120, t + 0.06);
                gain.gain.setValueAtTime(0.05, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
                osc.start(t); osc.stop(t + 0.08);
            },
            hover: () => {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(820, t);
                gain.gain.setValueAtTime(0.012, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
                osc.start(t); osc.stop(t + 0.04);
            },
            toggle: () => {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(380, t);
                osc.frequency.exponentialRampToValueAtTime(760, t + 0.14);
                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
                osc.start(t); osc.stop(t + 0.17);
            },
            success: () => {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, t);
                osc.frequency.setValueAtTime(1040, t + 0.09);
                gain.gain.setValueAtTime(0.06, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
                osc.start(t); osc.stop(t + 0.3);
            },
            keychar: () => {
                // Subtle high-frequency telemetry blip for typing
                osc.type = 'square';
                const freq = 1800 + Math.random() * 400;
                osc.frequency.setValueAtTime(freq, t);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.018);
                gain.gain.setValueAtTime(0.008, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
                osc.start(t); osc.stop(t + 0.025);
            }
        };
        if (presets[type]) presets[type]();
    } catch (e) { /* silent */ }
}


// ===== CUSTOM CURSOR =====
const cursorDot     = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let mX = 0, mY = 0, oX = 0, oY = 0;

if (window.innerWidth > 768 && cursorDot && cursorOutline) {
    document.addEventListener('mousemove', e => {
        mX = e.clientX; mY = e.clientY;
        cursorDot.style.left = mX + 'px';
        cursorDot.style.top  = mY + 'px';
    });

    (function moveCursor() {
        oX += (mX - oX) * 0.14;
        oY += (mY - oY) * 0.14;
        cursorOutline.style.left = oX + 'px';
        cursorOutline.style.top  = oY + 'px';
        requestAnimationFrame(moveCursor);
    })();

    const hoverEls = document.querySelectorAll(
        'a, button, .svc-card, .video-card, .about-card, .tl-item, .channel-card, input, textarea'
    );
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playUI('hover');
            cursorDot.style.width     = '11px';
            cursorDot.style.height    = '11px';
            cursorOutline.style.width  = '62px';
            cursorOutline.style.height = '62px';

            const isGold = el.classList.contains('btn-gold') || el.classList.contains('about-card');
            if (isGold) {
                cursorOutline.style.borderColor = 'var(--gold)';
                cursorOutline.style.boxShadow   = '0 0 18px var(--gold-glow)';
                cursorDot.style.background      = 'var(--gold)';
            } else {
                cursorOutline.style.borderColor = 'var(--cyan)';
                cursorOutline.style.boxShadow   = '0 0 18px var(--cyan-glow)';
                cursorDot.style.background      = 'var(--cyan)';
            }
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.width      = '7px';
            cursorDot.style.height     = '7px';
            cursorDot.style.background = 'var(--gold)';
            cursorOutline.style.width  = '42px';
            cursorOutline.style.height = '42px';
            cursorOutline.style.borderColor = 'rgba(0, 229, 255, 0.5)';
            cursorOutline.style.boxShadow   = '0 0 12px rgba(0, 229, 255, 0.1)';
        });
    });
}


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
}


// ===== MOBILE MENU =====
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMenu() {
    playUI('click');
    mobileMenu.classList.add('open');
    if (hamburger) hamburger.style.opacity = '0';
    if (hamburger) hamburger.style.pointerEvents = 'none';
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    if (hamburger) hamburger.style.opacity = '1';
    if (hamburger) hamburger.style.pointerEvents = 'auto';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            playUI('click');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => revealObs.observe(el));


// ===== 3D CARD TILT =====
function addTilt(selector, intensity = 7) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = ((y - rect.height / 2) / rect.height) * -intensity;
            const ry = ((x - rect.width  / 2) / rect.width)  *  intensity;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
addTilt('.video-card', 5);
addTilt('.svc-card', 6);
addTilt('.about-card', 5);
addTilt('.tl-item', 4);
addTilt('.channel-card', 3);


// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');

const secObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                const active = link.getAttribute('href') === `#${id}`;
                link.style.color       = active ? 'var(--cyan)'             : '';
                link.style.textShadow  = active ? '0 0 12px var(--cyan-glow)' : '';
            });
        }
    });
}, { threshold: 0.42 });

sections.forEach(s => secObs.observe(s));


// ===== VIDEO LIGHTBOX =====
const lightbox        = document.getElementById('videoLightbox');
const lightboxIframe  = document.getElementById('lightboxIframe');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
        playUI('click');
        const vid   = card.getAttribute('data-video-id');
        const start = card.getAttribute('data-start-time');
        let url = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
        if (start) url += `&start=${start}`;
        if (lightboxIframe) lightboxIframe.src = url;
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (cursorOutline) cursorOutline.style.opacity = '0';
    });
});

function closeLightbox() {
    if (!lightbox) return;
    playUI('click');
    lightbox.classList.remove('active');
    if (lightboxIframe) lightboxIframe.src = '';
    document.body.style.overflow = '';
    if (cursorOutline) cursorOutline.style.opacity = '1';
}

if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


// ===== CONTACT WIZARD ENGINE =====
const wizState = { name: '', email: '', type: '', message: '' };
let wizCurrentStep = 0;

function wizGoTo(stepIndex) {
    const current = document.getElementById('step' + wizCurrentStep);
    const next    = document.getElementById('step' + stepIndex);
    if (!next) return;

    // Animate out current
    if (current) {
        current.classList.add('exiting');
        setTimeout(() => {
            current.classList.remove('active', 'exiting');
        }, 300);
    }

    // Animate in next
    setTimeout(() => {
        next.classList.add('active');
        // Auto-focus input if present
        const inp = next.querySelector('.wiz-input');
        if (inp) setTimeout(() => inp.focus(), 80);
    }, 280);

    wizCurrentStep = stepIndex;

    // Update progress dots (only count steps 0-3)
    const dots = document.querySelectorAll('.wiz-dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        const s = parseInt(d.dataset.step);
        if (s < stepIndex && stepIndex <= 4) d.classList.add('done');
        if (s === Math.min(stepIndex, 3))     d.classList.add('active');
    });

    // Update counter
    const counter = document.getElementById('wizCounter');
    if (counter && stepIndex < 4) {
        counter.textContent = String(stepIndex + 1).padStart(2,'0') + ' / 04';
    } else if (counter) {
        counter.textContent = 'READY';
    }
}

function wizNext(step) {
    if (step === 0) {
        const val = document.getElementById('wiz-name').value.trim();
        if (!val) { shakeInput('wiz-name'); return; }
        wizState.name = val;
        document.getElementById('wiz-name-echo').textContent = val.split(' ')[0];
        playUI('click');
        wizGoTo(1);
    } else if (step === 1) {
        const val = document.getElementById('wiz-email').value.trim();
        if (!val || !val.includes('@')) { shakeInput('wiz-email'); return; }
        wizState.email = val;
        playUI('click');
        wizGoTo(2);
    } else if (step === 3) {
        wizState.message = document.getElementById('wiz-message').value.trim();
        playUI('click');
        wizShowSummary();
    }
}

function wizSkip() {
    wizState.message = '';
    playUI('hover');
    wizShowSummary();
}

function wizSelectCard(btn) {
    document.querySelectorAll('.wiz-card').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    wizState.type = btn.dataset.value;
    playUI('success');
    // Auto-advance after brief delay so selection is visible
    setTimeout(() => wizGoTo(3), 420);
}

function wizShowSummary() {
    const s = wizState;
    const summary = document.getElementById('wizSummary');
    summary.innerHTML = `
        <div class="wiz-summary-row"><span class="wiz-summary-label">ID_TAG</span><span class="wiz-summary-val">${s.name}</span></div>
        <div class="wiz-summary-row"><span class="wiz-summary-label">NET_ADDR</span><span class="wiz-summary-val">${s.email}</span></div>
        <div class="wiz-summary-row"><span class="wiz-summary-label">MISSION</span><span class="wiz-summary-val">${s.type || 'Not specified'}</span></div>
        ${s.message ? `<div class="wiz-summary-row"><span class="wiz-summary-label">PARAMS</span><span class="wiz-summary-val">${s.message}</span></div>` : ''}
    `;
    wizGoTo(4);
}

function wizTransmit() {
    const s = wizState;
    const btn = document.getElementById('wizLaunch');
    btn.innerHTML = '<span>TRANSMITTING...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
    btn.disabled = true;
    playUI('success');

    setTimeout(() => {
        const sub  = encodeURIComponent(`[${s.type || 'Project'}] Brief from ${s.name}`);
        const body = encodeURIComponent(`Name: ${s.name}\nEmail: ${s.email}\nProject: ${s.type || 'N/A'}\n\n${s.message}`);
        window.location.href = `mailto:ahmednazief@gmail.com?subject=${sub}&body=${body}`;

        btn.innerHTML = '<span>TRANSMIT</span> <i class="fa-solid fa-paper-plane"></i>';
        btn.disabled = false;
        const sent = document.getElementById('wizSent');
        sent.style.display = 'flex';
        setTimeout(() => { sent.style.display = 'none'; }, 7000);
    }, 900);
}

function wizRestart() {
    wizState.name = ''; wizState.email = ''; wizState.type = ''; wizState.message = '';
    // Reset all steps
    document.querySelectorAll('.wiz-step').forEach(s => s.classList.remove('active','exiting'));
    document.querySelectorAll('.wiz-card').forEach(c => c.classList.remove('selected'));
    ['wiz-name','wiz-email','wiz-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    wizCurrentStep = 0;
    document.getElementById('step0').classList.add('active');
    const dots = document.querySelectorAll('.wiz-dot');
    dots.forEach((d, i) => { d.classList.remove('active','done'); if (i===0) d.classList.add('active'); });
    const counter = document.getElementById('wizCounter');
    if (counter) counter.textContent = '01 / 04';
    playUI('toggle');
}

function shakeInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderBottomColor = '#ff4444';
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.35s ease';
    setTimeout(() => {
        el.style.borderBottomColor = '';
        el.style.animation = '';
    }, 400);
    el.focus();
    playUI('hover');
}

// Enter key support for wizard text inputs
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const tag = document.activeElement.tagName;
    if (tag === 'TEXTAREA') return; // Allow Enter in textarea
    if (document.activeElement.id === 'wiz-name')  wizNext(0);
    if (document.activeElement.id === 'wiz-email') wizNext(1);
});

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
    0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);

// Typing telemetry for wizard inputs
let keycharThrottle = 0;
document.querySelectorAll('.wiz-input').forEach(input => {
    input.addEventListener('keydown', e => {
        if (e.key.length === 1) {
            const now = Date.now();
            if (now - keycharThrottle > 40) { keycharThrottle = now; playUI('keychar'); }
        }
    });
    input.addEventListener('focus', () => playUI('hover'));
});


// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ===== NAVBAR BUTTON CLICK SOUNDS =====
document.querySelectorAll('a[href^="#"], button').forEach(el => {
    el.addEventListener('click', () => playUI('click'));
});


// ===== VOID CINEMA — RED PARTICLES =====
// Override particle colors to red/orange palette
if (typeof Particle !== 'undefined') {
    // Patch the Particle reset to use red colors
    const origReset = Particle.prototype.reset;
    Particle.prototype.reset = function() {
        origReset.call(this);
        this.color = Math.random() > 0.5
            ? 'rgba(255, 31, 31, 0.45)'
            : 'rgba(255, 122, 0, 0.35)';
    };
}


// ===== GLITCH TEXT REVEAL =====
function glitchReveal(el) {
    if (!el) return;
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&';
    let frame = 0;
    const totalFrames = 28;
    const interval = setInterval(() => {
        frame++;
        let result = '';
        for (let i = 0; i < original.length; i++) {
            if (original[i] === ' ') { result += ' '; continue; }
            const progress = frame / totalFrames;
            const charProgress = i / original.length;
            if (charProgress < progress) {
                result += original[i];
            } else {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        el.textContent = result;
        if (frame >= totalFrames) {
            el.textContent = original;
            clearInterval(interval);
        }
    }, 45);
}

// Trigger glitch on hero heading after preloader
setTimeout(() => {
    const heroLine = document.querySelector('.hero-line-bottom');
    if (heroLine) glitchReveal(heroLine);
}, 2200);


// ===== TYPEWRITER TAGLINE =====
function typeWriter(el, text, speed = 28) {
    if (!el) return;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            el.insertBefore(document.createTextNode(text[i]), cursor);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => cursor.remove(), 2000);
        }
    }, speed);
}

setTimeout(() => {
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        const text = tagline.textContent;
        typeWriter(tagline, text, 22);
    }
}, 2800);


// ===== ODOMETER COUNTERS (Retention Section) =====
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0','') + 'M';
    if (n >= 1000) return Math.round(n / 1000) + 'K';
    return n.toString();
}

function animateCounter(el, target, duration = 1800) {
    const countEl = el.querySelector('.ret-count');
    if (!countEl) return;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(easeOut(progress) * target);
        countEl.textContent = formatNumber(current);
        if (progress < 1) requestAnimationFrame(update);
        else countEl.textContent = formatNumber(target);
    }
    requestAnimationFrame(update);
}

const retStats = document.querySelectorAll('.ret-stat');
if (retStats.length) {
    const retObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.ret-number');
                if (numEl && !numEl.dataset.animated) {
                    numEl.dataset.animated = '1';
                    const target = parseInt(numEl.dataset.target);
                    animateCounter(entry.target, target);
                }
            }
        });
    }, { threshold: 0.3 });
    retStats.forEach(s => retObserver.observe(s));
}


// ===== PORTFOLIO FILTER BAR =====
const filterBtns = document.querySelectorAll('.pf-filter-btn');
const videoCards = document.querySelectorAll('.video-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        playUI('click');

        videoCards.forEach(card => {
            const cat = card.dataset.category || '';
            if (filter === 'all' || cat === filter) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});


// ===== BRANDING CARD 3D TILT =====
document.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
    });
    // Open lightbox on brand card click
    card.addEventListener('click', () => {
        const img = card.querySelector('.brand-visual img');
        if (!img || !window.openLightboxImage) return;
    });
});


// ===== SOUND VISUALIZER =====
const soundViz = document.getElementById('soundViz');
const soundToggleBtn = document.getElementById('soundToggle');

function updateSoundViz() {
    if (!soundViz) return;
    // soundEnabled is defined in the sound system above
    const isOn = typeof soundEnabled !== 'undefined' ? soundEnabled : true;
    if (isOn) {
        soundViz.classList.remove('off');
    } else {
        soundViz.classList.add('off');
    }
}

// Patch sound toggle to also update visualizer
if (soundToggleBtn) {
    const origHandler = soundToggleBtn.onclick;
    soundToggleBtn.addEventListener('click', () => {
        setTimeout(updateSoundViz, 50);
    });
}
// Initial state
setTimeout(updateSoundViz, 100);


// ===== TIMELINE SCROLL FILL =====
const tlConnector = document.querySelector('.tl-connector');
if (tlConnector) {
    // Inject fill element
    const fill = document.createElement('div');
    fill.className = 'tl-connector-fill';
    tlConnector.style.position = 'relative';
    tlConnector.appendChild(fill);

    const nodes = document.querySelectorAll('.tl-node');

    window.addEventListener('scroll', () => {
        const rect = tlConnector.getBoundingClientRect();
        const totalH = tlConnector.offsetHeight;
        const visible = window.innerHeight - rect.top;
        const pct = Math.max(0, Math.min(100, (visible / totalH) * 100));
        fill.style.height = pct + '%';

        // Pulse nodes as fill reaches them
        nodes.forEach((node, i) => {
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top < window.innerHeight * 0.75) {
                node.classList.add('node-active');
            }
        });
    }, { passive: true });
}

