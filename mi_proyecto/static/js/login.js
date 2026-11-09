(() => {
  "use strict";

  const form = document.getElementById("login-form");
  if (!form) return;
  const user = document.getElementById("correo");
  const password = document.getElementById("contrasena");
  const userError = document.getElementById("correo-error");
  const passwordError = document.getElementById("contrasena-error");
  const toggle = document.getElementById("toggle-password");
  const savedRole = localStorage.getItem("bibliosmart-demo-role");
  const roleSelect = document.getElementById("demo-role");
  if (savedRole && Array.from(roleSelect.options).some(option => option.value === savedRole)) {
    roleSelect.value = savedRole;
  }

  function validate(input, error, message) {
    const invalid = !input.value.trim();
    error.textContent = invalid ? message : "";
    input.setAttribute("aria-invalid", String(invalid));
    return !invalid;
  }

  user.addEventListener("blur", () => validate(user, userError, "Ingresa tu usuario o correo."));
  password.addEventListener("blur", () => validate(password, passwordError, "Ingresa tu contraseña."));
  user.addEventListener("input", () => {
    if (userError.textContent) validate(user, userError, "Ingresa tu usuario o correo.");
  });
  password.addEventListener("input", () => {
    if (passwordError.textContent) validate(password, passwordError, "Ingresa tu contraseña.");
  });

  toggle?.addEventListener("click", () => {
    const visible = password.type === "text";
    password.type = visible ? "password" : "text";
    toggle.setAttribute("aria-pressed", String(!visible));
    toggle.setAttribute("aria-label", visible ? "Mostrar contraseña" : "Ocultar contraseña");
    const icon = toggle.querySelector("i");
    if (icon) icon.className = `bi ${visible ? "bi-eye" : "bi-eye-slash"}`;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const validUser = validate(user, userError, "Ingresa tu usuario o correo.");
    const validPassword = validate(password, passwordError, "Ingresa tu contraseña.");
    if (!validUser || !validPassword) {
      (validUser ? password : user).focus();
      return;
    }
    const destination = document.getElementById("demo-role").value;
    if (form.elements.recordar.checked) localStorage.setItem("bibliosmart-demo-role", destination);
    window.location.assign(destination);
  });
})();
