export function initGallery() {
    const track = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    if (!track || !prevBtn || !nextBtn) return () => {};

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pixelsPerSecond = window.innerWidth <= 768 ? 90 : 60;

    let animationFrameId = null;
    let lastTime = null;
    let hoverPaused = false;
    let offscreen = false;
    let resumeTimer = null;
    let manualPaused = false;
    let scrollPosition = 0;
    let itemWidth = 0;
    let halfWidth = 0; // The track holds the images twice

    function updateDimensions() {
        const firstItem = track.querySelector('img');
        if (!firstItem) return;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        itemWidth = firstItem.offsetWidth + gap;
        halfWidth = (track.scrollWidth + gap) / 2;
    }

    function render() {
        track.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
    }

    function animate(time) {
        const paused = hoverPaused || manualPaused || offscreen || reducedMotion.matches;
        if (!paused && halfWidth > 0 && lastTime !== null) {
            const elapsed = Math.min(time - lastTime, 100);
            scrollPosition = (scrollPosition + (pixelsPerSecond * elapsed) / 1000) % halfWidth;
            render();
        }
        lastTime = time;
        animationFrameId = requestAnimationFrame(animate);
    }

    function step(direction) {
        if (halfWidth <= 0) return;
        manualPaused = true;
        scrollPosition = (scrollPosition + direction * itemWidth + halfWidth) % halfWidth;
        track.style.transition = reducedMotion.matches ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)';
        render();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            track.style.transition = '';
            manualPaused = false;
        }, 3000);
    }

    let resizeTimer;
    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateDimensions, 250);
    };

    const observer = new IntersectionObserver(([entry]) => {
        offscreen = !entry.isIntersecting;
    });
    observer.observe(track);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', updateDimensions, { once: true });
    track.addEventListener('mouseenter', () => { hoverPaused = true; });
    track.addEventListener('mouseleave', () => { hoverPaused = false; });
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));

    updateDimensions();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        clearTimeout(resumeTimer);
        clearTimeout(resizeTimer);
        observer.disconnect();
        window.removeEventListener('resize', onResize);
    };
}
