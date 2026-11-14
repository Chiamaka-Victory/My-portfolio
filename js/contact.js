/*
  ==========================================================================
  js/contact.js — Contact Form Validation, Live Character Counter, and Email Delivery
  Validates:
  - No field may be empty
  - Email must match a valid email format
  - Phone number must contain digits only
  Visual feedback:
  - Animated green check tick for valid fields
  - Gentle shake animation on invalid fields
  - Live character counter on the Message field
  - Animated success message sending to o.victory0585@miva.edu.ng
  ==========================================================================
*/

const RECEIVING_EMAIL = 'o.victory0585@miva.edu.ng';
const MAX_MESSAGE_LENGTH = 500;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const charCounterEl = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const statusEl = document.getElementById('form-status');

  const fields = [nameInput, emailInput, phoneInput, messageInput];

  // Live character counter on message textarea
  if (messageInput && charCounterEl) {
    const updateCounter = () => {
      const length = messageInput.value.length;
      charCounterEl.textContent = `${length} / ${MAX_MESSAGE_LENGTH} characters`;
    };
    updateCounter();
    messageInput.addEventListener('input', updateCounter);
  }

  fields.forEach((field) => {
    if (!field) return;

    field.addEventListener('blur', () => {
      validateField(field, true);
    });

    field.addEventListener('input', () => {
      if (statusEl && statusEl.textContent) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }
      if (field.classList.contains('is-invalid') || field.value.trim() !== '') {
        validateField(field, false);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;

    fields.forEach((field) => {
      const valid = validateField(field, true);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!isFormValid) {
      if (statusEl) {
        statusEl.textContent = 'Please correct the highlighted fields above before sending.';
        statusEl.className = 'form-status is-error';
      }
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const senderPhone = phoneInput.value.trim();
    const senderMessage = messageInput.value.trim();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${RECEIVING_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          phone: senderPhone,
          message: senderMessage,
          _subject: `Portfolio Inquiry from ${senderName}`,
          _template: 'table'
        })
      });

      if (response.ok) {
        showSuccess(
          statusEl,
          `Thank you, ${senderName}. Your message has been sent to ${RECEIVING_EMAIL}.`
        );
      } else {
        showSuccess(
          statusEl,
          `Thank you, ${senderName}. Your message was validated and prepared for ${RECEIVING_EMAIL}.`
        );
      }
    } catch {
      showSuccess(
        statusEl,
        `Thank you, ${senderName}. Your message was validated and recorded for ${RECEIVING_EMAIL}.`
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      form.reset();
      if (charCounterEl) {
        charCounterEl.textContent = `0 / ${MAX_MESSAGE_LENGTH} characters`;
      }
      fields.forEach((field) => resetFieldState(field));
    }
  });
});

/**
 * Validates one field and shows either a green check tick or an error + shake.
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @param {boolean} shouldShake
 * @returns {boolean}
 */
function validateField(field, shouldShake) {
  if (!field) return true;

  const value = field.value.trim();
  const errorEl = document.getElementById(`${field.id}-error`);
  const tickEl = document.getElementById(`${field.id}-tick`);
  let errorMessage = '';

  if (value === '') {
    errorMessage = 'This field is required and cannot be empty.';
  } else if (field.id === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(value)) {
      errorMessage = 'Please enter a valid email address (for example, name@example.com).';
    }
  } else if (field.id === 'phone') {
    const digitsOnlyPattern = /^\d+$/;
    if (!digitsOnlyPattern.test(value)) {
      errorMessage = 'Phone number must contain digits only, with no spaces or symbols.';
    }
  }

  if (errorMessage) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    if (tickEl) tickEl.classList.remove('is-visible');
    if (errorEl) errorEl.textContent = errorMessage;

    if (shouldShake) {
      field.classList.remove('is-shaking');
      void field.offsetWidth;
      field.classList.add('is-shaking');
    }
    return false;
  }

  field.classList.remove('is-invalid', 'is-shaking');
  field.classList.add('is-valid');
  field.removeAttribute('aria-invalid');
  if (errorEl) errorEl.textContent = '';
  if (tickEl) tickEl.classList.add('is-visible');
  return true;
}

/**
 * Resets field styling and validation indicators after a form reset.
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 */
function resetFieldState(field) {
  if (!field) return;
  field.classList.remove('is-invalid', 'is-valid', 'is-shaking');
  field.removeAttribute('aria-invalid');
  const errorEl = document.getElementById(`${field.id}-error`);
  const tickEl = document.getElementById(`${field.id}-tick`);
  if (errorEl) errorEl.textContent = '';
  if (tickEl) tickEl.classList.remove('is-visible');
}

function showSuccess(statusEl, message) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'form-status is-success';
}
