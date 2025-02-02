export function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle?.addEventListener('click', () => {
        const isOpen = menuToggle.classList.contains('open');
        
        if (!isOpen) {
            // Opening the menu
            mobileMenu?.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu?.classList.remove('translate-x-full');
                menuToggle.classList.add('open');
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            // Closing the menu
            mobileMenu?.classList.add('translate-x-full');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileMenu?.classList.add('hidden');
            }, 300);
        }
    });

    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('translate-x-full');
            menuToggle?.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileMenu?.classList.add('hidden');
            }, 300);
        });
    });
} 