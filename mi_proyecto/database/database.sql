CREATE DATABASE biblioteca_digital;


CREATE TABLE Usuario (
    idUsuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombreCompleto VARCHAR(150) NOT NULL,
    correoElectronico VARCHAR(150) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_usuario_rol
        CHECK (rol IN ('Estudiante', 'Docente', 'Bibliotecario'))
);

CREATE TABLE Estudiante (
    idEstudiante INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    grado VARCHAR(30) NOT NULL,
    seccion VARCHAR(10) NOT NULL,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    idUsuario INT UNIQUE NOT NULL,
    CONSTRAINT fk_estudiante_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario)
        ON DELETE CASCADE
);

CREATE TABLE Docente (
    idDocente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    idUsuario INT UNIQUE NOT NULL,
    CONSTRAINT fk_docente_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario)
        ON DELETE CASCADE
);

CREATE TABLE LibroDigital (
    idLibro INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    editorial VARCHAR(100),
    anioPublicacion SMALLINT,
    gradoDestino VARCHAR(30),
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    urlArchivo VARCHAR(500) NOT NULL,
    formato VARCHAR(10) NOT NULL,
    cantidadLicencias INT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fechaSubida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_libro_anio
        CHECK (anioPublicacion IS NULL OR anioPublicacion > 0),
    CONSTRAINT chk_libro_licencias
        CHECK (cantidadLicencias > 0),
    CONSTRAINT chk_libro_formato
        CHECK (UPPER(formato) IN ('PDF', 'EPUB'))
);

CREATE TABLE PrestamoDigital (
    idPrestamo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT NOT NULL,
    idLibro INT NOT NULL,
    idBibliotecario INT,
    fechaSolicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaAprobacion TIMESTAMP,
    fechaExpiracion TIMESTAMP,
    fechaDevolucion TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    CONSTRAINT fk_prestamo_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario),
    CONSTRAINT fk_prestamo_libro
        FOREIGN KEY (idLibro)
        REFERENCES LibroDigital(idLibro),
    CONSTRAINT fk_prestamo_bibliotecario
        FOREIGN KEY (idBibliotecario)
        REFERENCES Usuario(idUsuario),
    CONSTRAINT chk_prestamo_estado
        CHECK (estado IN (
            'Pendiente',
            'Aprobado',
            'Rechazado',
            'Devuelto',
            'Vencido'
        ))
);

CREATE TABLE Material (
    idMaterial INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipoArchivo VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    gradoDestino VARCHAR(30),
    area VARCHAR(100),
    fechaSubida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuarioSubio INT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_material_docente
        FOREIGN KEY (usuarioSubio)
        REFERENCES Docente(idDocente)
);

CREATE TABLE HistorialBusqueda (
    idBusqueda INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT NOT NULL,
    terminoBuscado VARCHAR(255) NOT NULL,
    filtrosAplicados JSONB,
    cantidadResultados INT,
    fechaBusqueda TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_busqueda_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario),
    CONSTRAINT chk_busqueda_resultados
        CHECK (cantidadResultados IS NULL OR cantidadResultados >= 0)
);

CREATE TABLE ReporteEstadistico (
    idReporte INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuario INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    periodoInicio DATE,
    periodoFin DATE,
    fechaGeneracion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    formato VARCHAR(10) NOT NULL,
    contenido TEXT,
    CONSTRAINT fk_reporte_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuario(idUsuario),
    CONSTRAINT chk_reporte_formato
        CHECK (UPPER(formato) IN ('PDF', 'EXCEL')),
    CONSTRAINT chk_reporte_periodo
        CHECK (
            periodoInicio IS NULL
            OR periodoFin IS NULL
            OR periodoInicio <= periodoFin
        )
);
