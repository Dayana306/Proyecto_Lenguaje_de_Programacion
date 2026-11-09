from django.shortcuts import render


REQUESTS = [
    {"person": "Valeria Torres", "role": "Estudiante · 4.° secundaria", "book": "Cien años de soledad", "date": "08 nov 2026", "status": "Pendiente"},
    {"person": "Diego Paredes", "role": "Estudiante · 3.° secundaria", "book": "El mundo de Sofía", "date": "07 nov 2026", "status": "Pendiente"},
    {"person": "María Elena Rojas", "role": "Docente · Comunicación", "book": "La ciudad y los perros", "date": "06 nov 2026", "status": "Aprobado"},
    {"person": "Lucía Salazar", "role": "Estudiante · 5.° secundaria", "book": "Breve historia del tiempo", "date": "04 nov 2026", "status": "Rechazado"},
    {"person": "Andrés Vega", "role": "Estudiante · 2.° secundaria", "book": "El principito", "date": "03 nov 2026", "status": "Aprobado"},
]


def gestionar_prestamos(request):
    return render(request, "prestamos/gestionar_prestamos.html", {"requests": REQUESTS, "active_page": "loans", "user_name": "Bibliotecario"})
