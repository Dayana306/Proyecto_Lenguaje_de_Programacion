from django.urls import path

from . import views

app_name = "reportes"

urlpatterns = [
    path("", views.generar_reportes, name="generar"),
]
