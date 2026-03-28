/**
 * Controlador de Usuarios
 * Maneja las operaciones CRUD para el modelo User
 */

const { Op } = require("sequelize");
const { User, UserProfile, sequelize } = require("../models");

/**
 * Obtener todos los usuarios
 * GET /api/users
 * Query params: ?search=leo&role=admin&active=true&page=1&limit=10&sort=-createdAt
 *
 * NOTA PARA JUNIOR:
 * Esta es una función asíncrona (async) porque nos conectaremos a la Base de Datos.
 * 1. 'req' (Request): Contiene la información de la petición del cliente.
 * 2. 'res' (Response): Es el objeto que usamos para enviarle la respuesta (los datos).
 */
const getAllUsers = async (req, res) => {
  try {
    // Extraemos los filtros que vienen en la URL (ej: /users?role=admin) desde req.query
    const { search, role, active } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof active !== "undefined") {
      where.active = active === "true";
    }

    // Usar paginación desde middleware
    const { limit, offset, sort } = req.pagination || {
      limit: 10,
      offset: 0,
      sort: ["createdAt", "DESC"],
    };

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [sort],
      attributes: { exclude: ["password"] }, // No devolver contraseña
    });

    res.json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      data: rows,
      pagination: {
        total: count,
        page: req.pagination?.page || 1,
        pages: Math.ceil(count / limit),
        limit,
      },
      count: rows.length,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

/**
 * Obtener un usuario por ID
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    res.json({
      status: "success",
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

/**
 * Crear un nuevo usuario
 * POST /api/users
 *
 * NOTA PARA JUNIOR:
 * Usamos el método POST para insertar nueva información a la Base de Datos.
 * A diferencia del GET (donde los datos viajan en la URL), aquí la información
 * sensible (como la contraseña) viene oculta en el 'req.body' en formato JSON.
 *
 * NOTA: Esta operación usa TRANSACCIONES de Sequelize.
 * Si alguna inserción falla, se hace ROLLBACK automático de ambas operaciones.
 * Esto garantiza consistencia: o se crean ambas (usuario + perfil) o ninguna.
 */
const createUser = async (req, res) => {
  // Crear transacción fuera del try-catch para control manual
  const transaction = await sequelize.transaction();

  try {
    // Desestructuramos las variables que el cliente nos envió en el cuerpo de la petición
    const { name, email, password } = req.body;

    // Validar campos requeridos para evitar guardar registros vacíos en la DB
    if (!name || !email || !password) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Nombre, email y contraseña son requeridos",
      });
    }

    // === OPERACIÓN 1: Crear usuario dentro de la transacción ===
    const newUser = await User.create(
      {
        name,
        email,
        password,
        role: "user",
      },
      { transaction }, // Pasamos la transacción como opción
    );

    // === OPERACIÓN 2: Crear perfil del usuario automáticamente ===
    await UserProfile.create(
      {
        userId: newUser.id,
        bio: null,
        phone: null,
      },
      { transaction }, // Misma transacción
    );

    // ✅ Todo salió bien: confirmar la transacción
    await transaction.commit();

    // No devolver la contraseña
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      status: "success",
      message: "Usuario y perfil creados correctamente en transacción",
      data: userResponse,
    });
  } catch (error) {
    // ❌ Algo salió mal: deshacer TODAS las operaciones (ROLLBACK)
    await transaction.rollback();

    console.error("Error al crear usuario (ROLLBACK ejecutado):", error);

    // Manejar errores de validación de Sequelize
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Error de validación",
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      status: "error",
      message: "Error al crear usuario. Transacción cancelada.",
      error: error.message,
    });
  }
};

/**
 * Actualizar un usuario
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, active } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para actualizar este usuario",
      });
    }

    // Actualizar solo los campos proporcionados
    const canChangeRole = req.user.role === "admin";

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      role: canChangeRole ? role || user.role : user.role,
      active: active !== undefined ? active : user.active,
    });

    // No devolver la contraseña
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      status: "success",
      message: "Usuario actualizado correctamente",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Error de validación",
        errors: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

/**
 * Eliminar un usuario
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${id} no encontrado`,
      });
    }

    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para eliminar este usuario",
      });
    }

    await user.destroy();

    res.json({
      status: "success",
      message: "Usuario eliminado correctamente",
      data: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

/**
 * Subir avatar del usuario autenticado
 * POST /api/users/:id/avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Debes enviar un archivo",
        data: null,
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${id} no encontrado`,
        data: null,
      });
    }

    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para subir avatar a este usuario",
        data: null,
      });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    await user.update({ avatar: avatarUrl });

    return res.status(200).json({
      status: "success",
      message: "Avatar subido correctamente",
      data: {
        id: user.id,
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al subir avatar",
      data: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};
