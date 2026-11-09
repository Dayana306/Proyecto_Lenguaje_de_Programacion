from django.shortcuts import render


def login(request):
    return render(request, "autenticacion/login.html")


def recuperar_clave(request):
    return render(request, "autenticacion/recuperar_clave.html")
