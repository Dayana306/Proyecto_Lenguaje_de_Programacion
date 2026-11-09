from django.shortcuts import render


BOOKS = [
    {
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "category": "Literatura",
        "grade": "4.° y 5.° secundaria",
        "year": 1967,
        "format": "ePub",
        "description": "Una saga familiar que recorre la historia de Macondo.",
        "color": "cover-gold",
    },
    {
        "title": "El mundo de Sofía",
        "author": "Jostein Gaarder",
        "category": "Filosofía",
        "grade": "3.° a 5.° secundaria",
        "year": 1991,
        "format": "PDF",
        "description": "Un recorrido por las grandes preguntas de la filosofía.",
        "color": "cover-blue",
    },
    {
        "title": "La ciudad y los perros",
        "author": "Mario Vargas Llosa",
        "category": "Literatura",
        "grade": "4.° y 5.° secundaria",
        "year": 1963,
        "format": "PDF",
        "description": "Una novela sobre la vida y los vínculos en un colegio militar.",
        "color": "cover-coral",
    },
    {
        "title": "Breve historia del tiempo",
        "author": "Stephen Hawking",
        "category": "Ciencia",
        "grade": "1.° a 5.° secundaria",
        "year": 1988,
        "format": "ePub",
        "description": "Conceptos esenciales del universo explicados con claridad.",
        "color": "cover-violet",
    },
    {
        "title": "El principito",
        "author": "Antoine de Saint-Exupéry",
        "category": "Literatura",
        "grade": "1.° y 2.° secundaria",
        "year": 1943,
        "format": "PDF",
        "description": "Un clásico sobre la amistad, la imaginación y el cuidado.",
        "color": "cover-teal",
    },
    {
        "title": "Matemática para todos",
        "author": "Rosa M. Salazar",
        "category": "Matemática",
        "grade": "1.° a 3.° secundaria",
        "year": 2022,
        "format": "PDF",
        "description": "Retos y ejercicios para desarrollar el pensamiento lógico.",
        "color": "cover-indigo",
    },
]

MATERIALS = [
    {"title": "Guía de comprensión lectora", "type": "PDF", "subject": "Comunicación", "size": "2.4 MB"},
    {"title": "Láminas del sistema solar", "type": "PDF", "subject": "Ciencia y Tecnología", "size": "5.1 MB"},
    {"title": "Fichas de razonamiento matemático", "type": "PDF", "subject": "Matemática", "size": "1.8 MB"},
]


def dashboard_estudiante(request):
    return render(
        request,
        "catalogo/dashboard_estudiante.html",
        {"books": BOOKS, "active_page": "student", "user_name": "Camila", "loan_count": 2, "pending_count": 1},
    )


def dashboard_docente(request):
    return render(
        request,
        "catalogo/dashboard_docente.html",
        {"books": BOOKS, "materials": MATERIALS, "active_page": "teacher", "user_name": "María Elena"},
    )


def visor_lectura(request):
    return render(
        request,
        "catalogo/visor_lectura.html",
        {"active_page": "reader", "user_name": "Camila"},
    )
