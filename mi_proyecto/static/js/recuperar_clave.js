(() => {
  "use strict";

  const form = document.getElementById("recovery-form");
  if (!form) return;
  const email = document.getElementById("recovery-email");
  const error = document.getElementById("recovery-error");
  const feedback = document.getElementById("recovery-feedback");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    const value = email.value.trim();
    const message = !value ? "Ingresa tu correo electrónico." : !emailPattern.test(value) ? "Ingresa un correo electrónico válido." : "";
    error.textContent = message;
    email.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  email.addEventListener("blur", validate);
  email.addEventListener("input", () => {
    if (error.textContent) validate();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    feedback.hidden = false;
    feedback.classList.remove("error");
    if (!validate()) {
      feedback.classList.add("error");
      feedback.textContent = "Revisa el correo ingresado e inténtalo nuevamente.";
      email.focus();
      return;
    }
    feedback.textContent = `Si ${email.value.trim()} pertenece a la comunidad, recibirás las instrucciones para recuperar tu cuenta. Este mensaje es una simulación.`;
  });
})();
