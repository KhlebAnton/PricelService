/**
 * Маска телефона +7 999 999-99-99
 * При неполном номере при blur — очистка поля
 * Валидация форм с классом is-error для незаполненных полей
 */

const PHONE_PATTERN = /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/;
const PHONE_PREFIX = '+7 ';

function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    const digitsOnly = digits.startsWith('7') ? digits.slice(1) : digits;
    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 3) {
        return PHONE_PREFIX + digitsOnly;
    }
    if (digitsOnly.length <= 6) {
        return PHONE_PREFIX + digitsOnly.slice(0, 3) + ' ' + digitsOnly.slice(3);
    }
    return PHONE_PREFIX +
        digitsOnly.slice(0, 3) + ' ' +
        digitsOnly.slice(3, 6) + '-' +
        digitsOnly.slice(6, 8) + '-' +
        digitsOnly.slice(8, 10);
}

function isPhoneComplete(value) {
    return PHONE_PATTERN.test(value.replace(/\s/g, ' ').trim());
}

function initPhoneMask(input) {
    input.addEventListener('input', (e) => {
        const start = e.target.selectionStart;
        const oldLen = e.target.value.length;
        const formatted = formatPhone(e.target.value);
        e.target.value = formatted;
        const newLen = formatted.length;
        const newPos = Math.max(0, start + (newLen - oldLen));
        e.target.setSelectionRange(newPos, newPos);
        removeError(input);
    });

    input.addEventListener('focus', (e) => {
        if (!e.target.value) {
            e.target.value = PHONE_PREFIX;
            e.target.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length);
        }
    });

    input.addEventListener('blur', (e) => {
        const val = e.target.value.trim();
        if (val && !isPhoneComplete(val)) {
            e.target.value = '';
        } else if (val === PHONE_PREFIX || val === '+7') {
            e.target.value = '';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === PHONE_PREFIX) {
            e.preventDefault();
        }
    });
}

function addError(input) {
    input.classList.add('is-error');
}

function removeError(input) {
    input.classList.remove('is-error');
}

function validateInput(input) {
    const isPhone = input.type === 'tel' || (input.name === 'phone' && input.type === 'text');
    let isEmpty = !input.value.trim();
    if (isPhone && input.value) {
        isEmpty = !isPhoneComplete(input.value);
    }
    if (isEmpty && input.hasAttribute('required')) {
        addError(input);
        return false;
    }
    removeError(input);
    return true;
}

const FORM_POPUP_TITLE_SUCCESS = 'Спасибо за заявку!';
const FORM_POPUP_TEXT_SUCCESS = 'В ближайшее время с вами свяжется наш специалист';

function showFormSuccess(container) {
    const title = container.querySelector('.form_popup_title');
    const text = container.querySelector('.form_popup_text');
    if (title) title.textContent = FORM_POPUP_TITLE_SUCCESS;
    if (text) text.textContent = FORM_POPUP_TEXT_SUCCESS;
    container.classList.add('is-success');
}

function resetFormPopup(container) {
    setTimeout(()=> {
        const title = container.querySelector('.form_popup_title');
        const text = container.querySelector('.form_popup_text');
        const form = container?.querySelector('.form_popup');
        const titleDefault = container?.dataset?.formTitleDefault ?? 'Бесплатная консультация';
        const textDefault = container?.dataset?.formTextDefault ?? '';
        if (title) title.textContent = titleDefault;
        if (text) text.textContent = textDefault;
        container.classList.remove('is-success');
        if (form) form.reset();

    }, 300)
 
}
window.resetFormPopup = resetFormPopup;

function initFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], input[type="tel"], input[name="phone"]');
    inputs.forEach((input) => {
        input.addEventListener('input', () => removeError(input));
        input.addEventListener('focus', () => removeError(input));
    });

    form.addEventListener('submit', (e) => {
        let isValid = true;
        inputs.forEach((input) => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        if (!isValid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            const container = form.closest('.form_popup_container');
            if (container) showFormSuccess(container);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="phone"], input[type="tel"]').forEach((input) => {
        initPhoneMask(input);
    });
    document.querySelectorAll('form').forEach((form) => {
        initFormValidation(form);
    });
});
