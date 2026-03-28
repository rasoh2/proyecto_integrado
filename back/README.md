# 🚀 Node Express WebApp - API RESTful

## Proyecto de Evaluación - Módulos 6, 7 y 8

**Bootcamp Full Stack JavaScript 2026**

> Aplicación backend profesional con Node.js, Express y PostgreSQL. Implementación progresiva de arquitectura modular, autenticación JWT, y API RESTful completa.

---

## 📋 Descripción del Proyecto

Aplicación web backend desarrollada con **Node.js** y **Express** para gestión de usuarios, posts y categorías. Este proyecto demuestra las habilidades adquiridas en los 3 módulos del programa de formación.

### ✅ Objetivos Alcanzados

- ✅ **Módulo 6**: Servir contenido dinámico, rutas públicas/privadas, persistencia en archivos
- ✅ **Módulo 7**: Integración BD (PostgreSQL), ORM (Sequelize), relaciones 1:1, 1:N, N:M
- ✅ **Módulo 8**: API RESTful, autenticación JWT, subida de archivos, seguridad

---

## 📁 Estructura del Proyecto

```
node-express-webapp/
├── 📂 logs/                         # Registros de accesos (persistencia archivo)
│   └── log.txt                      # Modelo 6: Logging
├── 📂 public/                       # Archivos estáticos
│   └── css/
│       └── styles.css
├── 📂 src/                          # Código fuente
│   ├── 📂 config/
│   │   └── database.js              # Conexión PostgreSQL + Sequelize
│   ├── 📂 controllers/              # Lógica de negocio (patrón MVC)
│   │   ├── main.controller.js
│   │   ├── user.controller.js       # CRUD usuarios
│   │   ├── userprofile.controller.js # CRUD perfil (1:1)
│   │   ├── auth.controller.js       # Autenticación JWT
│   │   ├── post.controller.js       # CRUD posts (1:N)
│   │   └── category.controller.js   # CRUD categorías (N:M)
│   ├── 📂 middlewares/              # Funciones intermedias
│   │   ├── logger.middleware.js     # Logging a archivo
│   │   ├── auth.middleware.js       # Protección JWT
│   │   ├── error.middleware.js      # Manejo errores global
│   │   ├── pagination.middleware.js # Paginación reutilizable
│   │   └── upload.middleware.js     # Validación multer
│   ├── 📂 models/                   # Modelos Sequelize
│   │   ├── index.js                 # Relaciones
│   │   ├── User.model.js
│   │   ├── UserProfile.model.js     # Relación 1:1
│   │   ├── Post.model.js            # Relación 1:N
│   │   └── Category.model.js        # Relación N:M
│   ├── 📂 routes/                   # Rutas API
│   │   ├── main.routes.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js           # /api/users
│   │   ├── userprofile.routes.js    # /api/profile
│   │   ├── post.routes.js           # /api/posts
│   │   └── category.routes.js       # /api/categories
│   ├── 📂 services/
│   │   └── file.service.js
│   └── app.js                       # Punto de entrada Express
├── 📂 uploads/                      # Almacenamiento de archivos subidos
├── .env                             # Variables de entorno (no en Git)
├── .env.example                     # Plantilla configuración
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Requisitos del Sistema

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **PostgreSQL**: v14 o superior (para Módulos 7 y 8)
- **Sistema Operativo**: Windows, macOS o Linux

### Verificar versión de Node.js:

```bash
node --version
# Debe mostrar v18.x.x o superior
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/node-express-webapp.git
cd node-express-webapp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tus valores (puerto, base de datos, etc.)
# En Windows:
copy .env.example .env
```

### 4. Editar el archivo .env

```env
PORT=3000
NODE_ENV=development
```

---

## 🚀 Ejecución

### Modo desarrollo (con recarga automática)

```bash
npm run dev
```

> Utiliza `nodemon` para reiniciar automáticamente el servidor cuando detecta cambios.

### Modo producción

```bash
npm start
```

> Ejecuta el servidor con Node.js directamente.

### Resultado esperado:

```
============================================
🚀 Servidor iniciado correctamente
📍 URL: http://localhost:3000
🌍 Entorno: development
============================================
```

---

## 🔗 Endpoints Disponibles

### Rutas Públicas (Módulo 6)

| Método | Ruta        | Descripción           | Respuesta |
| ------ | ----------- | --------------------- | --------- |
| GET    | `/`         | Página de inicio      | HTML      |
| GET    | `/status`   | Estado del servidor   | JSON      |
| GET    | `/api/info` | Información de la API | JSON      |

### Rutas de Usuarios - API REST (Módulo 7)

| Método | Ruta             | Descripción               | Respuesta |
| ------ | ---------------- | ------------------------- | --------- |
| GET    | `/api/users`     | Listar todos los usuarios | JSON      |
| GET    | `/api/users/:id` | Obtener usuario por ID    | JSON      |
| POST   | `/api/users`     | Crear nuevo usuario       | JSON      |
| PUT    | `/api/users/:id` | Actualizar usuario        | JSON      |
| DELETE | `/api/users/:id` | Eliminar usuario          | JSON      |

### Rutas de Autenticación - API REST (Módulo 8)

| Método | Ruta                 | Descripción                       | Respuesta |
| ------ | -------------------- | --------------------------------- | --------- |
| POST   | `/api/auth/register` | Registro de usuario y JWT         | JSON      |
| POST   | `/api/auth/login`    | Login y obtención de JWT          | JSON      |
| GET    | `/api/auth/me`       | Perfil autenticado (ruta privada) | JSON      |

### Rutas de Posts - API REST (Módulo 7 + 8)

| Método | Ruta             | Descripción                                | Respuesta |
| ------ | ---------------- | ------------------------------------------ | --------- |
| GET    | `/api/posts`     | Listar posts (filtros: search, category)   | JSON      |
| GET    | `/api/posts/:id` | Obtener post por ID con autor y categorías | JSON      |
| POST   | `/api/posts`     | Crear post autenticado (con transacción)   | JSON      |
| PUT    | `/api/posts/:id` | Actualizar post (autor o admin)            | JSON      |
| DELETE | `/api/posts/:id` | Eliminar post (autor o admin)              | JSON      |

### Rutas de Perfiles - API REST (Módulo 7)

| Método | Ruta                   | Descripción                   | Respuesta |
| ------ | ---------------------- | ----------------------------- | --------- |
| GET    | `/api/profile/me`      | Mi perfil autenticado         | JSON      |
| PUT    | `/api/profile/me`      | Actualizar mi perfil          | JSON      |
| GET    | `/api/profile/:userId` | Ver perfil público de usuario | JSON      |
| PUT    | `/api/profile/:userId` | Actualizar perfil de usuario  | JSON      |
| DELETE | `/api/profile/:userId` | Eliminar perfil de usuario    | JSON      |

### Rutas de Categorías - API REST (Módulo 7 + 8)

| Método | Ruta                  | Descripción                      | Respuesta |
| ------ | --------------------- | -------------------------------- | --------- |
| GET    | `/api/categories`     | Listar categorías con paginación | JSON      |
| GET    | `/api/categories/:id` | Obtener categoría con posts      | JSON      |
| POST   | `/api/categories`     | Crear categoría (protegida)      | JSON      |
| PUT    | `/api/categories/:id` | Actualizar categoría             | JSON      |
| DELETE | `/api/categories/:id` | Eliminar categoría               | JSON      |

### Subida de Archivos (Módulo 8)

| Método | Ruta                    | Descripción                                  | Respuesta |
| ------ | ----------------------- | -------------------------------------------- | --------- |
| POST   | `/api/users/:id/avatar` | Subir avatar (`avatar`) JPG/PNG/WEBP max 2MB | JSON      |

### Ejemplos de Uso

**Obtener estado del servidor:**

```bash
curl http://localhost:3000/status
```

**Respuesta:**

```json
{
  "status": "success",
  "message": "Servidor funcionando correctamente",
  "data": {
    "server": "Node Express WebApp",
    "status": "online",
    "timestamp": "2026-03-04T12:00:00.000Z",
    "uptime": {
      "raw": 120.5,
      "formatted": "0h 2m 0s"
    }
  }
}
```

---

## � MÓDULO VII: Acceso a Datos con ORM

### Arquitectura de Base de Datos

**Engine**: PostgreSQL v14+  
**ORM**: Sequelize v6+  
**Patrón**: MVC con modularización por capas

### Modelos Implementados

#### **1. User (Modelo Principal)**

Representa a los usuarios del sistema. Almacena credenciales y datos básicos.

```javascript
{
  id: Integer (Primary Key),
  name: String(100),
  email: String(150) - UNIQUE,
  password: String(255) - HASHEADO,
  role: Enum('admin', 'user'),
  active: Boolean (default: true),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Relaciones:**

- ↔️ **1:1 con UserProfile** - `onDelete: CASCADE`
- ↔️ **1:N con Post** - Un usuario tiene muchos posts
- ↔️ **Hereda de Sequelize** - Timestamps automáticos

---

#### **2. UserProfile (Modelo 1:1)**

Extiende la información del usuario con datos adicionales.

```javascript
{
  id: Integer (Primary Key),
  userId: Integer (Foreign Key → User),
  bio: String(255),
  phone: String(30),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Características:**

- ✅ Relación **one-to-one** con User
- ✅ Foreign key con cascada (si se elimina User, se elimina Profile)
- ✅ Acceso vía `user.profile` o `user.getProfile()`

---

#### **3. Post (Modelo 1:N)**

Artículos/contenido creado por usuarios.

```javascript
{
  id: Integer (Primary Key),
  title: String(150),
  content: Text,
  published: Boolean (default: false),
  userId: Integer (Foreign Key → User),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Características:**

- ✅ Relación **one-to-many** con User
- ✅ Relación **many-to-many** con Category (via `post_categories`)
- ✅ Busqueda por título y contenido

---

#### **4. Category (Modelo N:M)**

Categorías para clasificar posts.

```javascript
{
  id: Integer (Primary Key),
  name: String(80) - UNIQUE,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Características:**

- ✅ Relación **many-to-many** con Post
- ✅ Tabla de enlace: `post_categories` (creada automáticamente)

---

---

## 🏗️ DECISIONES TÉCNICAS - MÓDULO 7

### 1. **¿Por qué PostgreSQL + Sequelize?**

**PostgreSQL:**

- ✅ Soporte nativo para relaciones complejas (1:1, 1:N, N:M)
- ✅ ACID compliance garantizado (seguridad de transacciones)
- ✅ Ideal para producción y datos relacionados
- ✅ Mejor que SQLite para aplicaciones serias

**Sequelize (ORM):**

- ✅ Abstracción de SQL crudo → código limpio y mantenible
- ✅ Relaciones automáticas (associations)
- ✅ Transacciones integradas (begintransaction, commit, rollback)
- ✅ Validaciones a nivel modelo
- ✅ Migraciones automáticas

**Alternativa rechazada:** Raw SQL o `mysql2` - demasiado manual y error-prone.

---

### 2. **Relaciones Implementadas (3 tipos)**

#### **1:1 (Usuario → UserProfile)**

```javascript
User.hasOne(UserProfile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
```

- Un usuario tiene exactamente **1** perfil
- Si se eliminan usuarios, su perfil se elimina automático (CASCADE)
- Acceso: `user.profile` o `user.getProfile()`

---

#### **1:N (Usuario → Posts)**

```javascript
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
```

- Un usuario puede tener **muchos** posts
- Si el usuario se elimina, todos sus posts se eliminan
- Acceso: `user.posts` o `user.getPosts()`

---

#### **N:M (Posts ↔ Categories)**

```javascript
Post.belongsToMany(Category, {
  through: "post_categories",
});
Category.belongsToMany(Post, {
  through: "post_categories",
});
```

- Un post puede tener **muchas** categorías
- Una categoría puede estar en **muchos** posts
- Tabla de enlace: `post_categories` (automática con Sequelize)
- Acceso: `post.categories` o `post.setCategories([...])`

---

### 3. **Transacciones ACID - Garantía de Consistencia**

#### **Situación:** Crear post + categorías

Si solo guardas el post y luego las categorías:

- ❌ Si categoría falla → tienes post sin categorías (inconsistencia)
- ❌ Datos corruptos en BD

#### **Solución: Transacción**

```javascript
const transaction = await sequelize.transaction();

try {
  // PASO 1: Crear post
  const post = await Post.create(
    { title, content, userId, published },
    { transaction }, // ← Dentro de la transacción
  );

  // PASO 2: Asignar categorías
  await post.setCategories(categoryIds, { transaction });

  // ✅ Si todo OK → COMMIT (guardar TODO)
  await transaction.commit();
} catch (error) {
  // ❌ Si falla → ROLLBACK (deshacer TODO)
  await transaction.rollback();
}
```

**Garantías ACID:**

- **Atomicity**: Todo se guarda o nada se guarda
- **Consistency**: No hay posts sin categorías incompletas
- **Isolation**: No interfiere con otras transacciones
- **Durability**: Una vez comiteada, es permanente

---

### 4. **Validaciones Implementadas**

**En modelos Sequelize:**

```javascript
// User model
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: { isEmail: true }  // ← Validación
}

// Post model
title: {
  type: DataTypes.STRING(150),
  allowNull: false,
  validate: {
    len: [3, 150]  // ← Mínimo 3, máximo 150
  }
}
```

**En middlewares:**

- `validation.middleware.js` valida **antes** de llegar a DB
- `express-validator` para requests HTTP

---

### 5. **Manejo de Errores**

**Errores Sequelize capturados:**

- Email duplicado → 409 Conflict
- Campo requerido vacío → 400 Bad Request
- ID no existe → 404 Not Found
- Validación falló → 400 Bad Request

**Middleware global (`error.middleware.js`):**

```javascript
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ status: "error", message: err.message });
  }
  // ... más tipos de error
});
```

---

### 6. **Paginación Reutilizable**

```javascript
// URLs como: /api/users?page=1&limit=10&sort=-createdAt
GET /api/users

