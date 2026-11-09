# BiblioSmart · Frontend de demostración

Interfaz modular realizada con Django, Bootstrap 5, CSS y JavaScript. No contiene
modelos, migraciones, autenticación real ni almacenamiento de los datos de
demostración.

## Ejecutar localmente

Desde esta carpeta:

```bash
python manage.py runserver
```

Visita `http://127.0.0.1:8000/`. Para probar los perfiles, selecciona Estudiante,
Docente o Bibliotecario en la pantalla de acceso. El usuario y la contraseña
solo se validan como campos obligatorios.

## Vistas

- `/` y `/recuperar-clave/`: inicio y recuperación de contraseña.
- `/estudiante/`, `/docente/` y `/lectura/`: catálogo y lector.
- `/bibliotecario/`, `/bibliotecario/libros/`,
  `/bibliotecario/usuarios/` y `/bibliotecario/reportes/`: vistas administrativas.

La interfaz requiere conexión a internet para cargar Bootstrap, Bootstrap Icons,
Google Fonts y Chart.js desde sus CDN. Los recursos de usuario son archivos
locales de ejemplo y no se suben ni persisten.
