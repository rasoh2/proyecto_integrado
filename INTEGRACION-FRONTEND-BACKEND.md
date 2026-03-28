# 🔗 Integración Frontend-Backend - Alke Wallet

**Módulo VIII - Tema 3: Implementación de API Backend Node Express**

## 📋 Resumen de Cambios

Esta integración conecta el frontend (alke-wallet) con la API REST del backend para reemplazar la validación local por autenticación real basada en JWT y acceso a base de datos.

### ✅ Cambios Realizados

#### 1. **`assets/js/config.js`** (NUEVO)

- Archivo centralizado con configuración de la API
- Define `API_BASE_URL` y todos los `API_ENDPOINTS`
- Proporciona funciones auxiliares: `apiGET()`, `apiPOST()`, `apiPUT()`, `apiDELETE()`
- Maneja almacenamiento de JWT en `localStorage`
- Verifica autenticación con `isAuthenticated()`

#### 2. **`assets/js/login.js`** (MODIFICADO)

- ❌ Elimina: Validación local contra JSON (`usuarios.json`)
- ✅ Añade: Llamada a `POST /api/auth/login`
- ✅ Guarda JWT en `localStorage.token`
- ✅ Manejo de errores mejorado (conexión, credenciales, etc.)

#### 3. **`assets/js/menu.js`** (MODIFICADO)

- ❌ Elimina: Lectura de datos desde `localStorage` únicamente
- ✅ Añade: Llamadas a API para obtener:
  - Perfil de usuario: `GET /api/profile`
  - Transacciones: `GET /api/posts`
- ✅ Mantiene fallback a `localStorage` si la API no responde
- ✅ Actualiza saldo automáticamente cada 10 segundos

#### 4. **HTML Files** (MODIFICADOS)

- `index.html`
- `menu.html`
- `deposit.html`
- `sendMoney.html`
- `transactions.html`

**Cambio**: Agregado `<script src="assets/js/config.js"></script>` antes de los scripts locales.

#### 5. **`back/src/app.js`** (MODIFICADO)

- Agregada línea para servir frontend desde `../../alke-wallet`
- Ahora sirve tanto la API como el frontend en el mismo puerto (3000)

---

## 🚀 Cómo Probar la Integración

### Paso 1: Asegurar que el Backend está corriendo

```bash
cd back
npm install  # Si no lo has hecho
npm run dev  # Inicia con nodemon
```

**Verificar**: La consola debe mostrar:

```
✅ BASE DE DATOS CONECTADA
🚀 Servidor escuchando en http://localhost:3000
```

### Paso 2: Acceder al Frontend

Abre tu navegador en: `http://localhost:3000`

Verás la página de login de Alke Wallet

### Paso 3: Probar el Login (con API)

**Opción A: Crear un nuevo usuario (Registro)**

1. Necesitarás tener un endpoint de registro
2. O crear un usuario directamente en la base de datos

**Opción B: Usar credenciales de prueba**

Si tu backend tiene usuarios pre-cargados, prueba:

- Email: `test@example.com`
- Contraseña: `password123`

_Nota: Verifica en tu base de datos qué usuarios existen_

### Paso 4: Verificar la Consola del Navegador

Abre DevTools (F12 → Console) y busca:

✅ **Login exitoso**:

```
✅ Respuesta del servidor: {status: "success", data: {token: "...", user: {...}}}
✅ Inicio de sesión exitoso
🔐 Token guardado en localStorage
```

❌ **Error de conexión**:

```
❌ Error en login: TypeError: fetch is not working
❌ No se puede conectar al servidor
```

### Paso 5: Verificar Menú Principal

Después del login, deberías ver:

- ✅ Nombre del usuario (desde API)
- ✅ Saldo actual (desde API)
- ✅ Estadísticas (depósitos, transferencias, etc.)

En la consola deberías ver:

```
📝 Datos de usuario cargados desde API: Juan Pérez
💰 Saldo actual mostrado: $50,000
📊 Estadísticas cargadas:
   💰 Depósitos: 5
   💸 Transferencias: 3
   👥 Contactos: 8
   📋 Total Movimientos: 8
```

---

## 🔐 Cómo Funciona JWT

### Flujo de Autenticación

