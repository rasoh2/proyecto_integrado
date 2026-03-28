/**
 * Controlador de Perfil de Usuario
 * Maneja las operaciones sobre el perfil relacionado 1:1 con User
 * Parte 3 - Módulo 8: API RESTful
 */

const { User, UserProfile } = require("../models");

/**
 * Obtener el perfil del usuario autenticado
 * GET /api/profile/me
 * Requiere autenticación
 */
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["id", "bio", "phone", "createdAt", "updatedAt"],
        },
      ],
      attributes: ["id", "name", "email", "role", "active", "avatar"],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

/**
 * Obtener el perfil de un usuario específico
 * GET /api/profile/:userId
 * Público - información limitada
 */
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["bio", "phone", "createdAt"],
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "avatar",
        "role",
        "updatedAt",
        "createdAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${userId} no encontrado`,
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Perfil de usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener perfil de usuario",
      error: error.message,
    });
  }
};

/**
 * Actualizar el perfil del usuario autenticado
 * PUT /api/profile/me
 * Requiere autenticación
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, phone } = req.body;

    // Validaciones
    if (bio && typeof bio !== "string") {
      return res.status(400).json({
        status: "error",
        message: "La biografía debe ser texto",
        data: null,
      });
    }

    if (bio && bio.length > 255) {
      return res.status(400).json({
        status: "error",
        message: "La biografía no debe exceder 255 caracteres",
        data: null,
      });
    }

    if (phone && typeof phone !== "string") {
      return res.status(400).json({
        status: "error",
        message: "El teléfono debe ser texto",
        data: null,
      });
    }

    if (phone && phone.length > 30) {
      return res.status(400).json({
        status: "error",
        message: "El teléfono no debe exceder 30 caracteres",
        data: null,
      });
    }

    // Buscar o crear el perfil
    let profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      profile = await UserProfile.create({
        userId,
        bio: bio || null,
        phone: phone || null,
      });
    } else {
      // Actualizar
      if (bio !== undefined) profile.bio = bio;
      if (phone !== undefined) profile.phone = phone;
      await profile.save();
    }

    // Obtener usuario completo para respuesta
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["id", "bio", "phone", "createdAt", "updatedAt"],
        },
      ],
      attributes: ["id", "name", "email", "role", "active", "avatar"],
    });

    return res.status(200).json({
      status: "success",
      message: "Perfil actualizado correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};

/**
 * Actualizar el perfil de un usuario específico
 * PUT /api/profile/:userId
 * Requiere autenticación y ser admin o propietario
 */
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, phone } = req.body;

    // Validaciones de permiso
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para actualizar este perfil",
        data: null,
      });
    }

    // Validaciones de datos
    if (bio && typeof bio !== "string") {
      return res.status(400).json({
        status: "error",
        message: "La biografía debe ser texto",
        data: null,
      });
    }

    if (bio && bio.length > 255) {
      return res.status(400).json({
        status: "error",
        message: "La biografía no debe exceder 255 caracteres",
        data: null,
      });
    }

    if (phone && typeof phone !== "string") {
      return res.status(400).json({
        status: "error",
        message: "El teléfono debe ser texto",
        data: null,
      });
    }

    if (phone && phone.length > 30) {
      return res.status(400).json({
        status: "error",
        message: "El teléfono no debe exceder 30 caracteres",
        data: null,
      });
    }

    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ID ${userId} no encontrado`,
        data: null,
      });
    }

    // Buscar o crear el perfil
    let profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      profile = await UserProfile.create({
        userId,
        bio: bio || null,
        phone: phone || null,
      });
    } else {
      if (bio !== undefined) profile.bio = bio;
      if (phone !== undefined) profile.phone = phone;
      await profile.save();
    }

    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["id", "bio", "phone", "createdAt", "updatedAt"],
        },
      ],
      attributes: ["id", "name", "email", "role", "active", "avatar"],
    });

    return res.status(200).json({
      status: "success",
      message: "Perfil actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};

/**
 * Eliminar el perfil de un usuario (soft delete)
 * Nota: En una aplicación real, probablemente no querramos permitir esto
 */
const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Control de permisos
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar este perfil",
        data: null,
      });
    }

    const profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Perfil no encontrado",
        data: null,
      });
    }

    await profile.destroy();

    return res.status(200).json({
      status: "success",
      message: "Perfil eliminado correctamente",
      data: { userId },
    });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar perfil",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadAvatar,
};

/**
 * Subir avatar del usuario autenticado
 * POST/PUT /api/profile/avatar
 * Requiere autenticación
 */
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No se ha subido ningún archivo',
        data: null,
      });
    }

    const avatarUrl = '/uploads/' + req.file.filename;

    // Actualizar el usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    user.avatar = avatarUrl;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Avatar actualizado correctamente',
      data: {
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Error al subir avatar:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al procesar el archivo',
      error: error.message,
    });
  }
};
