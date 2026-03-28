/**
 * ============================================
 * CONTROLADOR PRINCIPAL (main.controller.js)
 * ============================================
 *
 * Los controladores contienen la lógica de negocio de cada ruta.
 * Reciben la petición (req), procesan los datos y envían la respuesta (res).
 *
 * Esto permite separar las rutas de la lógica, facilitando:
 * - Testing unitario de la lógica
 * - Reutilización de código
 * - Mantenimiento más sencillo
 */

const fs = require("fs");
const path = require("path");
const { User } = require("../models");

/**
 * GET /
 * Controlador para la página de inicio
 * Devuelve una respuesta HTML con información de bienvenida
 */
const getHome = async (req, res) => {
  try {
    // NOTA PARA JUNIOR:
    // Aquí usamos Sequelize (nuestro ORM) para buscar en la Base de Datos.
    // Le estamos diciendo: "Tráeme todos los 'User' donde la columna 'avatar' NO (Op.not) sea nula".
    // Esto es equivalente a un "SELECT id, name, avatar FROM users WHERE avatar IS NOT NULL".
    const usersWithAvatar = await User.findAll({
      where: {
        avatar: {
          [require("sequelize").Op.not]: null,
        },
      },
      attributes: ["id", "name", "avatar"], // Solo traemos los campos que necesitamos para ser más rápidos
    });

    // Construir los elementos de la galería
    // NOTA PARA JUNIOR:
    // Mapeamos (map) el arreglo de usuarios que nos devolvió la BD para generar un bloque <div/> de HTML por cada uno.
    let galleryHTML = "";
    if (usersWithAvatar.length > 0) {
      galleryHTML = usersWithAvatar
        .map(
          (user) => `
        <div style="text-align: center; background: #f9f9f9; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="${user.avatar}" alt="${user.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid #007bff; margin-bottom: 10px;">
          <p style="margin: 0; font-weight: bold; color: #333;">${user.name}</p>
        </div>
      `,
        )
        .join("");
    } else {
      galleryHTML =
        "<p style='grid-column: 1 / -1; text-align: center;'>Aún no hay avatares subidos.</p>";
    }

    // Construir respuesta HTML
    // NOTA PARA JUNIOR:
    // Express permite devolver JSON (como en nuestras APIs) pero también Texto Plano o HTML (res.send).
    // Aquí estamos inyectando variables directamente en el HTML usando 'Template Literals' con backticks (`).
    // Por ejemplo: \${galleryHTML} inyecta todas las fotos que trajimos de la BD previamente.
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Node Express WebApp</title>
        <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🚀 Node Express WebApp</h1>
                <p class="subtitle">Proyecto Evaluación Módulos 6, 7 y 8</p>
            </header>
            
            <main>
                <section class="gallery-card" style="margin-top: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; text-align: center;">📸 Evidencias de Proyecto</h2>
                    
                    <h3 style="margin-top: 20px; color: #555;">Galería de Avatares (Usuarios en BD)</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin-top: 10px; margin-bottom: 30px;">
                        ${galleryHTML}
                    </div>

                    <h3 style="margin-top: 20px; color: #555;">Carrusel de Capturas CRUD - Módulo 7 (BD + Relaciones + Transacciones)</h3>
                    <div class="carousel-container" style="position: relative; max-width: 800px; margin: 20px auto; overflow: hidden; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); background: #222;">
                        <div class="carousel-slides" style="display: flex; transition: transform 0.5s ease-in-out;" id="slides">
                            <!-- Diapositiva 1: CREATE Usuario -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/1_create_usuario.png" alt="Captura 1 - POST CREATE Usuario" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+1_create_usuario.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>1️⃣ CREATE:</b> POST /api/users - Crear Usuario
                                </div>
                            </div>
                            <!-- Diapositiva 2: READ Lista -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/2_get_lista_usuarios.png" alt="Captura 2 - GET Lista Usuarios" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+2_get_lista_usuarios.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>2️⃣ READ:</b> GET /api/users - Listar con Paginación
                                </div>
                            </div>
                            <!-- Diapositiva 3: READ Por ID -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/3_get_usuario_por_id.png" alt="Captura 3 - GET Usuario por ID" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+3_get_usuario_por_id.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>3️⃣ READ:</b> GET /api/users/:id - Obtener Usuario
                                </div>
                            </div>
                            <!-- Diapositiva 4: UPDATE -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/4_put_actualizar_usuario.png" alt="Captura 4 - PUT Actualizar Usuario" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+4_put_actualizar_usuario.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>4️⃣ UPDATE:</b> PUT /api/users/:id - Actualizar Usuario
                                </div>
                            </div>
                            <!-- Diapositiva 5: DELETE -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/5_delete_usuario.png" alt="Captura 5 - DELETE Usuario" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+5_delete_usuario.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>5️⃣ DELETE:</b> DELETE /api/users/:id - Eliminar Usuario
                                </div>
                            </div>
                            <!-- Diapositiva 6: POST Categoría (Relación N:M) -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/6_post_crear_categoria.png" alt="Captura 6 - POST Crear Categoría" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+6_post_crear_categoria.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>6️⃣ RELACIONES:</b> POST /api/categories - Crear Categoría
                                </div>
                            </div>
                            <!-- Diapositiva 7: POST Post con Categorías (TRANSACCIÓN) -->
                            <div style="min-width: 100%; box-sizing: border-box; position: relative;">
                                <img src="/img/7_post_crear_post_con_categorias.png" alt="Captura 7 - POST Crear Post con Categorías" style="width: 100%; display: block; height: 500px; object-fit: contain; background: #f5f5f5;" onerror="this.src='https://via.placeholder.com/800x500/2a2a2a/ffffff?text=Falta+7_post_crear_post_con_categorias.png'">
                                <div style="position: absolute; bottom: 0; background: rgba(0,0,0,0.8); width: 100%; color: white; text-align: center; padding: 10px 0;">
                                    <b>7️⃣ TRANSACCIÓN:</b> POST /api/posts - Crear Post + Categorías (ACID)
                                </div>
                            </div>
                        </div>
                        
                        <button onclick="moverSlide(-1)" style="position: absolute; top: 50%; left: 10px; transform: translateY(-50%); background: rgba(255,255,255,0.7); border: none; font-size: 24px; cursor: pointer; padding: 10px 15px; border-radius: 5px; z-index: 10; hover: background: rgba(255,255,255,0.9);">&#10094;</button>
                        <button onclick="moverSlide(1)" style="position: absolute; top: 50%; right: 10px; transform: translateY(-50%); background: rgba(255,255,255,0.7); border: none; font-size: 24px; cursor: pointer; padding: 10px 15px; border-radius: 5px; z-index: 10; hover: background: rgba(255,255,255,0.9);">&#10095;</button>
                    </div>

                    <script>
                        let slideActual = 0;
                        function moverSlide(direccion) {
                            const slides = document.getElementById('slides');
                            const totalSlides = 7; // 7 capturas de CRUD Módulo 7
                            slideActual += direccion;
                            
                            if (slideActual >= totalSlides) slideActual = 0; // Volver al inicio
                            if (slideActual < 0) slideActual = totalSlides - 1; // Ir al final
                            
                            slides.style.transform = 'translateX(' + (-slideActual * 100) + '%)';
                        }
                        
                        // Rotar cada 6 segundos
                        setInterval(() => moverSlide(1), 6000);
                    </script>
                </section>

                <section class="info-card">
                    <h2>📋 Información del Proyecto</h2>
                    <ul>
                        <li><strong>Servidor:</strong> Express.js</li>
                        <li><strong>Runtime:</strong> Node.js v${process.version}</li>
                        <li><strong>Entorno:</strong> ${process.env.NODE_ENV || "development"}</li>
                        <li><strong>Puerto:</strong> ${process.env.PORT || 3000}</li>
                    </ul>
                </section>

                <section class="endpoints-card">
                    <h2>🔗 Endpoints Disponibles</h2>
                    <ul>
                        <li><a href="/">/</a> - Esta página (HTML)</li>
                        <li><a href="/status">/status</a> - Estado del servidor (JSON)</li>
                        <li><a href="/api/info">/api/info</a> - Info de la API (JSON)</li>
                    </ul>
                </section>

                <section class="modules-card">
                    <h2>📚 Módulos del Proyecto</h2>
                    <div class="modules-grid">
                        <div class="module completed">
                            <h3>Módulo 6</h3>
                            <p>Servidor Express, Rutas y Persistencia</p>
                          <span class="badge">Completado</span>
                        </div>
                        <div class="module completed">
                            <h3>Módulo 7</h3>
                            <p>Base de datos y ORM</p>
                          <span class="badge">Completado</span>
                        </div>
                        <div class="module completed">
                            <h3>Módulo 8</h3>
                            <p>API REST y JWT</p>
                          <span class="badge">Completado</span>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2026 - Bootcamp Full Stack JavaScript</p>
            </footer>
        </div>
    </body>
    </html>
    `;

    // Enviar respuesta HTML con código 200 (OK)
    res.status(200).send(htmlResponse);
  } catch (error) {
    console.error("Error al generar la página de inicio:", error);
    res.status(500).send("<h1>Error interno del servidor</h1>");
  }
};

/**
 * GET /status
 * Controlador para verificar el estado del servidor
 * Devuelve información útil para health checks y monitoreo
 */
const getStatus = (req, res) => {
  // Calcular tiempo de actividad del servidor en segundos
  const uptimeSeconds = process.uptime();

  // Formatear el tiempo de actividad de manera legible
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  // Construir objeto de respuesta con formato consistente
  const statusResponse = {
    status: "success",
    message: "Servidor funcionando correctamente",
    data: {
      server: "Node Express WebApp",
      status: "online",
      timestamp: new Date().toISOString(),
      uptime: {
        raw: uptimeSeconds,
        formatted: `${hours}h ${minutes}m ${seconds}s`,
      },
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      memoryUsage: {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      },
    },
  };

  // Enviar respuesta JSON con código 200
  res.status(200).json(statusResponse);
};

/**
 * GET /api/info
 * Controlador para obtener información de la API
 * Útil para documentación y descubrimiento de endpoints
 */
const getApiInfo = (req, res) => {
  const apiInfo = {
    status: "success",
    message: "Información de la API",
    data: {
      name: "Node Express WebApp API",
      version: "1.0.0",
      description: "API RESTful para gestión de usuarios y datos",
      author: "Sebastian",
      modules: {
        module6: {
          name: "Primeros pasos con Node y Express",
          status: "completado",
          features: [
            "Servidor Express configurado",
            "Rutas públicas",
            "Archivos estáticos",
            "Persistencia en archivos planos",
          ],
        },
        module7: {
          name: "Base de datos y ORM",
          status: "completado",
          features: [
            "Conexión a MySQL",
            "Modelos con Sequelize",
            "Operaciones CRUD",
            "Relaciones 1:1, 1:N y N:M",
          ],
        },
        module8: {
          name: "API RESTful y Seguridad",
          status: "completado",
          features: [
            "Autenticación JWT",
            "Rutas protegidas",
            "Subida de archivos",
            "Validaciones",
          ],
        },
      },
      endpoints: {
        public: [
          { method: "GET", path: "/", description: "Página de inicio" },
          {
            method: "GET",
            path: "/status",
            description: "Estado del servidor",
          },
          { method: "GET", path: "/api/info", description: "Esta información" },
        ],
        protected: [
          {
            method: "GET",
            path: "/api/users",
            description: "Listar usuarios (requiere JWT)",
          },
          {
            method: "POST",
            path: "/api/auth/login",
            description: "Iniciar sesión y obtener token JWT",
          },
          {
            method: "POST",
            path: "/api/users/:id/avatar",
            description: "Subir avatar (JPG/PNG/WEBP, max 2MB)",
          },
          {
            method: "GET",
            path: "/api/posts",
            description: "CRUD de posts con filtros dinamicos",
          },
        ],
      },
    },
  };

  res.status(200).json(apiInfo);
};

// Exportar los controladores para usarlos en las rutas
module.exports = {
  getHome,
  getStatus,
  getApiInfo,
};
