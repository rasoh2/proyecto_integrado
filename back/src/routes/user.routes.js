/**
 * Rutas de Usuarios
 * Define los endpoints CRUD para el recurso User
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  paginationMiddleware,
} = require("../middlewares/pagination.middleware");
const {
  uploadAvatar,
  handleUploadError,
} = require("../middlewares/upload.middleware");
const {
  validateUserCreation,
  validateUserUpdate,
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

// Aplicar autenticación a TODAS las rutas de este router
// NOTA: Esto protege todas las rutas de usuarios por razones de seguridad
router.use(authenticateToken);

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios (con paginación)
 * @access  Private (requiere autenticación)
 * @query   ?search=leo&role=admin&page=1&limit=10&sort=-createdAt
 */
router.get("/", paginationMiddleware, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private (requiere autenticación - corregido Módulo 8)
 */
router.get("/:id", userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Crear un nuevo usuario
 * @access  Private (requiere autenticación - corregido Módulo 8)
 * @body    { name: string, email: string, password: string }
 */
router.post(
  "/",
  validateUserCreation,
  handleValidationErrors,
  userController.createUser,
);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar un usuario existente
 * @access  Private (requiere autenticación - corregido Módulo 8)
 * @body    { name?: string, email?: string, role?: string, active?: boolean }
 */
router.put(
  "/:id",
  validateUserUpdate,
  handleValidationErrors,
  userController.updateUser,
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar un usuario
 * @access  Private (requiere autenticación - corregido Módulo 8)
 */
router.delete("/:id", userController.deleteUser);

/**
 * @route   POST /api/users/:id/avatar
 * @desc    Subir avatar de usuario (protegido)
 * @access  Private (requiere autenticación)
 */
router.post(
  "/:id/avatar",
  uploadAvatar.single("avatar"),
  handleUploadError,
  userController.uploadAvatar,
);

module.exports = router;
