/**
 * ALKE WALLET - Menú Principal
 * menu.js - Manejo del menú y estadísticas con API Backend
 * Desarrollado para el Bootcamp SENCE 2025
 *
 * Cambios en MÓDULO 8:
 * - Integración con API Backend
 * - Obtiene datos del perfil usuarios
 * - Obtiene transacciones desde posts
 */

$(document).ready(async function () {
  console.log("🏠 Menú Principal Cargado - Alke Wallet (v2 - Integración API)");

  // Verificar autenticación
  verificarAutenticacion();

  // Cargar datos del usuario desde API
  await cargarDatosUsuario();

  // Mostrar saldo actual desde API
  await mostrarSaldoActual();

  // Mostrar estadísticas
  await mostrarEstadisticas();

  // Eventos de los botones
  configurarEventos();

  /**
   * Verificar si el usuario está autenticado
   */
  function verificarAutenticacion() {
    if (!isAuthenticated()) {
      console.log("❌ Usuario no autenticado, redirigiendo al login...");
      alert("⚠️ Debes iniciar sesión primero");
      window.location.href = "index.html";
      return;
    }

    console.log("✅ Usuario autenticado con JWT");
  }

  /**
   * Cargar datos del usuario desde la API
   */
  async function cargarDatosUsuario() {
    try {
      const response = await apiGET(API_ENDPOINTS.PROFILE.GET);

      if (response.status === "success") {
        const user = response.data.user;
        const profile = response.data.profile;

        const nombreCompleto = `${user.name || "Usuario"}`;

        $("#nombreUsuario").text(`👤 ${nombreCompleto}`);
        localStorage.setItem("nombreUsuario", user.name);
        localStorage.setItem("emailUsuario", user.email);
        localStorage.setItem("idUsuario", user.id);

        console.log("📝 Datos de usuario cargados desde API:", nombreCompleto);
      }
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error);
      $("#nombreUsuario").text("👤 Usuario");
    }
  }

  /**
   * Mostrar saldo actual desde la API
   */
  async function mostrarSaldoActual() {
    try {
      const response = await apiGET(API_ENDPOINTS.PROFILE.GET);

      if (response.status === "success") {
        const balance = response.data.profile?.balance || 0;

        $("#saldoActual")
          .text("$" + formatearNumero(balance))
          .addClass("fade-in");

        localStorage.setItem("saldo", balance.toString());
        console.log("💰 Saldo actual mostrado: $" + formatearNumero(balance));
      }
    } catch (error) {
      console.error("❌ Error al cargar saldo:", error);

      // Usar saldo local si la API falla
      const saldo = parseFloat(localStorage.getItem("saldo")) || 0;
      $("#saldoActual")
        .text("$" + formatearNumero(saldo))
        .addClass("fade-in");
    }
  }

  /**
   * Mostrar estadísticas desde la API
   */
  async function mostrarEstadisticas() {
    try {
      // Obtener transacciones del usuario
      const postsResponse = await apiGET(API_ENDPOINTS.POSTS.GET_ALL);

      let contadorDepositos = 0;
      let contadorTransferencias = 0;

      if (
        postsResponse.status === "success" &&
        Array.isArray(postsResponse.data)
      ) {
        // Contar según el tipo de post
        postsResponse.data.forEach(function (post) {
          if (post.category === "deposito" || post.type === "deposito") {
            contadorDepositos++;
          } else if (
            post.category === "transferencia" ||
            post.type === "transferencia"
          ) {
            contadorTransferencias++;
          }
        });
      }

      // Usar datos locales como respaldo
      const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
      const contactos = JSON.parse(localStorage.getItem("contactos")) || [];

      // Si la API no tiene datos, usar datos locales
      if (
        contadorDepositos === 0 &&
        contadorTransferencias === 0 &&
        movimientos.length > 0
      ) {
        movimientos.forEach(function (mov) {
          if (mov.tipo === "deposito") {
            contadorDepositos++;
          } else if (mov.tipo === "transferencia") {
            contadorTransferencias++;
          }
        });
      }

      // Actualizar interfaz con animación
      $("#totalDepositos").text(contadorDepositos).addClass("fade-in");
      $("#totalTransferencias")
        .text(contadorTransferencias)
        .addClass("fade-in");
      $("#totalContactos").text(contactos.length).addClass("fade-in");
      $("#totalMovimientos")
        .text(contadorDepositos + contadorTransferencias)
        .addClass("fade-in");

      console.log("📊 Estadísticas cargadas:");
      console.log(`   💰 Depósitos: ${contadorDepositos}`);
      console.log(`   💸 Transferencias: ${contadorTransferencias}`);
      console.log(`   👥 Contactos: ${contactos.length}`);
      console.log(
        `   📋 Total Movimientos: ${contadorDepositos + contadorTransferencias}`,
      );
    } catch (error) {
      console.error("❌ Error al cargar estadísticas:", error);

      // Usar datos locales
      const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
      const contactos = JSON.parse(localStorage.getItem("contactos")) || [];

      let contadorDepositos = 0;
      let contadorTransferencias = 0;

      movimientos.forEach(function (mov) {
        if (mov.tipo === "deposito") {
          contadorDepositos++;
        } else if (mov.tipo === "transferencia") {
          contadorTransferencias++;
        }
      });

      $("#totalDepositos").text(contadorDepositos).addClass("fade-in");
      $("#totalTransferencias")
        .text(contadorTransferencias)
        .addClass("fade-in");
      $("#totalContactos").text(contactos.length).addClass("fade-in");
      $("#totalMovimientos").text(movimientos.length).addClass("fade-in");
    }
  }

  /**
   * Configurar eventos de los botones
   */
  function configurarEventos() {
    // Botón Depositar
    $("#btnDeposit").on("click", function () {
      const pagina = $(this).data("page");
      console.log("📍 Navegando a:", pagina);
      window.location.href = pagina;
    });

    // Botón Enviar Dinero
    $("#btnSendMoney").on("click", function () {
      const pagina = $(this).data("page");
      console.log("📍 Navegando a:", pagina);
      window.location.href = pagina;
    });

    // Botón Transacciones
    $("#btnTransactions").on("click", function () {
      const pagina = $(this).data("page");
      console.log("📍 Navegando a:", pagina);
      window.location.href = pagina;
    });

    // Botón Cerrar Sesión
    $("#btnCerrarSesion").on("click", function () {
      cerrarSesion();
    });

    console.log("✅ Eventos configurados correctamente");
  }

  /**
   * Cerrar sesión del usuario
   */
  function cerrarSesion() {
    const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmar) {
      console.log("👋 Cerrando sesión...");

      // Limpiar token JWT
      clearToken();

      // Limpiar solo datos de sesión
      localStorage.removeItem("usuarioLogueado");
      localStorage.removeItem("nombreUsuario");
      localStorage.removeItem("emailUsuario");
      localStorage.removeItem("idUsuario");
      localStorage.removeItem("token");

      // Si quieres mantener los datos entre sesiones, comenta estas líneas:
      // localStorage.removeItem("saldo");
      // localStorage.removeItem("movimientos");
      // localStorage.removeItem("contactos");

      console.log("✅ Sesión cerrada exitosamente");
      alert("👋 Has cerrado sesión correctamente");

      // Redirigir al login
      window.location.href = "index.html";
    }
  }

  /**
   * Función para formatear números con separador de miles
   * @param {number} num - Número a formatear
   * @returns {string} - Número formateado
   */
  function formatearNumero(num) {
    return Math.floor(num).toLocaleString("es-CL");
  }

  // Actualizar saldo cada 10 segundos (por si se modifica en otra pestaña o en la API)
  setInterval(async function () {
    const saldoAnterior = $("#saldoActual").text();
    await mostrarSaldoActual();
    const saldoNuevo = $("#saldoActual").text();

    if (saldoAnterior !== saldoNuevo) {
      console.log("🔄 Saldo actualizado automáticamente desde la API");
    }
  }, 10000);

  // Efecto hover en las tarjetas de acción
  $(".action-card").hover(
    function () {
      $(this).find(".icon-circle").css("transform", "scale(1.1)");
    },
    function () {
      $(this).find(".icon-circle").css("transform", "scale(1)");
    },
  );

  // Animación de entrada para las tarjetas
  $(".action-card").each(function (index) {
    $(this).css({
      opacity: 0,
      transform: "translateY(20px)",
    });

    setTimeout(() => {
      $(this).animate({ opacity: 1 }, 500);
      $(this).css({
        transform: "translateY(0)",
        transition: "transform 0.5s ease",
      });
    }, index * 100);
  });

  console.log("✅ Menú Principal listo para usar");
});
