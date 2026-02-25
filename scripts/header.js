(function () {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.header__nav');
    const menuBtn = document.querySelector('.menu_btn');
    const SCROLL_THRESHOLD = 100;
    const MOBILE_BREAKPOINT = 1000;

    let lastScrollY = window.scrollY || 0;
    let ticking = false;

    function isMobile() {
        return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    }

    function toggleNoScroll(isOpen) {
        document.documentElement.classList.toggle('no-scrolled', isOpen);
        document.body.classList.toggle('no-scrolled', isOpen);
    }

    function updateMenuBtnState() {
        menuBtn.classList.toggle('is-open', isMobile() && !nav.classList.contains('is-novisible'));
    }

    function updateHeader() {
        const scrollY = window.scrollY;

        // is-scrolled: от 100px и ниже
        if (scrollY >= SCROLL_THRESHOLD) {
            header.classList.add('is-scrolled');
            // На десктопе: при скролле вниз — скрывать, вверх — показывать
            if (!isMobile()) {
                if (scrollY > lastScrollY) {
                    nav.classList.add('is-novisible');
                } else {
                    nav.classList.remove('is-novisible');
                }
            }
        } else {
            header.classList.remove('is-scrolled');
            if (!isMobile()) nav.classList.remove('is-novisible');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // Hover только на десктопе
    header.addEventListener('mouseenter', () => {
        if (!isMobile()) nav.classList.remove('is-novisible');
    });

    // На мобильных: показ навигации только по клику на menu_btn
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('is-novisible');
        if (isMobile()) toggleNoScroll(!nav.classList.contains('is-novisible'));
        updateMenuBtnState();
    });

    // Закрытие меню по клику на ссылку в навигации
    nav.addEventListener('click', (e) => {
        if (isMobile() && e.target.closest('a')) {
            nav.classList.add('is-novisible');
            toggleNoScroll(false);
            updateMenuBtnState();
        }
    });

    // Закрытие меню по клику вне nav и кнопки
    document.addEventListener('click', (e) => {
        if (isMobile() && !nav.classList.contains('is-novisible') &&
            !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.add('is-novisible');
            toggleNoScroll(false);
            updateMenuBtnState();
        }
    });

    // На мобильных nav скрыта по умолчанию
    function initMobileNav() {
        if (isMobile()) {
            nav.classList.add('is-novisible');
            toggleNoScroll(false);
        } else {
            toggleNoScroll(false);
        }
        updateMenuBtnState();
    }
    initMobileNav();

    updateHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        initMobileNav();
        updateHeader();
    });
})();
