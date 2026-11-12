export function initAnnouncementBanner() {
    const track = document.querySelector('.announcement-track');
    const content = track?.querySelector('.announcement-content');
    if (!track || !content) return;

    // Constant reading speed whatever the amount of text
    const pixelsPerSecond = 55;
    track.style.animationDuration = `${Math.max(20, content.scrollWidth / pixelsPerSecond)}s`;
}
