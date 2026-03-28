/**
 * Middleware de Paginación
 * Normaliza los parámetros de paginación para una interfaz consistente
 * Parte 3 - Módulo 8: Escalabilidad
 */

/**
 * Middleware que normaliza parámetros de paginación
 * Espera: ?page=1&limit=10&sort=-createdAt
 * Asigna a req.pagination:
 *   - page: número de página (1-based)
 *   - limit: registros por página
 *   - offset: desplazamiento para BD
 *   - sort: orden SQL { field, order }
 */
const paginationMiddleware = (req, res, next) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

  // Validar y normalizar
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Máximo 100 registros
  const offset = (pageNum - 1) * limitNum;

  // Parsear sort (formato: -field o field)
  let sortField = "createdAt";
  let sortOrder = "DESC";

  if (typeof sort === "string" && sort) {
    if (sort.startsWith("-")) {
      sortField = sort.substring(1);
      sortOrder = "DESC";
    } else {
      sortField = sort;
      sortOrder = "ASC";
    }

    // Validar que el campo sea seguro (evitar inyección)
    // En producción, comparar contra un whitelist
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(sortField)) {
      sortField = "createdAt";
      sortOrder = "DESC";
    }
  }

  // Asignar a req para que los controladores accedan
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset,
    sort: [sortField, sortOrder],
  };

  next();
};

module.exports = { paginationMiddleware };
