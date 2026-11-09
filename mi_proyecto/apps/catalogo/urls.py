from django.urls import path

from . import views

app_name = "catalogo"

urlpatterns = [
    path("estudiante/", views.dashboard_estudiante, name="estudiante"),
    path("docente/", views.dashboard_docente, name="docente"),
    path("lectura/", views.visor_lectura, name="visor_lectura"),
]
