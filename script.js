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
    const s = hamburger.querySelectorAll('span');
    s[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
    s[1].style.opacity   = '0';
    s[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    const s = hamburger.querySelectorAll('span');
    s[0].style.transform = '';
    s[1].style.opacity   = '';
    s[2].style.transform = '';
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


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        playUI('success');
        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) return;

        submitBtn.innerHTML = '<span>Deploying Brief...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
        submitBtn.disabled  = true;

        setTimeout(() => {
            const sub  = encodeURIComponent(document.getElementById('subject').value || 'Editing Inquiry from ' + name);
            const body = encodeURIComponent(`Creator: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:ahmednazief@gmail.com?subject=${sub}&body=${body}`;

            submitBtn.innerHTML = '<span>Deploy Message</span> <i class="fa-solid fa-paper-plane"></i>';
            submitBtn.disabled  = false;
            formSuccess.style.display = 'flex';
            contactForm.reset();
            setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
        }, 900);
    });
}


// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ===== NAVBAR BUTTON CLICK SOUNDS =====
document.querySelectorAll('a[href^="#"], button').forEach(el => {
    el.addEventListener('click', () => playUI('click'));
});
