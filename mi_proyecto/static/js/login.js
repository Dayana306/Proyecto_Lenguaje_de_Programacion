(() => {
  const form = document.getElementById("login-form");
  if (!form) return;

  const email = document.getElementById("correo");
  const password = document.getElementById("contrasena");
  const emailError = document.getElementById("correo-error");
  const passwordError = document.getElementById("contrasena-error");
  const toggle = document.getElementById("toggle-password");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(input, messageElement, message) {
    messageElement.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function checkEmail() {
    const value = email.value.trim();
    let message = "";

    if (!value) {
      message = "Ingresa tu correo electrónico.";
    } else if (!emailPattern.test(value)) {
      message = "Correo incorrecto. Revisa el formato.";
    }

    showError(email, emailError, message);
    return message === "";
  }

  function checkPassword() {
    const message = password.value ? "" : "Ingresa tu contraseña.";
    showError(password, passwordError, message);
    return message === "";
  }

  email.addEventListener("blur", checkEmail);
  password.addEventListener("blur", checkPassword);

  email.addEventListener("input", () => {
    if (emailError.textContent) checkEmail();
  });

  password.addEventListener("input", () => {
    if (passwordError.textContent) checkPassword();
  });

  toggle.addEventListener("click", () => {
    const visible = password.type === "text";
    password.type = visible ? "password" : "text";
    toggle.setAttribute("aria-pressed", String(!visible));
    toggle.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
  });

  form.addEventListener("submit", event => {
    const emailIsValid = checkEmail();
    const passwordIsValid = checkPassword();

    if (!emailIsValid || !passwordIsValid) {
      event.preventDefault();
      (emailIsValid ? password : email).focus();
    }
    
  });
})();
