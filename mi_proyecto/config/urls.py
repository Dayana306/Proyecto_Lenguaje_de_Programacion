from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path("", include("apps.autenticacion.urls")),
    path("", include("apps.catalogo.urls")),
    path("bibliotecario/", include("apps.prestamos.urls")),
    path("bibliotecario/libros/", include("apps.gestion_libros.urls")),
    path("bibliotecario/usuarios/", include("apps.gestion_usuarios.urls")),
    path("bibliotecario/reportes/", include("apps.reportes.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
