/**
 * ALKE WALLET - Sistema de Autenticación
 * login.js - Manejo del inicio de sesión con API Backend
 * Desarrollado para el Bootcamp SENCE 2025
 *
 * Cambios en MÓDULO 8:
 * - Integración con API Backend (/api/auth/login)
 * - Eliminadas validaciones locales
 * - JWT almacenado en localStorage
 * - Llamadas HTTP sincronizadas con API
 */

$(document).ready(function () {
  console.log(
    "🚀 Sistema de Login Cargado - Alke Wallet (v2 - Integración API)",
  );

  // Evento submit del formulario de login
  $("#loginForm").on("submit", async function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    const email = $("#email").val().trim();
    const password = $("#password").val();

    console.log("🔍 Intento de inicio de sesión:", email);

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      mostrarAlerta("⚠️ Por favor completa todos los campos", "warning");
      return;
    }

    // Mostrar indicator de carga
    const btnSubmit = $(this).find('button[type="submit"]');
    const textOriginal = btnSubmit.text();
    btnSubmit
      .attr("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm me-2"></span>Autenticando...',
      );

    try {
      // Llamar a la API de login
      const response = await apiPOST(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("✅ Respuesta del servidor:", response);

      if (response.status === "success") {
        // Guardar token JWT
        saveToken(response.data.token);

        // Guardar datos del usuario en localStorage
        localStorage.setItem("usuarioLogueado", email);
        localStorage.setItem("idUsuario", response.data.user.id);
        localStorage.setItem(
          "nombreUsuario",
          response.data.user.name || "Usuario",
        );
        localStorage.setItem("emailUsuario", response.data.user.email);

        console.log("✅ Inicio de sesión exitoso");
        console.log("👤 Usuario:", response.data.user.name);
        console.log("🔐 Token guardado en localStorage");

        // Mostrar alerta de éxito
        mostrarAlerta(
          `¡Bienvenido ${response.data.user.name}! 🎉<br>Redirigiendo al menú principal...`,
          "success",
        );

        // Redirigir después de 1 segundo
        setTimeout(function () {
          window.location.href = "menu.html";
        }, 1000);
      } else {
        throw new Error(response.message || "Error en la autenticación");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);

      // Mostrar error específico o genérico
      let mensaje = "❌ Error en la autenticación";
      if (error.message) {
        mensaje += `<br><small>${error.message}</small>`;
      } else if (error.type === "TypeError") {
        mensaje =
          "❌ No se puede conectar al servidor<br><small>¿El backend está corriendo en localhost:3000?</small>";
      }

      mostrarAlerta(mensaje, "danger");

      // Limpiar campo de contraseña
      $("#password").val("").focus();

      // Agregar animación de shake al formulario
      $("#loginForm").addClass("shake");
      setTimeout(function () {
        $("#loginForm").removeClass("shake");
      }, 500);

      // Ocultar alerta después de 4 segundos
      setTimeout(function () {
        $("#alert-container").fadeOut(400, function () {
          $(this).empty().show();
        });
      }, 4000);
    } finally {
      // Restaurar botón
      btnSubmit.attr("disabled", false).text(textOriginal);
    }
  });

  /**
   * Función para mostrar alertas de Bootstrap dinámicamente
   * @param {string} mensaje - Mensaje a mostrar
   * @param {string} tipo - Tipo de alerta (success, danger, warning, info)
   */
  function mostrarAlerta(mensaje, tipo) {
    // Limpiar alertas anteriores
    $("#alert-container").empty();

    // Crear alerta de Bootstrap con jQuery
    const alerta = $("<div></div>")
      .addClass(`alert alert-${tipo} alert-dismissible fade show`)
      .attr("role", "alert")
      .html(
        `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `,
      );

    // Agregar al contenedor con animación
    $("#alert-container").append(alerta).hide().fadeIn(400);
  }

  // Verificar si el usuario ya está logueado
  if (isAuthenticated()) {
    console.log("👤 Usuario ya autenticado, redirigiendo...");
    window.location.href = "menu.html";
  }

  // Efecto de focus en los campos del formulario
  $(".form-control").on("focus", function () {
    $(this).parent().addClass("input-focused");
  });

  $(".form-control").on("blur", function () {
    $(this).parent().removeClass("input-focused");
  });

  // Prevenir doble submit
  let formularioEnviado = false;
  $("#loginForm").on("submit", function () {
    if (formularioEnviado) {
      return false;
    }
    formularioEnviado = true;
    setTimeout(function () {
      formularioEnviado = false;
    }, 2000);
  });

  console.log("✅ Sistema de Login listo para usar");
  console.log("ℹ️ La autenticación se realiza contra la API Backend");
});

// Animación de shake para el formulario
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
  .shake {
    animation: shake 0.5s;
  }
`;
document.head.appendChild(style);
