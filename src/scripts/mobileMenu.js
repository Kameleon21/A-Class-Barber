export function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuToggle || !mobileMenu) return;

    let closeTimer;

    function openMenu() {
        clearTimeout(closeTimer);
        mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('translate-x-full');
                menuToggle.classList.add('open');
            });
        });
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.add('translate-x-full');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        closeTimer = setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    menuToggle.addEventListener('click', () => {
        if (menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            menuToggle.focus();
        }
    });
}
