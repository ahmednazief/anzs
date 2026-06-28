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

    /* ── Interactive SmartScreen replica expander ── */
    const ssReplica = document.getElementById('ssReplica');
    const ssMoreInfo = document.getElementById('ssMoreInfo');
    const stepLinkMoreInfo = document.getElementById('stepLinkMoreInfo');
    const ssRunBtn = document.getElementById('ssRunBtn');
    const ssCancelBtn = document.getElementById('ssCancelBtn');
    const ssCloseMockBtn = document.getElementById('ssCloseMockBtn');

    const expandSmartScreen = (e) => {
        if (e) e.preventDefault();
        if (ssReplica) ssReplica.classList.add('expanded');
    };

    if (ssMoreInfo) ssMoreInfo.addEventListener('click', expandSmartScreen);
    if (stepLinkMoreInfo) stepLinkMoreInfo.addEventListener('click', expandSmartScreen);

    // Close mock triggers redirect back to homepage
    const returnToHome = () => {
        window.location.href = "cuttify.html";
    };
    if (ssRunBtn) ssRunBtn.addEventListener('click', returnToHome);
    if (ssCancelBtn) ssCancelBtn.addEventListener('click', returnToHome);
    if (ssCloseMockBtn) ssCloseMockBtn.addEventListener('click', returnToHome);

});

