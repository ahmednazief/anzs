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

