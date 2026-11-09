from django.shortcuts import render


USERS = [
    {"name": "Camila Fernández", "email": "camila.fernandez@demo.edu.pe", "code": "EST-2026-014", "role": "Estudiante", "status": "Activo", "date": "12 mar 2026"},
    {"name": "María Elena Rojas", "email": "maria.rojas@demo.edu.pe", "code": "DOC-2026-003", "role": "Docente", "status": "Activo", "date": "04 mar 2026"},
    {"name": "Valeria Torres", "email": "valeria.torres@demo.edu.pe", "code": "EST-2026-021", "role": "Estudiante", "status": "Activo", "date": "18 mar 2026"},
    {"name": "Jorge Castillo", "email": "jorge.castillo@demo.edu.pe", "code": "BIB-2026-001", "role": "Bibliotecario", "status": "Activo", "date": "02 mar 2026"},
    {"name": "Diego Paredes", "email": "diego.paredes@demo.edu.pe", "code": "EST-2026-029", "role": "Estudiante", "status": "Suspendido", "date": "22 mar 2026"},
]


def gestionar_usuarios(request):
    return render(request, "gestion_usuarios/gestionar_usuarios.html", {"users": USERS, "active_page": "users", "user_name": "Bibliotecario"})
