/**
 * Controlador de Categorías
 * Maneja las operaciones CRUD para el modelo Category
 * Parte 3 - Módulo 8: API RESTful
 */

const { Op } = require("sequelize");
const { Category, Post } = require("../models");

/**
 * Obtener todas las categorías
 * GET /api/categories
 * Público - sin autenticación
 */
const getAllCategories = async (req, res) => {
  try {
    const { search, limit = 10, offset = 0, page = 1 } = req.query;
    const where = {};

    // Filtro de búsqueda
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Paginación
    const pageNum = parseInt(page) > 0 ? parseInt(page) - 1 : 0;
    const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const offsetNum = pageNum * limitNum;

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit: limitNum,
      offset: offsetNum,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      message: "Categorías obtenidas correctamente",
      data: rows,
      pagination: {
        total: count,
        page: pageNum + 1,
        pages: Math.ceil(count / limitNum),
        limit: limitNum,
      },
      count: rows.length,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};

/**
 * Obtener una categoría por ID
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Post,
          as: "posts",
          through: { attributes: [] },
          attributes: ["id", "title", "published"],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `Categoría con ID ${id} no encontrada`,
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Categoría obtenida correctamente",
      data: category,
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener categoría",
      error: error.message,
    });
  }
};

/**
 * Crear una nueva categoría
 * POST /api/categories
 * Requiere: nombre de categoría
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validación básica
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: "error",
        message: "El nombre de la categoría es requerido y debe ser texto",
        data: null,
      });
    }

    // Validar longitud
    if (name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({
        status: "error",
        message: "El nombre debe tener entre 2 y 80 caracteres",
        data: null,
      });
    }

    // Verificar si ya existe
    const existingCategory = await Category.findOne({
      where: { name: { [Op.iLike]: name.trim() } },
    });

    if (existingCategory) {
      return res.status(409).json({
        status: "error",
        message: "La categoría ya existe",
        data: null,
      });
    }

    const category = await Category.create({
      name: name.trim(),
    });

    return res.status(201).json({
      status: "success",
      message: "Categoría creada correctamente",
      data: category,
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear categoría",
      error: error.message,
    });
  }
};

/**
 * Actualizar una categoría
 * PUT /api/categories/:id
 * Requiere autenticación
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validación
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: "error",
        message: "El nombre de la categoría es requerido",
        data: null,
      });
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({
        status: "error",
        message: "El nombre debe tener entre 2 y 80 caracteres",
        data: null,
      });
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `Categoría con ID ${id} no encontrada`,
        data: null,
      });
    }

    // Verificar si el nuevo nombre ya existe (en otra categoría)
    const existingCategory = await Category.findOne({
      where: {
        name: { [Op.iLike]: name.trim() },
        id: { [Op.ne]: id },
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        status: "error",
        message: "Ya existe otra categoría con ese nombre",
        data: null,
      });
    }

    await category.update({ name: name.trim() });

    return res.status(200).json({
      status: "success",
      message: "Categoría actualizada correctamente",
      data: category,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

/**
 * Eliminar una categoría
 * DELETE /api/categories/:id
 * Requiere autenticación
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id"],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `Categoría con ID ${id} no encontrada`,
        data: null,
      });
    }

    // Advertencia si tiene posts asociados
    if (category.posts && category.posts.length > 0) {
      console.warn(
        `⚠️ Eliminando categoría con ${category.posts.length} posts asociados`,
      );
    }

    await category.destroy();

    return res.status(200).json({
      status: "success",
      message: "Categoría eliminada correctamente",
      data: {
        id: category.id,
        name: category.name,
        postsRemoved: category.posts?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar categoría",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