```
Usuario ingresa email/password
          ↓
POST /api/auth/login
          ↓
Backend valida en DB
          ↓
Backend genera JWT
          ↓
Frontend recibe token
          ↓
Frontend guarda en localStorage.token
          ↓
Próximas peticiones:
Header: Authorization: Bearer [token]
```

### Almacenamiento del Token

El token se guarda en:

```javascript
localStorage.getItem("token"); // JWT
localStorage.getItem("usuarioLogueado"); // Email (para compatibilidad)
localStorage.getItem("nombreUsuario"); // Nombre
localStorage.getItem("idUsuario"); // ID del usuario
```

### Verificación de Autenticación

Cada página verifica:

```javascript
if (!isAuthenticated()) {
  // Redirigir a login
  window.location.href = "index.html";
}
```

---

## 📡 Endpoints Utilizados

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (opcional)

### Perfil

- `GET /api/profile` - Obtener perfil y saldo del usuario autenticado
- `PUT /api/profile` - Actualizar perfil (opcional)

### Transacciones

- `GET /api/posts` - Obtener transacciones del usuario
- `POST /api/posts` - Crear transacción (depósito, transferencia, etc.)
- `GET /api/posts/:id` - Obtener detalle de transacción
- `PUT /api/posts/:id` - Actualizar transacción
- `DELETE /api/posts/:id` - Eliminar transacción

---

## 🛠️ Modificar URL de API

Si quieres cambiar la URL del backend, edita `assets/js/config.js`:

```javascript
// Línea 14
const API_BASE_URL = "http://localhost:3000"; // Cambiar aquí

// Ejemplos:
// const API_BASE_URL = "http://192.168.1.100:3000";  // Otra máquina
// const API_BASE_URL = "https://mi-api.com";         // Producción
```

---

## ⚙️ Configuración CORS

El backend ya tiene CORS configurado para aceptar peticiones desde cualquier origen:

```javascript
cors({
  origin: "*", // Permitir todas las origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
```

En **producción**, cambia `origin: "*"` a:

```javascript
origin: "https://mi-dominio.com";
```

---

## 🐛 Solución de Problemas

### Problema: "No se puede conectar al servidor"

**Causa**: El backend no está corriendo en `http://localhost:3000`

**Solución**:

```bash
# Terminal 1 - Backend
cd back && npm run dev

# Verificar que dice:
# ✅ BASE DE DATOS CONECTADA
# 🚀 Servidor escuchando en http://localhost:3000
```

### Problema: "Credenciales incorrectas"

**Causa**: El usuario no existe en la base de datos

**Solución**: Crear usuario en la BD o usar credenciales correctas

```bash
# En el backend, verificar usuarios:
node check-db.js  # Si existe este script
```

### Problema: Token expirado

**Síntoma**: Después de 24h se cierra sesión automáticamente

**Causa**: JWT configurado con expiración en `.env`

**Solución**: Cambiar en `back/.env`:

```
JWT_EXPIRES_IN=48h   # Cambiar duración
```

### Problema: Navegador muestra JSON en lugar de la página

**Causa**: Petición a `/api/...` en lugar de `/`

**Solución**: Acceder a `http://localhost:3000` no a `http://localhost:3000/api/auth/login`

---

## 📝 Próximos Pasos (Opcional)

Para mejorar la integración, puedes:

1. **Validaciones HTML5**:
   - Agregar `required`, `type="email"`, etc. en formularios

2. **Manejo de errores mejorado**:
   - Distinguir entre errores de red, autenticación, servidor

3. **Refresh Token**:
   - Implementar token que se renueba automáticamente

4. **Transacciones reales**:
   - Conectar formularios de depósito/transferencia a API

5. **Carga de archivos**:
   - Subir avatares de usuario a `/api/profile/avatar`

---

## 📚 Documentación de Referencia

- JWT: https://jwt.io
- Fetch API: https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- LocalStorage: https://developer.mozilla.org/es/docs/Web/API/localStorage
- CORS: https://developer.mozilla.org/es/docs/Web/HTTP/CORS

---

**Última actualización**: 28 de marzo de 2026  
**Autor**: Proyecto Evaluación Módulos 6, 7 y 8
