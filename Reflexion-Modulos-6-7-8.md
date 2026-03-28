# 📚 Reflexión - Módulos 6, 7 y 8

**Estudiante**: Sebastian  
**Fecha**: 28 de Marzo 2026  
**Proyecto**: Alke Wallet - API RESTful Node.js + Express

---

## 🎯 Mi Viaje a través de los 3 Módulos

### Módulo 6: Los Cimientos - Express y Rutas

**¿Qué aprendí?**

- Cómo estructurar un servidor web con **Express.js**
- La importancia de las **rutas** y los **middlewares**
- Servir contenido estático y dinámico
- Persistencia básica en archivos (logs)

**Decisión Clave**: Separé rutas en carpetas diferentes (`/routes`) porque:

- Facilita el mantenimiento
- Evita que un archivo tenga 1000 líneas
- Scalable cuando crece el proyecto

**Lo que funcionaba**:

- ✅ Servidor corriendo
- ✅ Rutas públicas y privadas básicas
- ✅ Logging a archivos

**Lo que mejoraría ahora**:

- Necesitaba autenticación real (JWT)
- Los datos en archivos JSON no escalan

---

### Módulo 7: La Inteligencia - Base de Datos y ORM

**¿Qué aprendí?**

- **PostgreSQL** como BD relacional
- **Sequelize** como ORM para no escribir SQL plano
- **Relaciones**: 1:1 (User-Profile), 1:N (User-Posts), N:M (Posts-Categories)
- Validaciones en el modelo (email único, contraseña mínima, etc.)

**Decisión Clave**: Usar **Sequelize** en lugar de SQL puro porque:

- Protege contra SQL Injection
- Abstrae la BD (si cambio de PostgreSQL a MySQL, funciona igual)
- Validaciones integradas
- Relaciones automáticas

**Lo que funcionaba**:

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Relaciones configuradas correctamente
- ✅ Datos persistidos en BD

**Iteraciones en este módulo**:

- Primero: Usé queries SQL directas → **Problema**: SQL sucio
- Después: Cambié a Sequelize → **Solución**: Código más limpio

**Lo que mejoraría ahora**:

- Faltaba autenticación en endpoints
- Cualquiera podía leer/modificar datos

---

### Módulo 8: La API Segura - JWT y Exposición de Endpoints

**¿Qué aprendí?**

- **JWT (JSON Web Tokens)** para autenticación segura
- Middleware de autenticación para proteger rutas
- Diseño **RESTful**: métodos HTTP semánticos (GET, POST, PUT, DELETE)
- Integración **Frontend-Backend** real
- Validaciones de inputs y manejo de errores

**Decisión Clave**: Implementar JWT porque:

- Stateless (no necesito guardar sesiones en servidor)
- Seguro: token firmado con secret
- Escalable: funciona en microservicios
- Estándar en la industria

**Iteraciones en este módulo**:

1. **Primero**: Frontend validaba localmente contra JSON
   - ❌ Inseguro: contraseñas visibles en el código
   - ❌ No realista

2. **Después**: Conecté frontend a API backend
   - ✅ Token generado en servidor
   - ✅ Frontend guarda token en localStorage
   - ✅ Cada petición envía token en header Authorization

**Lo que funcionaba**:

- ✅ Login genera token JWT válido (24h de expiración)
- ✅ Rutas protegidas validan token
- ✅ Sin token → 401 Unauthorized
- ✅ POST /api/posts requiere autenticación
- ✅ Multer configurado para subida de archivos

---

## 🔄 Cómo Itero entre Módulos

### De Módulo 6 → 7

```
Rutas básicas (Express)
    ↓
Necesito: Persistencia real
    ↓
Agrego: PostgreSQL + Sequelize
    ↓
Refactorizo: Controladores separan lógica
```

### De Módulo 7 → 8

```
Datos en BD (Sequelize)
    ↓
Necesito: API segura
    ↓
Agrego: JWT + Middlewares de auth
    ↓
Refactorizo: Login/Register devuelven tokens
    ↓
Integro: Frontend consume API
```

---

## 🎓 Arquitectura Final - Por qué esta estructura

```
alke-wallet (Frontend)
    └── assets/js/
        ├── config.js ← Configuración centralizada API
        ├── login.js ← Autentica contra /api/auth/login
        └── menu.js ← Obtiene datos de /api/profile

back (Backend)
    ├── src/
    │   ├── app.js ← Punto de entrada, middlewares globales
    │   ├── controllers/ ← Lógica de negocio separada
    │   │   ├── auth.controller.js ← Login, Register, JWT
    │   │   └── post.controller.js ← CRUD posts
    │   ├── routes/ ← Define endpoints
    │   │   ├── auth.routes.js ← POST /login, /register
    │   │   └── post.routes.js ← GET/POST/PUT/DELETE /posts
    │   ├── middlewares/ ← Lógica transversal
    │   │   ├── auth.middleware.js ← Protege rutas con JWT
    │   │   └── validation.middleware.js ← Valida inputs
    │   └── models/ ← Sequelize (BD)
    │       ├── User.model.js ← Tabla users
    │       └── Post.model.js ← Tabla posts
    └── .env ← Secretos (DB, JWT_SECRET)
```

