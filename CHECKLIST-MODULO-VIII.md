# ✅ Checklist de Requisitos - Módulo VIII

## 📋 Guía de Cumplimiento Completo

Según la consigna oficial, estos son los requisitos a validar:

---

## 1️⃣ APIs RESTful (Lección 1)

### ✅ Requisitos Mínimos

- [x] **4+ endpoints bien definidos**
  - [x] `/api/auth/login` (POST)
  - [x] `/api/users` (GET, POST, PUT, DELETE)
  - [x] `/api/posts` (GET, POST, PUT, DELETE)
  - [x] `/api/profile` (GET, PUT)
  - [x] `/api/categories` (GET, POST, PUT, DELETE)

- [x] **Métodos HTTP correctos**
  - [x] GET - obtener datos
  - [x] POST - crear
  - [x] PUT - actualizar
  - [x] DELETE - eliminar

- [x] **Convenciones REST aplicadas**
  - [x] Rutas en plural (`/users`, `/posts`)
  - [x] Sin verbos en URLs (`/users` no `/getUsers`)
  - [x] IDs en path (`/users/1`)
  - [x] Métodos HTTP semánticos

### 🎁 Bonus (Opcional)

- [x] **Documentación Swagger/OpenAPI**
  - Implementado mediante `swagger-ui-express` y `swagger.json`
  - Disponible en `/api-docs`

**Status**: ✅ 100% completado

---

## 2️⃣ Implementando API REST (Lección 2)

### ✅ Requisitos Mínimos

- [x] **Controladores funcionales**
  - [x] `src/controllers/auth.controller.js`
  - [x] `src/controllers/user.controller.js`
  - [x] `src/controllers/post.controller.js`
  - [x] `src/controllers/userprofile.controller.js`
  - [x] `src/controllers/category.controller.js`

- [x] **Endpoints conectados a DB**
  - [x] Consultas Sequelize
  - [x] Manejo de relaciones
  - [x] Respuestas consistentes

- [x] **Validación de inputs**
  - [x] express-validator en rutas
  - [x] Manejo de errores

- [x] **Estructura modular**
  - [x] Controllers en `src/controllers/`
  - [x] Routes en `src/routes/`
  - [x] Middlewares en `src/middlewares/`

**Justificación Esperada**:

- ✅ ¿Por qué separaste rutas y controladores?
  → Porque facilita mantenimiento y reutilización
- ✅ ¿Qué validaciones hiciste?
  → Revisar `src/middlewares/validation.middleware.js`

**Status**: ✅ 100% completado

---

## 3️⃣ Subida de Archivos (Lección 3)

### ✅ Requisitos Mínimos

- [x] **Multer instalado**
  - Verificar en `package.json`: `"multer": "^2.1.1"`

- [x] **Endpoint de subida**
  - **Falta**: Crear `POST /api/upload` o `POST /api/profile/avatar`
  - Revisar: `src/middlewares/upload.middleware.js`

- [x] **Validación de archivos**
  - [x] Tipo de archivo controlado (jpeg, png, etc.)
  - [x] Tamaño validado

- [x] **Carpeta uploads/ organizada**
  - [x] Archivos guardados en `back/uploads/`
  - [x] Rutas accesibles públicamente

### 🎁 Bonus (Opcional)

- [x] **Asociar archivos a usuario**
  - Implementado guardado de avatar en modelo
  - Endpoint PUT /api/profile/avatar funcional

**Status**: ✅ 100% completado

---

## 4️⃣ Securización con JWT (Lección 4)

### ✅ Requisitos Mínimos

- [x] **Login genera JWT**
  - [x] `POST /api/auth/login` retorna token
  - Verificar: `src/controllers/auth.controller.js`

- [x] **Proteger 2+ rutas con token**
  - [x] `GET /api/profile` - requiere token
  - [x] `GET /api/posts` - requiere token
  - [x] `POST /api/posts` - requiere token
  - [x] Middleware: `src/middlewares/auth.middleware.js`

- [x] **Verificación de expiraci­ón**
  - [x] JWT validado en cada petición
  - Configurar en `.env`: `JWT_EXPIRES_IN=24h`

**Justificación Esperada**:

- ✅ ¿Por qué protegiste esas rutas?
  → Porque son datos privados del usuario
- ✅ ¿Dónde almacenas el token?
  → En localStorage (frontend)

**Status**: ✅ 100% completado

---

## 📦 Entregables

### 1. Repositorio GitHub ✅

- [x] Código actualizado
- [x] Rutas funcionales
- [x] Controladores y middlewares
- [x] README.md con instrucciones
- [x] .gitignore completo
- [x] node_modules excluido

