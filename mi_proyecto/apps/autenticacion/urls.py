from django.urls import path

from . import views

app_name = "autenticacion"

urlpatterns = [
    path("", views.login, name="login"),
    path("recuperar-clave/", views.recuperar_clave, name="recuperar_clave"),
]
