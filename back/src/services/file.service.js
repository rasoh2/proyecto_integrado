/**
 * ============================================
 * SERVICIO DE ARCHIVOS (file.service.js)
 * ============================================
 *
 * Servicio para manejar operaciones con el sistema de archivos.
 * Centraliza la lógica de lectura/escritura para mantener
 * los controladores más limpios.
 */

const fs = require("fs");
const path = require("path");

/**
 * Lee el contenido de un archivo de texto
 * @param {string} filePath - Ruta del archivo
 * @returns {Promise<string>} - Contenido del archivo
 */
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Escribe contenido en un archivo (sobreescribe)
 * @param {string} filePath - Ruta del archivo
 * @param {string} content - Contenido a escribir
 * @returns {Promise<void>}
 */
const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    // Asegurar que el directorio existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Agrega contenido al final de un archivo
 * @param {string} filePath - Ruta del archivo
 * @param {string} content - Contenido a agregar
 * @returns {Promise<void>}
 */
const appendFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Verifica si un archivo existe
 * @param {string} filePath - Ruta del archivo
 * @returns {boolean}
 */
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

module.exports = {
  readFile,
  writeFile,
  appendFile,
  fileExists,
};
