from django.urls import path

from . import views

app_name = "gestion_usuarios"

urlpatterns = [
    path("", views.gestionar_usuarios, name="gestionar"),
]
