/**
 * Модальные окна: кнопки с data-modal-btn открывают модалку с data-modal-id
 * Закрытие: клик по оверлею, Escape, кнопка data-close-modal
 */

document.addEventListener('DOMContentLoaded', () => {
    const modalButtons = document.querySelectorAll('[data-modal-btn]');
    const modals = document.querySelectorAll('[data-modal-id]');

    function openModal(modalId) {
        const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
        if (!modal) return;
        modal.classList.add('is-open');
        document.documentElement.classList.add('no-scrolled');
        document.body.classList.add('no-scrolled');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal(modalId) {
        const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
        if (!modal) return;
        modal.classList.remove('is-open');
        const hasOpenModal = document.querySelector('[data-modal-id].is-open');
        if (!hasOpenModal) {
            document.documentElement.classList.remove('no-scrolled');
            document.body.classList.remove('no-scrolled');
        }
        modal.setAttribute('aria-hidden', 'true');
        modal.querySelectorAll('.form_popup_container').forEach((container) => {
            if (typeof window.resetFormPopup === 'function') window.resetFormPopup(container);
        });
    }

    modalButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal-btn');
            if (modalId) openModal(modalId);
        });
    });

    modals.forEach((modal) => {
        modal.setAttribute('aria-hidden', 'true');

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const modalId = modal.getAttribute('data-modal-id');
                if (modalId) closeModal(modalId);
            }
            const closeBtn = e.target.closest('[data-close-modal]');
            if (closeBtn) {
                e.preventDefault();
                const modalId = modal.getAttribute('data-modal-id');
                if (modalId) closeModal(modalId);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModalEl = document.querySelector('[data-modal-id].is-open');
            if (openModalEl) {
                const modalId = openModalEl.getAttribute('data-modal-id');
                if (modalId) closeModal(modalId);
            }
        }
    });
});
