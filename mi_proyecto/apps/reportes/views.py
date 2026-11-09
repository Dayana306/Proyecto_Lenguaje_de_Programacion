from django.shortcuts import render


def generar_reportes(request):
    return render(request, "reportes/generar_reportes.html", {"active_page": "reports", "user_name": "Bibliotecario"})
