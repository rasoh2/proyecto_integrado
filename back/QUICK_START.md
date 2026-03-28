## � Guía de Inicio Rápido - Módulos 6, 7 y 8

### 📦 Requisitos Previos

- **Node.js** v18+ instalado
- **PostgreSQL** corriendo en `localhost:5432`
- **npm** actualizado
- **Postman** (opcional, para pruebas)

---

## 🔧 Setup Inicial (5 minutos)

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Verifica que `.env` exista en la raíz con:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_express_webapp
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=una_clave_larga_segura_123456
JWT_EXPIRES_IN=24h
```

### Paso 3: Crear Base de Datos y Tablas

```bash
node init-db.js
```

**Esperado:** `✅ Base de datos lista para usar`

### Paso 4: Iniciar el Servidor

**Modo desarrollo (con recarga automática):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

Servidor corriendo en: **http://localhost:3000**

---

## 🔐 Autenticación JWT - Primeros Pasos

### Opción A: Registro (crea usuario + token automático)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Opción B: Login (obtener token con credenciales)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**

```json
{
  "status": "success",
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## 📍 Usar Token en Peticiones Protegidas

### Con curl:

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

### En Postman:

1. Click en pestaña **Authorization**
2. Cambia **Type** a **Bearer Token**
3. En el campo **Token**, pega tu JWT
4. Click **Send**

---

## 📊 Endpoints Principales

### 👤 **Usuarios**

- `GET /api/users?page=1&limit=10` - Listar (con paginación)
- `GET /api/users/:id` - Obtener por ID
- `POST /api/users` - Crear
- `PUT /api/users/:id` - Actualizar
- `DELETE /api/users/:id` - Eliminar
- `POST /api/users/:id/avatar` - Subir foto (multipart)

### 👤 **Perfil de Usuario**

- `GET /api/profile/me` - Mi perfil (autenticado)
- `PUT /api/profile/me` - Actualizar mi perfil
- `GET /api/profile/:userId` - Perfil público de usuario
- `PUT /api/profile/:userId` - Actualizar perfil de otro (permisos)

### 📝 **Posts**

- `GET /api/posts?page=1&published=true&category=deportes`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

### 🏷️ **Categorías**

- `GET /api/categories?page=1&search=tech`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

---

## 📝 Validaciones

### Usuario

- Nombre: texto requerido
- Email: debe ser válido y único
- Contraseña: mín 6 caracteres, hash con bcryptjs
- Rol: "admin" o "user" (default: "user")

### UserProfile

- Bio: máximo 255 caracteres
- Phone: máximo 30 caracteres

### Post

- Título: requerido, máx 200 caracteres
- Contenido: requerido
- Categorías: array de IDs existentes (opcional)
- Published: booleano (default: false)

### Categoría

- Nombre: requerido, único, 2-80 caracteres

---

## 🔒 Rutas Protegidas vs Públicas

### Públicas (sin token)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id`
- `GET /api/profile/:userId`

### Privadas (requieren JWT)

- `GET /api/users` - Solo usuarios autenticados
- `GET /api/auth/me`
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/users/:id/avatar`
- `GET /api/posts`
- `POST /api/posts` - Crear post
- `PUT /api/profile/me`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

---

## 🧪 Ejemplo Completo con Postman

### 1. Registrarse

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Leo Messi",
  "email": "leo@example.com",
  "password": "PSG2023!",
  "role": "admin"
}
```

**Respuesta:** Copiar el `token`

### 2. Crear Categoría

```
POST http://localhost:3000/api/categories
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Deportes"
}
```

### 3. Crear Post

```
POST http://localhost:3000/api/posts
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Futbol Moderno",
  "content": "Un análisis de las tendencias actuales...",
  "published": true,
  "categories": [1]
}
```

### 4. Listar Posts Con Paginación

```
GET http://localhost:3000/api/posts?page=1&limit=5&published=true&sort=-createdAt
Authorization: Bearer <TOKEN>
```

### 5. Subir Avatar

```
POST http://localhost:3000/api/users/1/avatar
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

[Seleccionar archivo: foto.jpg]
```

---

## 📊 Estructura de Respuestas

Todas las respuestas siguen este formato:

```json
{
  "status": "success | error",
  "message": "Descripción",
  "data": { "objeto": "valor" } | null,
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### Códigos HTTP

| Código | Significado                     |
| ------ | ------------------------------- |
| 200    | OK                              |
| 201    | Creado                          |
| 400    | Validación fallida              |
| 401    | No autenticado                  |
| 403    | No autorizado                   |
| 404    | No encontrado                   |
| 409    | Conflicto (ej: email duplicado) |
| 500    | Error servidor                  |

---

## 🐛 Debugging

### Ver logs de accesos

```bash
cat logs/log.txt
```

### Ver errores del servidor

Se imprimen en consola durante `npm run dev`

### Validar BD

```sql
-- En PostgreSQL
\d  -- Listar tablas
SELECT * FROM users;
SELECT * FROM posts;
```

---

**Última actualización:** 19 de marzo de 2025
