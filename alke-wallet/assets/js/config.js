/**
 * ALKE WALLET - Configuración Global
 * config.js - Variables globales y endpoints de API
 * Desarrollado para el Bootcamp SENCE 2025
 *
 * Este archivo centraliza:
 * - URL base de la API
 * - Headers por defecto
 * - Funciones auxiliares para llamadas HTTP
 */

// ============================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================

// URL BASE DE LA API (modificar según tu ambiente)
// - Desarrollo: http://localhost:3000
// - Producción: https://tu-dominio.com
const API_BASE_URL = "http://localhost:3000";

// ENDPOINTS DE LA API
const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  // Usuarios
  USERS: {
    GET_ALL: `${API_BASE_URL}/api/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    CREATE: `${API_BASE_URL}/api/users`,
    UPDATE: (id) => `${API_BASE_URL}/api/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/users/${id}`,
  },
  // Transacciones/Posts
  POSTS: {
    GET_ALL: `${API_BASE_URL}/api/posts`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/posts/${id}`,
    CREATE: `${API_BASE_URL}/api/posts`,
    UPDATE: (id) => `${API_BASE_URL}/api/posts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/posts/${id}`,
  },
  // Perfil
  PROFILE: {
    GET: `${API_BASE_URL}/api/profile`,
    UPDATE: `${API_BASE_URL}/api/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/api/profile/avatar`,
  },
};

// ============================================
// FUNCIONES AUXILIARES HTTP
// ============================================

/**
 * Realizar una llamada HTTP genérica
 * @param {string} url - URL del endpoint
 * @param {object} options - Opciones fetch
 * @returns {Promise<object>} Respuesta del servidor
 */
async function httpRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Agregar token JWT si existe
  const token = localStorage.getItem("token");
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Combinar opciones
  const finalOptions = { ...defaultOptions, ...options };
  if (options.headers) {
    finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
  }

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    // Si no es exitoso, revelear el error
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || "Error en la solicitud",
        data: data.data,
      };
    }

    return data;
  } catch (error) {
    console.error("❌ Error en requestHTTP:", error);
    throw error;
  }
}

/**
 * GET - Obtener datos
 */
async function apiGET(url) {
  return httpRequest(url, { method: "GET" });
}

/**
 * POST - Crear datos
 */
async function apiPOST(url, body) {
  return httpRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PUT - Actualizar datos
 */
async function apiPUT(url, body) {
  return httpRequest(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE - Eliminar datos
 */
async function apiDELETE(url) {
  return httpRequest(url, { method: "DELETE" });
}

/**
 * Guardar token JWT en localStorage
 */
function saveToken(token) {
  localStorage.setItem("token", token);
}

/**
 * Obtener token JWT del localStorage
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Limpiar token JWT (logout)
 */
function clearToken() {
  localStorage.removeItem("token");
}

/**
 * Verificar si el usuario está autenticado
 */
function isAuthenticated() {
  const token = getToken();
  return !!token;
}

// ============================================
// EXPORTAR PARA USO EN OTROS ARCHIVOS
// ============================================

// Nota: Si usas módulos ES6, descomenta las líneas siguientes
// export { API_BASE_URL, API_ENDPOINTS, apiGET, apiPOST, apiPUT, apiDELETE, saveToken, getToken, clearToken, isAuthenticated };
