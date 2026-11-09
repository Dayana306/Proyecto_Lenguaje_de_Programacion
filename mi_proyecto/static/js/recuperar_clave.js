(() => {
    const form = document.getElementById("recovery-form");
    if (!form) return;

    const email = document.getElementById("correoElectronico");
    const password = document.getElementById("contrasenia");
    const confirmation = document.getElementById("confirmar_contrasenia");
    const emailError = document.getElementById("correo-error");
    const passwordError = document.getElementById("contrasenia-error");
    const confirmationError = document.getElementById("confirmar-error");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function showError(input, element, message) {
        element.textContent = message;
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function checkEmail() {
        const value = email.value.trim();
        let message = "";
        if (!value) message = "Ingresa tu correo electrónico.";
        else if (!emailPattern.test(value)) message = "Correo incorrecto. Revisa el formato.";
        showError(email, emailError, message);
        return !message;
    }

    function checkPassword() {
        let message = "";
        if (!password.value) message = "Ingresa una contraseña.";
        else if (password.value.length < 8) message = "La contraseña debe tener al menos 8 caracteres.";
        showError(password, passwordError, message);
        return !message;
    }

    function checkConfirmation() {
        let message = "";
        if (!confirmation.value) message = "Confirma tu contraseña.";
        else if (confirmation.value !== password.value) message = "Las contraseñas no coinciden.";
        showError(confirmation, confirmationError, message);
        return !message;
    }

    email.addEventListener("blur", checkEmail);
    password.addEventListener("blur", checkPassword);
    confirmation.addEventListener("blur", checkConfirmation);

    email.addEventListener("input", () => {
        if (emailError.textContent) checkEmail();
    });
    password.addEventListener("input", () => {
        if (passwordError.textContent) checkPassword();
        if (confirmation.value && confirmationError.textContent) checkConfirmation();
    });
    confirmation.addEventListener("input", () => {
        if (confirmationError.textContent) checkConfirmation();
    });

    form.querySelectorAll("[data-toggle-password]").forEach(button => {
        button.addEventListener("click", () => {
            const field = document.getElementById(button.dataset.togglePassword);
            const visible = field.type === "text";
            field.type = visible ? "password" : "text";
            button.setAttribute("aria-pressed", String(!visible));
            button.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
        });
    });

    form.addEventListener("submit", event => {
        const validEmail = checkEmail();
        const validPassword = checkPassword();
        const validConfirmation = checkConfirmation();

        if (!validEmail || !validPassword || !validConfirmation) {
            event.preventDefault();
            if (!validEmail) email.focus();
            else if (!validPassword) password.focus();
            else confirmation.focus();
            return;
        }

        if (form.hasAttribute("data-preview-only")) event.preventDefault();
    });
})();