**¿Por qué esta arquitectura?**

1. **Separación de responsabilidades**: Cada archivo hace UNA cosa
2. **Reutilización**: Middlewares se aplican a varias rutas
3. **Testing**: Fácil mockear controllers
4. **Escalabilidad**: Agregar nuevo endpoint es copiar/pegar patrón
5. **Mantenimiento**: Bug en POST → busco en post.controller.js

---

## 💡 Decisiones Técnicas Principales

### 1. ¿Por qué JWT y no cookies?

```
Cookies:
- ✅ Más seguras (httpOnly)
- ❌ Stateful (servidor guarda sesiones)
- ❌ No funciona bien en mobile/APIs

JWT:
- ✅ Stateless (servidor no guarda nada)
- ✅ Funciona en Web, Mobile, IoT
- ⚠️ Menor seguridad si se roba (localStorage)
```

**Elegí JWT** porque es más moderno y escalable.

### 2. ¿Por qué Sequelize y no SQL plano?

```
SQL Plano:
- ✅ Rápido
- ❌ SQL Injection si no valido
- ❌ Cambiar BD = reescribir queries

Sequelize:
- ✅ Seguro por defecto
- ✅ Abstracto (cambiar BD es fácil)
- ✅ Relaciones automáticas
- ⚠️ Un poco más lento
```

**Elegí Sequelize** porque la seguridad y escalabilidad valen la pena.

### 3. ¿Por qué localStorage para el token?

```
localStorage:
- ✅ Simple, accesible desde JS
- ❌ Vulnerable a XSS
- ❌ No se elimina si no hago logout

sessionStorage / cookies httpOnly:
- ✅ Más seguro
- ❌ Más complejo de implementar
```

**Elegí localStorage** porque es educativo, pero en producción usaría httpOnly cookies.

---

## 🚀 Lo que Funcionó Bien

✅ **Backend estructurado**: Controllers, routes, middlewares separados  
✅ **BD relacional**: Sequelize maneja relaciones automáticamente  
✅ **Autenticación JWT**: Token válido por 24h  
✅ **Rutas protegidas**: Sin token → 401  
✅ **Frontend integrado**: config.js centraliza endpoints  
✅ **Validaciones**: Email único, contraseña mínima, tipos de dato  
✅ **Manejo de errores**: Errores coherentes en toda la API  
✅ **Logging**: Cada petición se registra en archivo

---

## ⚠️ Lo que Mejoraría

1. **Refresh Token**: Token expira a las 24h, usuario debe re-loguear
   - Solución: Implementar refresh token automático

2. **Email Verification**: No verifico si email es real
   - Solución: Enviar email con link de confirmación

3. **Rate Limiting**: Alguien podría hacer 1000 login intentos/min
   - Solución: Agregar express-rate-limit

4. **HTTPS**: Datos viajan sin cifrar en desarrollo
   - Solución: En producción, siempre HTTPS

5. **Password Reset**: No hay forma de cambiar contraseña olvidada
   - Solución: Email con link temporal

6. **Avatar Upload**: Multer configurado pero no totalmente integrado
   - Solución: Endpoint POST /api/profile/avatar funcional

---

## 📊 Estadísticas del Proyecto

| Métrica          | Valor             |
| ---------------- | ----------------- |
| Endpoints REST   | 15+               |
| Tablas BD        | 5                 |
| Relaciones       | 3 (1:1, 1:N, N:M) |
| Middlewares      | 6                 |
| Controladores    | 5                 |
| Líneas de código | ~2000             |
| Tiempo total     | 3 módulos         |

---

## 🎓 Mi Mayor Aprendizaje

**Módulo 6 → 7 → 8** no es solo agregar features.

Es **mentalidad de arquitectura**:

- Módulo 6: "¿Funciona?"
- Módulo 7: "¿Es seguro?"
- Módulo 8: "¿Es escalable?"

Aprendí que **código que funciona ≠ código bueno**.

Buen código es:

1. ✅ Funcional
2. ✅ Legible
3. ✅ Mantenible
4. ✅ Escalable
5. ✅ Seguro

---

## 🎯 De cara al Futuro

**Qué quiero aprender después:**

1. **Testing**: Jest, Mocha para tests unitarios
2. **DevOps**: Docker, CI/CD, deploy a AWS
3. **GraphQL**: Alternativa a REST
4. **WebSockets**: Chat en tiempo real
5. **Microservicios**: Separar backend en múltiples servicios

---

## ✅ Conclusión

Los 3 módulos me enseñaron a construir una **API RESTful profesional** desde cero.

De validaciones locales (M6) → Datos en BD (M7) → API segura con JWT (M8).

El viaje de un desarrollador junior a ... bueno, un junior menos nuevo 😅

---

**Firma**: Sebastian  
**Fecha**: 28/03/2026  
**Status**: ✅ Proyecto Completado
