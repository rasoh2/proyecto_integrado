# 📝 Resumen de Cambios - Módulo VIII Integración

**Autor**: Sistema de Integración  
**Fecha**: 28 de Marzo de 2026  
**Objetivo**: Integrar frontend (alke-wallet) con API backend (Node/Express)

---

## 📂 Archivos Nuevos

### ✨ `alke-wallet/assets/js/config.js`

**Descripción**: Archivo de configuración centralizado para la API

**Contenido**:

- `API_BASE_URL`: URL base del servidor (localhost:3000)
- `API_ENDPOINTS`: Objeto con todos los endpoints de la API
- Funciones HTTP: `apiGET()`, `apiPOST()`, `apiPUT()`, `apiDELETE()`
- Manejo de JWT: `saveToken()`, `getToken()`, `clearToken()`, `isAuthenticated()`

**Ubicación**: `alke-wallet/assets/js/config.js`

---

## 🔄 Archivos Modificados

### 1️⃣ `alke-wallet/assets/js/login.js`

**Cambios de Arquitectura**:

| Antes                             | Después                         |
| --------------------------------- | ------------------------------- |
| Carga `usuarios.json` localmente  | Llama `POST /api/auth/login`    |
| Valida credenciales en JavaScript | Backend valida en Base de Datos |
| Guarda datos en localStorage      | Guarda JWT en localStorage      |
| Sin token                         | Con JWT para peticiones futuras |

**Funciones Modificadas**:

- `$(document).ready()` - Ahora es `async`
- `$("#loginForm").on("submit")` - Llama a `apiPOST()` con email/password
- Manejo de respuesta con `status`, `message`, `data`
- Manejo de errores mejorado (red, autenticación, servidor)

**Nuevas Variables**:

- `token` en localStorage
- Indicador de carga en botón
- Validación de error más descriptiva

---

### 2️⃣ `alke-wallet/assets/js/menu.js`

**Cambios Principales**:

| Aspecto           | Antes                        | Después                              |
| ----------------- | ---------------------------- | ------------------------------------ |
| Verificación Auth | localStorage.usuarioLogueado | `isAuthenticated()`                  |
| Datos del Usuario | localStorage local           | `GET /api/profile`                   |
| Saldo             | localStorage                 | `GET /api/profile` (field: balance)  |
| Transacciones     | localStorage movimientos     | `GET /api/posts`                     |
| Cierre de Sesión  | Limpia localStorage          | Limpia localStorage + `clearToken()` |

**Funciones Modificadas**:

- `verificarAutenticacion()` - Usa `isAuthenticated()`
- `cargarDatosUsuario()` - Llama a `/api/profile`
- `mostrarSaldoActual()` - Llama a `/api/profile`
- `mostrarEstadisticas()` - Llama a `/api/posts`
- `cerrarSesion()` - Llama a `clearToken()`

**Nuevas Funcionalidades**:

- Actualización automática de saldo cada 10 segundos
- Fallback a localStorage si API falla
- Async/await para llamadas HTTP

---

### 3️⃣ `alke-wallet/index.html`

**Cambio Mínimo**:

```html
<!-- ANTES -->
<script src="assets/js/login.js"></script>

<!-- DESPUÉS -->
<script src="assets/js/config.js"></script>
<script src="assets/js/login.js"></script>
```

**Razón**: config.js debe cargarse primero para que login.js tenga acceso a las funciones API

---

### 4️⃣ `alke-wallet/menu.html`

**Cambio Idéntico a index.html**:

```html
<!-- Agregado antes de menu.js -->
<script src="assets/js/config.js"></script>
```

---

### 5️⃣ `alke-wallet/deposit.html`

**Cambio Idéntico**:

```html
<!-- Agregado antes de deposit.js -->
<script src="assets/js/config.js"></script>
```

---

### 6️⃣ `alke-wallet/sendMoney.html`

**Cambio Idéntico**:

```html
<!-- Agregado antes de sendMoney.js -->
<script src="assets/js/config.js"></script>
```

---

### 7️⃣ `alke-wallet/transactions.html`

**Cambio Idéntico**:

```html
<!-- Agregado antes de transactions.js -->
<script src="assets/js/config.js"></script>
```

---

### 8️⃣ `back/src/app.js`

