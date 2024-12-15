export function initAnnouncementBanner() {
    const track = document.querySelector('.animate-scroll');
    
    // Use the Page Visibility API efficiently
    let visibilityHandler = () => {
        if (track) {
            track.style.animationPlayState = document.hidden ? 'paused' : 'running';
        }
    };

    // Use passive event listener to improve performance
    document.addEventListener('visibilitychange', visibilityHandler, { passive: true });
}

// Initialize when the module is imported
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        initAnnouncementBanner();
    });
} else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(initAnnouncementBanner, 0);
} 