// Respuesta estandarizada:
{
  "status": "success",
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

Implementada en `pagination.middleware.js` y reutilizada en todos los listados.

---

### 7. **Estructura de Carpetas - Separación de responsabilidades**

```
src/
├── models/          → Esquemas de datos (Sequelize)
├── controllers/     → Lógica de negocio (CRUD)
├── routes/          → Definición de endpoints
├── middlewares/     → Funciones genéricas (auth, validación, logs)
├── services/        → Lógica de archivos/externos
├── config/          → Configurración de BD
└── app.js           → Punto de entrada
```

**Ventaja:** Si cambia la BD, cambias solo `models/` + `config/database.js`. El resto del código no se afecta.

---

### Diagrama de Relaciones

```
┌─────────────┐
│   User      │ (1)
├─────────────┤
│ id (PK)     │
│ name        │
│ email (UQ)  │
│ password    │
│ role        │
│ active      │
└──────┬──────┘
       │
       ├─1:1────────┐
       │            │
       │       ┌──────────────┐
       │       │ UserProfile  │
       │       ├──────────────┤
       │       │ id (PK)      │
       │       │ userId (FK)  │
       │       │ bio          │
       │       │ phone        │
       │       └──────────────┘
       │
       └─1:N────────┐
                    │
              ┌──────────┐
              │  Post    │ (N)
              ├──────────┤
              │ id (PK)  │
              │ title    │
              │ content  │
              │ userId(FK)
              │ published│
              └────┬─────┘
                   │
              N:M ─┼─ N:M
                   │
            ┌────────────────┐
            │  post_categories│ (Tabla Join)
            ├────────────────┤
            │ postId (FK)    │
            │ categoryId (FK)│
            └────────────────┘
                   │
              ┌─────────────┐
              │  Category   │ (N)
              ├─────────────┤
              │ id (PK)     │
              │ name (UQ)   │
              └─────────────┘
```

---

### Operaciones CRUD con Transacciones

Todas las operaciones de creación/modificación usan **transacciones Sequelize** para garantizar coherencia:

#### ✅ **Crear Usuario + Perfil (Transacción ACID)**

```javascript
// En user.controller.js - función createUser()
const transaction = await sequelize.transaction();

try {
  // OPERACIÓN 1: Crear usuario
  const newUser = await User.create(
    { name, email, password, role: "user" },
    { transaction },
  );

  // OPERACIÓN 2: Crear perfil automáticamente
  await UserProfile.create(
    { userId: newUser.id, bio: null, phone: null },
    { transaction },
  );

  // ✅ COMMIT: Si todo ok, guardar ambas operaciones
  await transaction.commit();

  return res.status(201).json({ status: "success", data: newUser });
} catch (error) {
  // ❌ ROLLBACK: Si hay error, deshacer TODO
  await transaction.rollback();
  return res.status(500).json({ status: "error", message: error.message });
}
```

**Garantía ACID:**

- **A**tomicity: Ambas operaciones se graban o ninguna
- **C**onsistency: No quedan datos inconsistentes en BD
- **I**solation: No interfiere con otras transacciones
- **D**urability: Una vez comiteada, es permanente

---

#### ✅ **Crear Post + Asociar Categorías (Transacción)**

```javascript
// En post.controller.js - función createPost()
const transaction = await sequelize.transaction();

try {
  // OPERACIÓN 1: Crear post
  const post = await Post.create(
    { title, content, published, userId: req.user.id },
    { transaction },
  );

  // OPERACIÓN 2: Buscar o crear categorías
  if (categories && categories.length > 0) {
    const categoryInstances = await Promise.all(
      categories.map((name) =>
        Category.findOrCreate({
          where: { name: String(name).trim() },
          transaction,
        }).then(([cat]) => cat),
      ),
    );

    // OPERACIÓN 3: Asociar al post
    await post.setCategories(categoryInstances, { transaction });
  }

  await transaction.commit();

  // Recuperar y devolver
  const savedPost = await Post.findByPk(post.id, {
    include: [
      { model: User, as: "author", attributes: ["id", "name", "email"] },
      { model: Category, as: "categories", through: { attributes: [] } },
    ],
  });

  return res.status(201).json({ status: "success", data: savedPost });
} catch (error) {
  await transaction.rollback();
  return res.status(500).json({ status: "error", message: error.message });
}
```

---

### Validaciones Implementadas

Todas las entidades incluyen **validaciones en Sequelize**:

```javascript
// User.model.js
{
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100],
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  },
}
```

Además, se utiliza **express-validator** en rutas para validaciones a nivel HTTP:

```javascript
// user.routes.js
router.post(
  "/",
  validateUserCreation, // Validaciones JSON
  handleValidationErrors, // Manejo de errores
  userController.createUser,
);
```

---

### Consultas Filtradas y Búsqueda Dinámica

#### **Listar usuarios con filtros:**

```bash
GET /api/users?search=juan&role=admin&active=true&page=1&limit=10&sort=-createdAt
```

```javascript
// Genera WHERE dinámico con Sequelize
const where = {
  [Op.or]: [
    { name: { [Op.like]: "%juan%" } },
    { email: { [Op.like]: "%juan%" } },
  ],
  role: "admin",
  active: true,
};

users = User.findAll({
  where,
  limit: 10,
  offset: 0,
  order: [["createdAt", "DESC"]],
});
```

---

### Manejo de Errores y Validaciones

**Jerarquía de validaciones:**

1. **express-validator** (HTTP layer) - Valida tipos, formato
2. **Sequelize validations** (Model layer) - Valida lógica de datos
3. **Middleware error global** (Handler layer) - Formatea respuestas

**Respuesta de error estándar:**

```json
{
  "status": "error",
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido",
      "value": "no-es-email"
    }
  ]
}
```

---

## 📥 Importar en Postman

Para probar todos los endpoints, importa la colección:

1. Ir a Postman → `File` → `Import`
2. Seleccionar archivo `postman_collection.json`
3. ¡Todos los endpoints están listos para usar!

**Requisitos:**

- JWT token válido (obtenido en `/api/auth/login`)
- Base de datos PostgreSQL ejecutándose
- Servidor en `http://localhost:3000`

---

### Formato de registro:

```
[04-03-2026 15:30:45] GET / | IP: ::1 | UA: Mozilla/5.0...
[04-03-2026 15:30:48] GET /status | IP: ::1 | UA: Mozilla/5.0...
```

### Información registrada:

- **Fecha y hora** de la petición
- **Método HTTP** (GET, POST, etc.)
- **Ruta accedida**
- **IP del cliente**
- **User-Agent** del navegador

> Se eligió registrar los accesos a rutas porque permite monitorear el uso de la aplicación y detectar patrones de tráfico o posibles ataques.

---

## 📦 Dependencias

### Producción

| Paquete      | Versión | Propósito                               |
| ------------ | ------- | --------------------------------------- |
| express      | ^4.18.2 | Framework web para Node.js              |
| dotenv       | ^16.3.1 | Cargar variables de entorno desde .env  |
| sequelize    | ^6.x    | ORM para PostgreSQL (Módulo 7)          |
| pg           | ^8.x    | Driver PostgreSQL para Node.js          |
| pg-hstore    | ^2.x    | Soporte de serialización para Sequelize |
| jsonwebtoken | ^9.x    | Autenticación y autorización JWT        |
| bcryptjs     | ^2.x    | Hash seguro de contraseñas              |
| multer       | ^2.x    | Subida y validación de archivos         |

### Desarrollo

| Paquete | Versión | Propósito                                      |
| ------- | ------- | ---------------------------------------------- |
| nodemon | ^3.0.2  | Reinicio automático del servidor en desarrollo |

---

## 🛠️ Scripts NPM

| Script  | Comando              | Descripción                           |
| ------- | -------------------- | ------------------------------------- |
| `start` | `node src/app.js`    | Ejecutar en producción                |
| `dev`   | `nodemon src/app.js` | Ejecutar en desarrollo con hot-reload |

### Justificación de los scripts:

- **npm start**: Script estándar de Node.js para producción. Útil para deployment.
- **npm run dev**: Incluye `nodemon` para desarrollo, reiniciando el servidor automáticamente al detectar cambios en el código.

---

## 📐 Decisiones Técnicas

### ¿Por qué `app.js` en lugar de `index.js`?

Se eligió `app.js` como archivo principal porque:

1. **Convención de Express**: Es el nombre más común en aplicaciones Express
2. **Claridad semántica**: Indica que este archivo configura la "aplicación"
3. **Diferenciación**: `index.js` suele usarse como punto de entrada de módulos, mientras que `app.js` representa la aplicación web

### ¿Por qué esta estructura de carpetas?

La estructura sigue el patrón **MVC (Model-View-Controller)** adaptado:

- **routes/**: Define "qué" endpoints existen
- **controllers/**: Define "cómo" responder a cada petición
- **services/**: Lógica reutilizable y conexiones externas
- **middlewares/**: Procesamiento intermedio de peticiones

Esta separación permite:

- ✅ Código más mantenible y testeable
- ✅ Escalabilidad para futuras funcionalidades
- ✅ Reutilización de componentes

---

## 📊 Progreso del Proyecto

### Módulo 6: Primeros pasos con Node y Express ✅

- [x] Configuración de Node.js y npm
- [x] Instalación de dependencias (express, dotenv, nodemon)
- [x] Estructura de carpetas organizada
- [x] Servidor Express funcionando
- [x] Rutas públicas (/, /status, /api/info)
- [x] Archivos estáticos con express.static()
- [x] Persistencia en archivos planos (log.txt)
- [x] README.md documentado

### Módulo 7: Base de datos y ORM ✅

- [x] Conexión a PostgreSQL con Sequelize
- [x] Modelos de datos (User, Post, Category, UserProfile)
- [x] Operaciones CRUD completas (Users y Posts)
- [x] Relaciones entre entidades (1:1, 1:N, N:M)

### Módulo 8: API RESTful y Seguridad ✅

- [x] Autenticación con JWT
- [x] Rutas protegidas
- [x] Subida de archivos
- [x] Validaciones de tipo y tamaño de archivo

---

## 👤 Autor

**Sebastian**  
Bootcamp Full Stack JavaScript 2026

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