**Agregado en Sección 4.1**:

```javascript
// ============================================
// 4.1 SERVIR FRONTEND (MÓDULO 8 - INTEGRACIÓN)
// ============================================
// Servir los archivos del frontend (alke-wallet) desde la raíz
app.use(express.static(path.join(__dirname, "../../alke-wallet")));
```

**Efecto**:

- Ahora ambos (frontend y backend) se sirven desde el mismo servidor
- Acceso a `http://localhost:3000` muestra index.html
- API routes en `/api/*` quedan intactas

---

## 🎯 Cambios de Comportamiento

### Login Flow

**ANTES**:

```
usuario → form → validación local → localStorage → menu
```

**DESPUÉS**:

```
usuario → form → POST /api/auth/login → JWT → localStorage → menu
```

### Data Flow en Menu

**ANTES**:

```
localStorage → mostrar en UI
↓
Datos hardcoded/locales
```

**DESPUÉS**:

```
localStorage (fallback) ← GET /api/profile ← Base de Datos
↓
Mostrar en UI
↓
Auto-actualiza cada 10s
```

---

## 🔐 Seguridad

### Autenticación

- ✅ Contraseñas hasheadas en BD (bcryptjs)
- ✅ JWT con expiración configurable
- ✅ Token en localStorage (vulnerable en XSS, considerar httpOnly en futuro)

### Validación

- ✅ Email y contraseña requeridos
- ✅ Headers CORS configurados
- ✅ Errores sin exponer información sensible

---

## 📊 Variables de Entorno (Backend)

Verificar en `back/.env`:

```
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=xxxx
DB_NAME=alke_wallet
JWT_SECRET=tu-clave-secreta-segura
JWT_EXPIRES_IN=24h
```

---

## ✅ Testing Realizado

- [x] Login con credenciales correctas
- [x] Login con credenciales incorrectas
- [x] Cargar perfil del usuario
- [x] Redirección sin autenticación
- [x] Token almacenado en localStorage
- [x] Cierre de sesión limpia token
- [x] Error handling (conexión, 401, 500)
- [x] CORS permitido
- [x] Logs en consola claros

---

## ⚠️ Limitaciones Actuales

1. **Depósitos/Transferencias**: Aún usan localStorage (próxima fase)
2. **Validaciones Form**: Mínimas en frontend (considerar agregar)
3. **Email Verification**: No implementado
4. **Refresh Token**: JWT simple sin renovación automática
5. **2FA**: No implementado

---

## 🚀 Próximas Mejoras

### Corto Plazo

- [ ] Conectar formularios de depósito/transferencia a API
- [ ] Validación HTML5 en formularios
- [ ] Error messages más descriptivos

### Mediano Plazo

- [ ] Refresh token automático
- [ ] Avatar upload a `/api/profile/avatar`
- [ ] Paginación en transacciones

### Largo Plazo

- [ ] 2FA (Two-Factor Authentication)
- [ ] Email verification
- [ ] Rate limiting en endpoints
- [ ] API documentation (Swagger)

---

## 📋 Checklist de Integración

- [x] Crear `config.js` con endpoints
- [x] Modificar `login.js` para usar API
- [x] Modificar `menu.js` para usar API
- [x] Incluir `config.js` en todos los HTML
- [x] Configurar backend para servir frontend
- [x] Crear documentación de integración
- [x] Crear guía de testing
- [x] Validar CORS
- [x] Validar JWT flow
- [x] Crear este resumen de cambios

---

## 🎓 Aprendizajes Clave

1. **Separación de responsabilidades**: Frontend obtiene datos, Backend valida y persiste
2. **JWT como credencial**: Más seguro que enviar contraseña cada vez
3. **CORS necesario**: Permite comunicación entre diferentes portos/dominios
4. **Fallback importante**: Si API falla, app usa localStorage local
5. **DevTools + Console**: Herramienta esencial para debugging

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa `INTEGRACION-FRONTEND-BACKEND.md` (guía completa)
2. Consulta `TESTING-API.md` (cómo testear)
3. Verifica logs en `back/logs/log.txt`
4. Abre DevTools (F12) → Console → busca errores

---

**Versión**: 1.0  
**Estado**: ✅ Completado  
**Próxima Etapa**: Conectar formularios de transacciones a API
