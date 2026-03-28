/**
 * ============================================
 * MIDDLEWARE DE LOGGING (logger.middleware.js)
 * ============================================
 *
 * Este middleware registra cada petición HTTP en un archivo de texto plano.
 * Cumple con el requerimiento de persistencia en archivos del Módulo 6.
 *
 * Información registrada:
 * - Fecha y hora de la petición
 * - Método HTTP (GET, POST, etc.)
 * - Ruta accedida
 * - IP del cliente
 * - User-Agent del navegador
 *
 * El uso de fs.appendFile() permite agregar líneas sin sobreescribir el archivo.
 */

// Módulo del sistema de archivos de Node.js
const fs = require("fs");

// Módulo para manejar rutas de archivos
const path = require("path");

// Definir la ruta del archivo de logs
const logsDir = path.join(__dirname, "../../logs");
const logFilePath = path.join(logsDir, "log.txt");

/**
 * Asegurar que el directorio de logs existe
 * Se crea de forma síncrona al cargar el módulo
 */
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log("📁 Directorio de logs creado:", logsDir);
}

/**
 * Middleware para registrar cada petición en log.txt
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const logRequest = (req, res, next) => {
  // Obtener la fecha y hora actual formateada
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = now.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Obtener información de la petición
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = req.get("User-Agent") || "unknown";

  // Construir la línea de log con formato estructurado
  const logEntry = `[${dateStr} ${timeStr}] ${method} ${url} | IP: ${ip} | UA: ${userAgent}\n`;

  // Escribir en el archivo de forma asíncrona
  // fs.appendFile() agrega al final del archivo sin sobreescribir
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      // Solo mostrar error en consola, no interrumpir la petición
      console.error("❌ Error al escribir en log:", err.message);
    }
  });

  // Continuar con el siguiente middleware/ruta
  // Es importante llamar a next() para no bloquear la petición
  next();
};

/**
 * Función auxiliar para registrar eventos personalizados
 * Puede usarse para registrar errores, inicio del servidor, etc.
 * @param {string} message - Mensaje a registrar
 * @param {string} type - Tipo de evento (INFO, ERROR, WARN, etc.)
 */
const logEvent = (message, type = "INFO") => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CL");
  const timeStr = now.toLocaleTimeString("es-CL");

  const logEntry = `[${dateStr} ${timeStr}] [${type}] ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("❌ Error al escribir evento en log:", err.message);
    }
  });
};

// Exportar las funciones del middleware
module.exports = {
  logRequest,
  logEvent,
};
