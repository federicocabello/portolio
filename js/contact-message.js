(function() {
    'use strict';

    var dialog = document.getElementById('contact-message-dialog');
    var openButton = document.getElementById('contact-message-open');
    var closeButton = document.getElementById('contact-message-close');
    var form = document.getElementById('contact-message-form');
    if (!dialog || !openButton || !closeButton || !form) return;

    var nameInput = document.getElementById('contact-message-name');
    var messageInput = document.getElementById('contact-message-text');
    var honeypot = document.getElementById('contact-message-website');
    var status = document.getElementById('contact-message-status');
    var submitButton = document.getElementById('contact-message-submit');
    var submitLabel = submitButton.querySelector('span');
    var deliveryOverlay = document.getElementById('contact-delivery-overlay');
    var deliveryTitle = document.getElementById('contact-delivery-title');
    var deliveryDescription = document.getElementById('contact-delivery-description');
    var deliveryReturn = document.getElementById('contact-delivery-return');
    var deliveryReturnLabel = deliveryReturn ? deliveryReturn.querySelector('span') : null;
    var endpointMeta = document.querySelector('meta[name="portfolio-ai-endpoint"]');
    var endpoint = endpointMeta ? endpointMeta.content.trim().replace(/\/$/, '') : '';
    var pending = false;
    var closing = false;
    var closeTimer = null;
    var deliveryState = '';

    function t(key) {
        return window.portfolioI18n ? window.portfolioI18n.t(key) : key;
    }

    function updateLocalizedControls() {
        nameInput.placeholder = t('contact.namePlaceholder');
        messageInput.placeholder = t('contact.messagePlaceholder');
        closeButton.setAttribute('aria-label', t('contact.close'));
        closeButton.setAttribute('title', t('contact.close'));
        if (!pending) submitLabel.textContent = t('contact.sendMessage');
        if (status.dataset.state) {
            status.textContent = t(status.dataset.state === 'success' ? 'contact.success' : 'contact.error');
        }
    }

    function clearStatus() {
        status.textContent = '';
        status.classList.remove('is-error');
        delete status.dataset.state;
    }

    function setDeliveryState(state) {
        if (!deliveryOverlay || !deliveryTitle || !deliveryDescription || !deliveryReturnLabel) return;
        deliveryState = state;
        deliveryOverlay.classList.remove('is-sending', 'is-success', 'is-error', 'is-closing');
        deliveryOverlay.classList.add('is-' + state);

        if (state === 'sending') {
            deliveryTitle.textContent = t('contact.deliverySendingTitle');
            deliveryDescription.textContent = t('contact.deliverySendingBody');
            deliveryReturn.hidden = true;
        } else if (state === 'success') {
            deliveryTitle.textContent = t('contact.deliverySuccessTitle');
            deliveryDescription.textContent = t('contact.deliverySuccessBody');
            deliveryReturnLabel.textContent = t('contact.deliveryReturn');
            deliveryReturn.hidden = false;
            window.setTimeout(function() { deliveryReturn.focus(); }, 80);
        } else {
            deliveryTitle.textContent = t('contact.deliveryErrorTitle');
            deliveryDescription.textContent = t('contact.deliveryErrorBody');
            deliveryReturnLabel.textContent = t('contact.deliveryRetry');
            deliveryReturn.hidden = false;
            window.setTimeout(function() { deliveryReturn.focus(); }, 80);
        }
    }

    function showDeliveryOverlay() {
        if (!deliveryOverlay) return;
        document.body.classList.add('contact-delivery-active');
        deliveryOverlay.hidden = false;
        setDeliveryState('sending');
    }

    function hideDeliveryOverlay(callback) {
        if (!deliveryOverlay || deliveryOverlay.hidden) {
            if (callback) callback();
            return;
        }
        deliveryOverlay.classList.add('is-closing');
        window.setTimeout(function() {
            deliveryOverlay.hidden = true;
            deliveryOverlay.classList.remove('is-sending', 'is-success', 'is-error', 'is-closing');
            document.body.classList.remove('contact-delivery-active');
            if (callback) callback();
        }, 220);
    }

    function hideMessageDialog() {
        if (closeTimer) {
            window.clearTimeout(closeTimer);
            closeTimer = null;
        }
        dialog.hidden = true;
        dialog.classList.remove('is-open', 'is-closing');
        openButton.setAttribute('aria-expanded', 'false');
        closing = false;
    }

    function closeDialog(restoreFocus) {
        if (dialog.hidden || closing) return;
        closing = true;
        dialog.classList.remove('is-open');
        dialog.classList.add('is-closing');
        openButton.setAttribute('aria-expanded', 'false');
        closeTimer = window.setTimeout(function() {
            dialog.hidden = true;
            dialog.classList.remove('is-closing');
            closing = false;
            closeTimer = null;
            if (restoreFocus !== false) openButton.focus();
        }, 200);
    }

    function positionDialog() {
        var buttonRect = openButton.getBoundingClientRect();
        var dialogRect = dialog.getBoundingClientRect();
        var viewportPadding = 10;
        var gap = 12;
        var left = buttonRect.right - dialogRect.width;
        var top = buttonRect.top - dialogRect.height - gap;

        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - dialogRect.width - viewportPadding));
        if (top < viewportPadding) {
            top = Math.max(viewportPadding, window.innerHeight - dialogRect.height - viewportPadding);
        }

        dialog.style.left = Math.round(left) + 'px';
        dialog.style.top = Math.round(top) + 'px';
        dialog.style.setProperty('--contact-origin-x', Math.round(buttonRect.left + buttonRect.width / 2 - left) + 'px');
        dialog.style.setProperty('--contact-origin-y', Math.round(buttonRect.top + buttonRect.height / 2 - top) + 'px');
    }

    openButton.addEventListener('click', function() {
        if (closeTimer) {
            window.clearTimeout(closeTimer);
            closeTimer = null;
        }
        closing = false;
        clearStatus();
        updateLocalizedControls();
        dialog.hidden = false;
        dialog.style.visibility = 'hidden';
        positionDialog();
        dialog.style.visibility = '';
        dialog.classList.remove('is-open', 'is-closing');
        window.requestAnimationFrame(function() { dialog.classList.add('is-open'); });
        openButton.setAttribute('aria-expanded', 'true');
        window.setTimeout(function() { nameInput.focus(); }, 40);
    });

    closeButton.addEventListener('click', closeDialog);

    if (deliveryReturn) {
        deliveryReturn.addEventListener('click', function() {
            var wasSuccessful = deliveryState === 'success';
            hideDeliveryOverlay(function() {
                if (wasSuccessful) {
                    hideMessageDialog();
                    openButton.focus();
                } else {
                    submitButton.focus();
                }
            });
        });
    }

    document.addEventListener('pointerdown', function(event) {
        if (dialog.hidden || pending) return;
        if (!dialog.contains(event.target) && !openButton.contains(event.target)) {
            closeDialog(false);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !dialog.hidden && !pending) closeDialog();
    });

    window.addEventListener('resize', function() {
        if (!dialog.hidden) positionDialog();
    });

    window.addEventListener('scroll', function() {
        if (!dialog.hidden && !pending) closeDialog(false);
    }, { passive: true });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (pending) return;

        nameInput.value = nameInput.value.trim();
        messageInput.value = messageInput.value.trim();
        if (!form.reportValidity()) return;

        pending = true;
        clearStatus();
        submitButton.disabled = true;
        submitLabel.textContent = t('contact.sending');
        showDeliveryOverlay();

        try {
            var response = await fetch(endpoint + '/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    message: messageInput.value.trim(),
                    website: honeypot.value,
                    language: document.documentElement.lang === 'es' ? 'es' : 'en'
                })
            });
            if (!response.ok) throw new Error('Contact request failed');

            form.reset();
            status.dataset.state = 'success';
            status.textContent = t('contact.success');
            setDeliveryState('success');
        } catch (error) {
            status.dataset.state = 'error';
            status.classList.add('is-error');
            status.textContent = t('contact.error');
            setDeliveryState('error');
        } finally {
            pending = false;
            submitButton.disabled = false;
            submitLabel.textContent = t('contact.sendMessage');
        }
    });

    document.addEventListener('portfolio:languagechange', function() {
        updateLocalizedControls();
        if (deliveryState) setDeliveryState(deliveryState);
    });
    updateLocalizedControls();
})();
