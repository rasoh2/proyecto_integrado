/**
 * Validaciones reutilizables con express-validator
 * NOTA PARA JUNIOR: Estos son validadores que podemos usar en múltiples rutas
 * para garantizar que los datos cumplan con requisitos específicos
 */

const { body, validationResult } = require("express-validator");

/**
 * Middleware para validar usuario (registro/crear)
 */
const validateUserCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre no debe exceder 100 caracteres"),

  body("email").trim().isEmail().withMessage("Email inválido").normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .isLength({ max: 255 })
    .withMessage("La contraseña no debe exceder 255 caracteres"),
];

/**
 * Middleware para validar actualización de usuario
 */
const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre no debe exceder 100 caracteres"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("El rol debe ser 'admin' o 'user'"),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("active debe ser un booleano"),
];

/**
 * Middleware para validar perfil de usuario
 */
const validateProfileUpdate = [
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("La biografía no debe exceder 255 caracteres"),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("El teléfono no debe exceder 30 caracteres"),
];

/**
 * Middleware para validar post
 */
const validatePostCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es requerido")
    .isLength({ min: 5 })
    .withMessage("El título debe tener al menos 5 caracteres")
    .isLength({ max: 150 })
    .withMessage("El título no debe exceder 150 caracteres"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("El contenido es requerido")
    .isLength({ min: 10 })
    .withMessage("El contenido debe tener al menos 10 caracteres"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("published debe ser un booleano"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("categories debe ser un array"),
];

/**
 * Middleware para validar categoría
 */
const validateCategoryCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres")
    .isLength({ max: 80 })
    .withMessage("El nombre no debe exceder 80 caracteres"),
];

/**
 * Middleware para manejar errores de validación
 * NOTA: Este middleware debe usarse DESPUÉS de los validadores
 * Automáticamente devuelve un error 400 si hay validaciones fallidas
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Errores de validación",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

module.exports = {
  validateUserCreation,
  validateUserUpdate,
  validateProfileUpdate,
  validatePostCreation,
  validateCategoryCreation,
  handleValidationErrors,
};