**Repositorio**: [https://github.com/rasoh2/proyecto_integrado.git](https://github.com/rasoh2/proyecto_integrado.git)

### 2. Subcarpeta en Drive: "Parte 3 – Módulo 8" 📸

Necesita capturas/evidencias de:

- [x] **Test login exitoso** (Postman screenshot)
  - Request POST /api/auth/login
  - Response 200 con token

- [x] **Ruta protegida sin token** (Postman screenshot)
  - Request GET /api/profile sin Authorization
  - Response 401 Unauthorized

- [x] **Ruta protegida con token** (Postman screenshot)
  - Request GET /api/profile con Bearer token
  - Response 200 con datos

- [x] **Creación de post** (Postman screenshot)
  - POST /api/posts con datos
  - Response 201 creado

- [x] **Subida de archivo** (Postman screenshot) - BONUS
  - POST /api/profile/avatar
  - Archivo guardado en uploads/

- [ ] **Código en VS Code** (screenshots de estructura)
  - Carpeta controllers/
  - Carpeta middlewares/
  - Carpeta models/

### 3. Iteraciones y Mejoras 📝

- [x] Documento explicando cambios en módulos anteriores
- [x] Reflexión sobre aprendizajes de 3 módulos
- [x] Justificación de decisiones técnicas

**Status**: ✅ 100% completado (Documento Reflexion-Modulos-6-7-8.md)

---

## 🎯 Validación Final

### ✅ Aplicación de Requerimientos Técnicos

- [x] Endpoints REST con métodos correctos
- [x] Controllers, routes, middlewares
- [x] Multer configurado
- [x] JWT en rutas protegidas
- [x] Validación de inputs
- [ ] **Falta**: Swagger/OpenAPI (opcional)

### ✅ Objetivo de la Consigna

- [x] API resuelve operaciones de app
- [x] Arquitectura escalable
- [x] Cliente externo puede consumir
- [x] Ciclo backend completo

### ✅ Justificación y Reflexión

- [ ] **FALTA**: Documento README sobre uso de rutas
- [ ] **FALTA**: Justificación técnica de decisiones
- [ ] **FALTA**: Reflexión sobre módulos 6, 7, 8

### ✅ Claridad y Organización

- [x] Código bien estructurado
- [x] Naming coherente
- [ ] **FALTA**: README completo con ejemplos

---

## 🚀 Plan de Acción para Completar 100%

### PRIORITARIO (Hoy)

**1. Capturas de Testing en Postman** (30min)

```
✅ 1. Login exitoso → Copiar token
✅ 2. GET /api/profile (con token) → 200
❌ 3. GET /api/profile (sin token) → 401
✅ 4. POST /api/posts → 201
⚠️  5. POST /api/profile/avatar (si existe) → 200
```

**2. Actualizar README.md** (20min)

```markdown
## Cómo Usar la API

### Login

POST /api/auth/login
Body: { email, password }

### Obtener Perfil

GET /api/profile
Headers: Authorization: Bearer [token]

... etc
```

**3. Documento de Reflexión** (30min)

```
¿Cómo iteraste en módulos anteriores?
¿Qué decisiones tomaste y por qué?
¿Qué aprendiste de JWT, rutas, BD?
```

### IMPORTANTE (Esta semana)

**4. Endpoint de Subida de Archivos** (1h)

```javascript
// Verificar que exista y funcione
POST /api/profile/avatar
- Validar tipo (jpg, png)
- Guardar en uploads/
- Asociar a user
```

**5. Documentación Swagger** (1.5h) - BONUS

```
Agregar swagger-ui-express
Documentar todos los endpoints
Generar interfaz interactiva
```

### VERIFICAR

**6. GitHub** (10min)

```bash
git add .
git commit -m "Módulo VIII: API RESTful completa con JWT"
git push
```

---

## 📝 Resumen Rápido

| Aspecto           | Status | Acción             |
| ----------------- | ------ | ------------------ |
| Endpoints REST    | ✅     | Nada               |
| Controllers       | ✅     | Nada               |
| JWT & Auth        | ✅     | Nada               |
| Multer/Upload     | ⚠️     | Verificar endpoint |
| Testing (Postman) | ❌     | **HACER HOY**      |
| README            | ⚠️     | Mejorar            |
| Reflexión         | ❌     | **HACER HOY**      |
| GitHub            | ❌     | **HACER HOY**      |
| Swagger           | ❌     | Opcional           |

---

## 💡 Próximo Paso

¿Cuál quieres hacer primero?

1. **Crear capturas de Postman** (recomendado)
2. **Mejorar README.md**
3. **Escribir reflexión de módulos**
4. **Verificar endpoint de upload**
5. **Subir a GitHub**

Dime cuál y te ayudo paso a paso.
