# 🧪 Guía de Testing - Integración Frontend-Backend

## Testear Endpoints con cURL o Postman

### 1️⃣ Registro de Usuario (POST /api/auth/register)

**cURL**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta Esperada** (201):

```json
{
  "status": "success",
  "message": "Usuario registrado correctamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user",
      "createdAt": "2026-03-28T10:30:00Z"
    }
  }
}
```

---

### 2️⃣ Iniciar Sesión (POST /api/auth/login)

**cURL**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta Esperada** (200):

```json
{
  "status": "success",
  "message": "Acceso concedido",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

**Guardar el token para usar en próximas peticiones**:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3️⃣ Obtener Perfil del Usuario (GET /api/profile)

**Requiere autenticación ✔️**

**cURL**:

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Esperada** (200):

```json
{
  "status": "success",
  "message": "Perfil obtenido",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "profile": {
      "id": 1,
      "bio": "Desarrollador web",
      "balance": 50000,
      "avatar": "uploads/user_1_avatar.jpg",
      "userId": 1
    }
  }
}
```

---

### 4️⃣ Obtener Transacciones (GET /api/posts)

**Requiere autenticación ✔️**

**cURL**:

```bash
curl -X GET http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Esperada** (200):

```json
{
  "status": "success",
  "message": "Posts obtenidos",
  "data": [
    {
      "id": 1,
      "title": "Depósito $50,000",
      "content": "Depósito de bienvenida",
      "category": "deposito",
      "amount": 50000,
      "userId": 1,
      "createdAt": "2026-03-28T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Transferencia a María",
      "content": "Transferencia exitosa",
      "category": "transferencia",
      "amount": 5000,
      "userId": 1,
      "createdAt": "2026-03-28T11:15:00Z"
    }
  ]
}
```

---

### 5️⃣ Crear una Transacción (POST /api/posts)

**Requiere autenticación ✔️**

**cURL**:

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Nuevo Depósito",
    "content": "Depósito de $25,000",
    "category": "deposito",
    "amount": 25000
  }'
```

**Respuesta Esperada** (201):

```json
{
  "status": "success",
  "message": "Post creado",
  "data": {
    "id": 3,
    "title": "Nuevo Depósito",
    "content": "Depósito de $25,000",
    "category": "deposito",
    "amount": 25000,
    "userId": 1,
    "createdAt": "2026-03-28T12:00:00Z"
  }
}
```

---

### 6️⃣ Subida de Archivo (POST /api/profile/avatar)

**Requiere autenticación ✔️**

**cURL**:

```bash
curl -X POST http://localhost:3000/api/profile/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

**Respuesta Esperada** (200):

```json
{
  "status": "success",
  "message": "Avatar subido",
  "data": {
    "avatar": "uploads/user_1_avatar_1711603200000.jpg",
    "url": "http://localhost:3000/uploads/user_1_avatar_1711603200000.jpg"
  }
}
```

---

## 🔐 Headers Importantes

### Authorization con JWT

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Content-Type para JSON

```
Content-Type: application/json
```

### Content-Type para Formularios (multipart)

```
Content-Type: multipart/form-data
```

---

## 📊 Postman Collection

Si usas **Postman**, puedes importar la colección `Alke_Wallet_API.postman_collection.json`:

1. Abre Postman
2. **File → Import** → Selecciona el archivo
3. Configura la variable `{{token}}` con el JWT obtenido del login
4. Prueba cada endpoint

---

## ✅ Testing en el Navegador (Frontend)

### Abrir DevTools

Presiona **F12** en el navegador

### Ver Console

- Debería mostrar logs como `✅ Inicio de sesión exitoso`
- Si hay errores, verás `❌ Error en login`

### Ver Network

- Cuadrante Network → Recarga la página
- Verás peticiones a `/api/auth/login`, `/api/profile`, etc.
- Busca el header `Authorization: Bearer [token]`

### Verificar localStorage

```javascript
// En la console, escribe:
localStorage.getItem("token"); // Ver JWT
localStorage.getItem("nombreUsuario"); // Ver nombre
JSON.parse(localStorage.getItem("movimientos")); // Ver movimientos
```

---

## 🐛 Errores Comunes

### ❌ 401 Unauthorized

**Causa**: Token no enviado o expirado

**Solución**:

```bash
# Obtener nuevo token
curl -X POST http://localhost:3000/api/auth/login ...
```

### ❌ 404 Not Found

**Causa**: Ruta incorrecta

**Solución**: Verifica las rutas en `src/routes/*.js`

### ❌ 500 Internal Server Error

**Causa**: Error en el servidor

**Solución**: Revisa los logs en `$logs/log.txt` o la consola del backend

### ❌ CORS Error

**Causa**: Frontend en diferente origen que el backend

**Solución**: Verifica `CORS` en `src/app.js`

---

## 📈 Casos de Prueba

### Caso 1: Flujo Completo

```bash
# 1. Registrar usuario
POST /api/auth/register
# Guardar token

# 2. Obtener perfil
GET /api/profile (con token)

# 3. Crear transacción
POST /api/posts (con token)

# 4. Ver transacciones
GET /api/posts (con token)
```

### Caso 2: Autenticación Fallida

```bash
# Login con credenciales incorrectas
POST /api/auth/login
{
  "email": "noexiste@example.com",
  "password": "wrongpassword"
}
# Respuesta esperada: 401 (Unauthorized)
```

### Caso 3: Acceso sin Autenticación

```bash
# Intentar acceder a ruta protegida sin token
GET /api/profile
# Respuesta esperada: 401 (Unauthorized)
```

---

## 🎯 Checklist de Validación

- [ ] Backend corre en `http://localhost:3000`
- [ ] Frontend accesible en `http://localhost:3000`
- [ ] Login redirige al menú correctamente
- [ ] Token guardado en localStorage
- [ ] Perfil carga datos desde API
- [ ] Transacciones muestran en el menú
- [ ] Logout limpia token
- [ ] Errores se muestran al usuario
- [ ] Console no muestra errores críticos
- [ ] Network muestra peticiones con header Authorization

---

**Última actualización**: 28 de marzo de 2026
