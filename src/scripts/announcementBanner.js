export function initAnnouncementBanner() {
    const content = document.querySelector('.announcement-content');
    if (!content) return;

    // Calculate total width to adjust animation duration
    const totalWidth = content.scrollWidth;
    const duration = Math.max(20, totalWidth / 100); // Adjust speed based on content width
    content.style.animationDuration = `${duration}s`;
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