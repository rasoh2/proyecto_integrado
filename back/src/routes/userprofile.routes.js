/**
 * Rutas de Perfil de Usuario (UserProfile)
 * Define los endpoints para gestionar el perfil 1:1 de un usuario
 * Parte 3 - Módulo 8: API RESTful
 */

const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userprofile.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { uploadAvatar, handleUploadError } = require("../middlewares/upload.middleware");

/**
 * @route   GET /api/profile/me
 * @desc    Obtener el perfil del usuario autenticado
 * @access  Private (requiere autenticación)
 */
router.get("/me", authenticateToken, userProfileController.getMyProfile);

/**
 * @route   PUT /api/profile/me
 * @desc    Actualizar el perfil del usuario autenticado
 * @access  Private (requiere autenticación)
 * @body    { "bio": "string (max 255)", "phone": "string (max 30)" }
 */
router.put("/me", authenticateToken, userProfileController.updateMyProfile);

/**
 * @route   PUT /api/profile/avatar
 * @desc    Subir/Actualizar avatar del usuario
 * @access  Private
 */
router.put(
  "/avatar",
  authenticateToken,
  uploadAvatar.single("avatar"),
  handleUploadError,
  userProfileController.uploadAvatar
);

/**
 * @route   GET /api/profile/:userId
 * @desc    Obtener el perfil de un usuario (información pública limitada)
 * @access  Public
 */
router.get("/:userId", userProfileController.getUserProfile);

/**
 * @route   PUT /api/profile/:userId
 * @desc    Actualizar el perfil de un usuario específico
 * @access  Private (requiere ser el propietario o admin)
 * @body    { "bio": "string", "phone": "string" }
 */
router.put(
  "/:userId",
  authenticateToken,
  userProfileController.updateUserProfile,
);

/**
 * @route   DELETE /api/profile/:userId
 * @desc    Eliminar el perfil de un usuario
 * @access  Private (requiere ser el propietario o admin)
 */
router.delete(
  "/:userId",
  authenticateToken,
  userProfileController.deleteUserProfile,
);

module.exports = router;
