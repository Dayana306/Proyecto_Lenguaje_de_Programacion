from django.urls import path

from . import views

app_name = "gestion_libros"

urlpatterns = [
    path("", views.gestionar_libros, name="gestionar"),
]
