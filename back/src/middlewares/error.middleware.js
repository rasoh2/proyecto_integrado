/**
 * Middleware de Error Global
 * Captura y maneja todas las excepciones que ocurran en los controladores
 * Parte 3 - Módulo 8: Arquitectura robusta
 */

/**
 * Error Handler Middleware
 * Este middleware DEBE ser montado al final de todas las rutas en app.js
 * Captura errores y los devuelve en formato consistente
 */
const errorHandler = (err, req, res, next) => {
  // Registrar error en consola
  console.error("❌ ERROR:", {
    message: err.message,
    status: err.status || 500,
    type: err.name,
    url: req.originalUrl,
    method: req.method,
  });

  // Errores de validación Sequelize
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      status: "error",
      message: "Error de validación",
      errors: messages,
      data: null,
    });
  }

  // Errores de unicidad (primary key, unique constraints)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "error",
      message: "El registro ya existe (violación de constraints)",
      field: err.fields || null,
      data: null,
    });
  }

  // Errores de BD general
  if (err.name && err.name.includes("Sequelize")) {
    return res.status(500).json({
      status: "error",
      message: "Error de base de datos",
      data: null,
    });
  }

  // Errores JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado",
      data: null,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expirado",
      data: null,
    });
  }

  // Errores de Multer (upload)
  if (err.name === "MulterError") {
    let message = "Error al subir archivo";
    if (err.code === "FILE_TOO_LARGE") {
      message = "El archivo es demasiado grande";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Se superó el número máximo de archivos";
    }
    return res.status(400).json({
      status: "error",
      message,
      data: null,
    });
  }

  // Errores personalizados
  if (err.status) {
    return res.status(err.status).json({
      status: "error",
      message: err.message,
      data: null,
    });
  }

  // Error genérico 500
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message,
    data: null,
  });
};

module.exports = { errorHandler };
