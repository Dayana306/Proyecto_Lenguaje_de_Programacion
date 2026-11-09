
(function () {
    'use strict';

    var toggle = document.querySelector('[data-profile-toggle]');
    var menu = document.getElementById('profile-menu');

    var previewLogout = document.querySelector('[data-preview-logout]');
    if (previewLogout) {
        previewLogout.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }

    function closeProfileMenu() {
        if (!toggle || !menu) return;
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var willOpen = menu.hidden;
            menu.hidden = !willOpen;
            toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('.profile-area')) {
                closeProfileMenu();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !menu.hidden) {
                closeProfileMenu();
                toggle.focus();
            }
        });
    }

    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form.matches('[data-preview-only]')) return;

        event.preventDefault();
        var notice = document.getElementById('preview-notice');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'preview-notice';
            notice.className = 'preview-notice';
            notice.setAttribute('role', 'status');
            document.body.appendChild(notice);
        }
        notice.textContent = 'Vista previa visual. La búsqueda real se procesa desde Django en el proyecto.';
    });
})();

const profileToggle = document.getElementById("profileToggle");
const profileMenu = document.getElementById("profileMenu");
const logoutButton = document.getElementById("logoutButton");

if (profileToggle && profileMenu) {
    profileToggle.addEventListener("click", function () {
        const abierto = !profileMenu.hidden;
        profileMenu.hidden = abierto;
        profileToggle.setAttribute(
            "aria-expanded",
            String(!abierto)
        );
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        window.location.href = "../../autenticacion/templates/login.html";
    });
}