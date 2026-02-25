(function () {
    var swipers = [];
    var BREAKPOINT = 1000;

    function initSwipers() {
        var containers = document.querySelectorAll('.grid-swiper');
        if (!containers.length) return;
        containers.forEach(function (el) {
            if (el.swiper) return;
            el.classList.add('is-swiper');
            var swiper = new Swiper(el, {
                slidesPerView: 'auto',
                spaceBetween: 12,
                loop: false,
            });
            el.swiper = swiper;
            swipers.push(swiper);
        });
    }

    function destroySwipers() {
        document.querySelectorAll('.grid-swiper').forEach(function (el) {
            el.classList.remove('is-swiper');
        });
        swipers.forEach(function (swiper) {
            swiper.destroy(true, true);
        });
        swipers = [];
        document.querySelectorAll('.grid-swiper').forEach(function (el) {
            el.swiper = null;
        });
    }

    function handleBreakpoint(e) {
        if (e.matches) {
            initSwipers();
        } else {
            destroySwipers();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var mql = window.matchMedia('(max-width: ' + BREAKPOINT + 'px)');
        mql.addEventListener('change', handleBreakpoint);
        handleBreakpoint(mql);
    });
})();
