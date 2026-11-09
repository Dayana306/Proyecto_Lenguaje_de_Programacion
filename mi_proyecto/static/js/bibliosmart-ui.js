document.addEventListener('click', function (event) {
    const closeFeedback = event.target.closest('.feedback-close');
    if (closeFeedback) {
        const feedback = closeFeedback.closest('.feedback');
        if (feedback) feedback.remove();
    }

    const toggle = event.target.closest('[data-toggle-password]');
    if (toggle) {
        const field = document.getElementById(toggle.getAttribute('data-toggle-password'));
        if (field) {
            const showing = field.type === 'text';
            field.type = showing ? 'password' : 'text';
            toggle.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
        }
    }

    const detailButton = event.target.closest('[data-book-details]');
    if (detailButton) {
        const dialog = document.getElementById('book-dialog');
        if (dialog) {
            const fields = ['title', 'author', 'publisher', 'year', 'category', 'grade', 'format', 'description'];
            fields.forEach(function (field) {
                const target = document.getElementById('dialog-' + field);
                if (target) target.textContent = detailButton.dataset[field] || 'No especificado';
            });
            if (typeof dialog.showModal === 'function') dialog.showModal();
        }
    }

    if (event.target.closest('[data-close-dialog]')) {
        const dialog = event.target.closest('dialog');
        if (dialog && typeof dialog.close === 'function') dialog.close();
    }
});

document.addEventListener('change', function (event) {
    if (event.target && event.target.matches('#material-archivo')) {
        const output = document.querySelector('[data-file-name]');
        if (output) output.textContent = event.target.files && event.target.files.length
            ? event.target.files[0].name
            : 'No se ha seleccionado un archivo';
    }
});

document.addEventListener('click', function (event) {
    if (event.target && event.target.matches('dialog')) {
        const rect = event.target.getBoundingClientRect();
        const outside = event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom;
        if (outside && typeof event.target.close === 'function') event.target.close();
    }
});
