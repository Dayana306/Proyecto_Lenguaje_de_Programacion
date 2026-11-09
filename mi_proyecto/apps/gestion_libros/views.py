from django.shortcuts import render


BOOK_RECORDS = [
    {"title": "Cien años de soledad", "author": "Gabriel García Márquez", "category": "Literatura", "year": 1967, "format": "ePub", "licenses": 12, "status": "Disponible", "color": "cover-gold"},
    {"title": "El mundo de Sofía", "author": "Jostein Gaarder", "category": "Filosofía", "year": 1991, "format": "PDF", "licenses": 8, "status": "Disponible", "color": "cover-blue"},
    {"title": "La ciudad y los perros", "author": "Mario Vargas Llosa", "category": "Literatura", "year": 1963, "format": "PDF", "licenses": 4, "status": "Agotado", "color": "cover-coral"},
    {"title": "Breve historia del tiempo", "author": "Stephen Hawking", "category": "Ciencia", "year": 1988, "format": "ePub", "licenses": 10, "status": "Disponible", "color": "cover-violet"},
    {"title": "El principito", "author": "Antoine de Saint-Exupéry", "category": "Literatura", "year": 1943, "format": "PDF", "licenses": 16, "status": "Disponible", "color": "cover-teal"},
]


def gestionar_libros(request):
    return render(request, "gestion_libros/gestionar_libros.html", {"books": BOOK_RECORDS, "active_page": "books", "user_name": "Bibliotecario"})
