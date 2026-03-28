/**
 * ============================================
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN (app.js)
 * ============================================
 *
 * Justificación del nombre "app.js":
 * Se eligió "app.js" como archivo principal porque es una convención
 * ampliamente usada en proyectos Express. Este nombre indica claramente
 * que aquí se configura y exporta la "aplicación" Express.
 * Alternativamente, se podría usar "index.js" (punto de entrada por defecto de Node),
 * pero "app.js" es más descriptivo para aplicaciones web con Express.
 *
 * Este archivo es responsable de:
 * 1. Cargar variables de entorno
 * 2. Configurar Express y sus middlewares
 * 3. Montar las rutas de la aplicación
 * 4. Iniciar el servidor HTTP
 */

// ============================================
// 1. IMPORTACIÓN DE DEPENDENCIAS
// ============================================

// Framework Express para crear el servidor web
const express = require("express");

// CORS para permitir solicitudes desde otros dominios
const cors = require("cors");

// Módulo path para manejar rutas de archivos de forma segura entre sistemas operativos
const path = require("path");

// Cargar variables de entorno desde el archivo .env del proyecto
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath, override: true });

// Importar rutas de la aplicación
const mainRoutes = require("./routes/main.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const categoryRoutes = require("./routes/category.routes");
const userProfileRoutes = require("./routes/userprofile.routes");

// Importar middleware de logging a archivo
const { logRequest } = require("./middlewares/logger.middleware");

// Importar middleware de error global
const { errorHandler } = require("./middlewares/error.middleware");

// Importar Swagger (Documentación OpenAPI)
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Importar configuración de base de datos (Módulo 7)
const { testConnection, syncDatabase } = require("./models");

// ============================================
// 2. CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
// ============================================

// Crear instancia de la aplicación Express
const app = express();

// Obtener el puerto desde las variables de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// ============================================
// 3. CONFIGURACIÓN DE MIDDLEWARES
// ============================================
// NOTA PARA JUNIOR:
// Un "Middleware" es como un portero de discoteca. Cada vez que alguien entra (Request)
// pasa primero por aquí. Si todo está bien, los dejamos seguir a las rutas.

// Middleware para parsear JSON en las peticiones (req.body)
// Sin esto, nuestro servidor no entendería cuando desde Postman mandamos un objeto { "name": "leo" }
app.use(express.json());

// Middleware para parsear datos de formularios HTML (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Configurar CORS (Cross-Origin Resource Sharing)
// NOTA PARA JUNIOR: CORS permite que aplicaciones web desde otros dominios
// accedan a nuestra API. Por ejemplo, si tenemos un frontend en localhost:3001
// y backend en localhost:3000, sin CORS daría error.
app.use(
  cors({
    origin: "*", // Permitir todas las origins (en producción, especificar dominio)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Permitir envío de cookies
  }),
);

// Middleware personalizado para registrar cada petición en archivo log.txt
// Cada visita a nuestra página quedará guardada como evidencia en la carpeta /logs
app.use(logRequest);

// ============================================
// 4. SERVIR ARCHIVOS ESTÁTICOS
// ============================================
// NOTA PARA JUNIOR:
// Queremos que los usuarios puedan ver las imágenes (como las del carrusel) o leer el archivo CSS.
// Si no pusiéramos 'express.static', tendríamos que programar una ruta GET por CADA imagen.
// Con 'express.static' le decimos a Express: "Todo lo que esté en /public o /uploads, muéstralo libremente al navegador".
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================================
// 4.1 SERVIR FRONTEND (MÓDULO 8 - INTEGRACIÓN)
// ============================================
// Servir los archivos del frontend (alke-wallet) desde la raíz
// Esto permite acceder a index.html, menu.html, etc. desde localhost:3000
app.use(express.static(path.join(__dirname, "../../alke-wallet")));

// ============================================
// 5. CONFIGURACIÓN DE RUTAS
// ============================================

// Montar la documentación Swagger (Bonus Módulo 8)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Montar las rutas principales en la raíz de la aplicación
app.use("/", mainRoutes);

// Rutas de autenticación JWT (registro/login)
app.use("/api/auth", authRoutes);

// Rutas de la API de usuarios (Módulo 7 - CRUD)
app.use("/api/users", userRoutes);

// Rutas de Perfil de Usuario (Módulo 8 - UserProfile 1:1)
app.use("/api/profile", userProfileRoutes);

// Rutas CRUD de posts (Módulos 7 y 8)
app.use("/api/posts", postRoutes);

// Rutas CRUD de categorías (Módulo 8 - Parte 3)
app.use("/api/categories", categoryRoutes);

// ============================================
// 6. MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================

// Middleware para capturar rutas que no existen
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// ============================================
// 8. MANEJO DE ERRORES GLOBAL
// ============================================

// Middleware de error DEBE SER EL ÚLTIMO
app.use(errorHandler);

// ============================================
// 7. INICIAR EL SERVIDOR
// ============================================

/**
 * Función para iniciar el servidor
 * Primero conecta a la base de datos y luego inicia Express
 */
const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("Falta configurar JWT_SECRET en variables de entorno");
    }

    // Conectar a la base de datos
    await testConnection();

    // Sincronizar modelos con la base de datos
    // force: false para no eliminar datos existentes
    await syncDatabase(false);

    // Iniciar el servidor HTTP
    const server = app.listen(PORT, () => {
      console.log("============================================");
      console.log("🚀 Servidor iniciado correctamente");
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log("============================================");
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `❌ El puerto ${PORT} ya está en uso. Cierra el proceso que usa ese puerto o cambia PORT en .env.`,
        );
      } else {
        console.error("❌ Error del servidor HTTP:", error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

// Exportar la app para testing (se usará en módulos posteriores)
module.exports = app;
