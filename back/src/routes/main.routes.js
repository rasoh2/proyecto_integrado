/**
 * ============================================
 * RUTAS PRINCIPALES (main.routes.js)
 * ============================================
 *
 * Este archivo define las rutas públicas de la aplicación.
 * Siguiendo el patrón MVC, las rutas solo definen los endpoints
 * y delegan la lógica al controlador correspondiente.
 *
 * Rutas definidas:
 * - GET /       : Página de inicio (respuesta HTML)
 * - GET /status : Estado del servidor (respuesta JSON)
 * - GET /api/info : Información de la API (respuesta JSON)
 */

// Importar el Router de Express para crear rutas modulares
const express = require("express");
const router = express.Router();

// Importar el controlador que maneja la lógica de cada ruta
const mainController = require("../controllers/main.controller");

// ============================================
// DEFINICIÓN DE RUTAS PÚBLICAS
// ============================================

/**
 * GET /status
 * Ruta de estado - Devuelve información del servidor en formato JSON
 * Útil para health checks y monitoreo
 */
router.get("/status", mainController.getStatus);

/**
 * GET /api/info
 * Información de la API - Devuelve detalles de la aplicación en JSON
 */
router.get("/api/info", mainController.getApiInfo);

// Exportar el router para usarlo en app.js
module.exports = router;
