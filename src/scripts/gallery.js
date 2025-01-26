export function initGallery() {
    const track = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    if (!track || !prevBtn || !nextBtn) return;

    let animationFrameId = null;
    let isPaused = false;
    let scrollPosition = 0;
    let itemWidth = 0;
    let gap = 24;
    let speed = window.innerWidth <= 768 ? 1.5 : 1; // Reduced speed for both mobile and desktop
    let halfWidth = 0; // The track width is doubled, so halfWidth = total width / 2

    function updateDimensions() {
        const firstItem = track.querySelector('img');
        if (firstItem) {
            itemWidth = firstItem.offsetWidth + gap;
            const totalContentWidth = track.scrollWidth;
            halfWidth = totalContentWidth / 2; 
        }
    }

    function animate() {
        if (!isPaused) {
            scrollPosition += speed;
            // Loop around seamlessly using modulo
            scrollPosition = scrollPosition % halfWidth;
            track.style.transform = `translateX(-${scrollPosition}px)`;
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedUpdateDimensions = debounce(() => {
        updateDimensions();
    }, 250);

    window.addEventListener('resize', debouncedUpdateDimensions, { passive: true });

    track.addEventListener('mouseenter', () => { isPaused = true; }, { passive: true });
    track.addEventListener('mouseleave', () => { isPaused = false; }, { passive: true });

    prevBtn.addEventListener('click', () => {
        isPaused = true;
        // Move back by one itemWidth and wrap around using modulo
        scrollPosition = (scrollPosition - itemWidth + halfWidth) % halfWidth;
        track.style.transform = `translateX(-${scrollPosition}px)`;
        // Resume animation after 3 seconds
        setTimeout(() => {
            isPaused = false;
        }, 3000);
    });

    nextBtn.addEventListener('click', () => {
        isPaused = true;
        // Move forward by one itemWidth and wrap around using modulo
        scrollPosition = (scrollPosition + itemWidth) % halfWidth;
        track.style.transform = `translateX(-${scrollPosition}px)`;
        // Resume animation after 3 seconds
        setTimeout(() => {
            isPaused = false;
        }, 3000);
    });

    // Initialize
    updateDimensions();
    animate();

    // Cleanup function
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', debouncedUpdateDimensions);
    };
}