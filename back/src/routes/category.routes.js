/**
 * Rutas de Categorías
 * Define los endpoints CRUD para el recurso Category
 * Parte 3 - Módulo 8: API RESTful
 */

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  paginationMiddleware,
} = require("../middlewares/pagination.middleware");

/**
 * @route   GET /api/categories
 * @desc    Obtener todas las categorías (con paginación)
 * @access  Public
 * @query   ?search=tech&page=1&limit=10&sort=-createdAt
 */
router.get("/", paginationMiddleware, categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Obtener una categoría por ID con sus posts asociados
 * @access  Public
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Crear una nueva categoría
 * @access  Private (requiere autenticación - corregido Módulo 8)
 * @body    { "name": "string" }
 */
router.post("/", authenticateToken, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Actualizar una categoría existente
 * @access  Private (requiere autenticación)
 * @body    { "name": "string" }
 */
router.put("/:id", authenticateToken, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Eliminar una categoría
 * @access  Private (requiere autenticación)
 */
router.delete("/:id", authenticateToken, categoryController.deleteCategory);

module.exports = router;
