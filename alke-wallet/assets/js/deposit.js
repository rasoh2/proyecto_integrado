/**
 * ALKE WALLET - Sistema de Depósitos
 * deposit.js - Manejo de depósitos de dinero con jQuery
 */

$(document).ready(function () {
  console.log("💰 Pantalla de Depósito Cargada - Alke Wallet");

  verificarAutenticacion();

  mostrarSaldoActual();

  configurarEventos();

  /**
   * Verificar si el usuario está autenticado
   */
  function verificarAutenticacion() {
    if (!localStorage.getItem("usuarioLogueado")) {
      alert("⚠️ Debes iniciar sesión primero");
      window.location.href = "index.html";
      return;
    }
  }

  /**
   * Mostrar saldo actual con formato
   */
  function mostrarSaldoActual() {
    const saldo = parseFloat(localStorage.getItem("saldo")) || 0;
    $("#saldoActual").text("$" + formatearNumero(saldo));
    console.log("💵 Saldo actual: $" + formatearNumero(saldo));
  }

  /**
   * Configurar eventos del formulario y botones
   */
  function configurarEventos() {
    // Evento submit del formulario
    $("#depositForm").on("submit", function (e) {
      e.preventDefault();
      realizarDeposito();
    });

    // Botones de montos rápidos
    $(".btn-monto-rapido").on("click", function () {
      const monto = $(this).data("monto");
      $("#montoDeposito").val(monto);
      console.log("⚡ Monto rápido seleccionado: $" + formatearNumero(monto));

      // Efecto visual
      $(".btn-monto-rapido").removeClass("active");
      $(this).addClass("active");
    });

    // Validación en tiempo real
    $("#montoDeposito").on("input", function () {
      let valor = $(this).val();

      // Evitar números negativos
      if (valor < 0) {
        $(this).val(0);
      }

      // Validar límite máximo (opcional)
      if (valor > 10000000) {
        mostrarAlerta(
          "⚠️ El monto máximo de depósito es $10.000.000",
          "warning"
        );
        $(this).val(10000000);
      }
    });

    console.log("✅ Eventos configurados");
  }

  // Realizar depósito de dinero

  function realizarDeposito() {
    const monto = parseFloat($("#montoDeposito").val());

    console.log(
      "💰 Intentando realizar depósito de: $" + formatearNumero(monto)
    );

    // Validaciones
    if (isNaN(monto) || monto <= 0) {
      mostrarAlerta("⚠️ Por favor ingresa un monto válido mayor a 0", "danger");
      $("#montoDeposito").focus();
      return;
    }

    if (monto < 1000) {
      mostrarAlerta("⚠️ El monto mínimo de depósito es $1.000 CLP", "warning");
      $("#montoDeposito").focus();
      return;
    }

    // Obtener saldo actual
    const saldoActual = parseFloat(localStorage.getItem("saldo")) || 0;
    const nuevoSaldo = saldoActual + monto;

    console.log("💵 Saldo anterior: $" + formatearNumero(saldoActual));
    console.log("💵 Nuevo saldo: $" + formatearNumero(nuevoSaldo));

    // Guardar nuevo saldo
    localStorage.setItem("saldo", nuevoSaldo.toString());

    // Actualizar visualización del saldo
    mostrarSaldoActual();

    // Guardar transacción en el historial
    guardarTransaccion("deposito", monto, "Depósito en billetera");

    // Mostrar mensaje de éxito
    mostrarAlerta(
      `
      <div class="text-center">
        <h5 class="mb-3">✅ ¡Depósito exitoso!</h5>
        <p class="mb-2"><strong>Monto depositado:</strong> $${formatearNumero(
          monto
        )} CLP</p>
        <p class="mb-0"><strong>Nuevo saldo:</strong> $${formatearNumero(
          nuevoSaldo
        )} CLP</p>
      </div>
    `,
      "success"
    );

    // Limpiar formulario
    $("#montoDeposito").val("");
    $(".btn-monto-rapido").removeClass("active");

    // Desactivar botón temporalmente
    $("#depositForm button[type='submit']")
      .prop("disabled", true)
      .text("Procesando...");

    // Redirigir después de 2 segundos
    setTimeout(function () {
      window.location.href = "menu.html";
    }, 2000);

    console.log("✅ Depósito realizado exitosamente");
  }

  /**
   * Guardar transacción en localStorage
   * @param {string} tipo - Tipo de transacción
   * @param {number} monto - Monto de la transacción
   * @param {string} descripcion - Descripción de la transacción
   */
  function guardarTransaccion(tipo, monto, descripcion) {
    // Obtener movimientos existentes
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    // Generar ID único incremental
    const ultimoId = movimientos.length > 0 ? movimientos[0].id || 0 : 0;
    const nuevoId = Math.max(ultimoId + 1, movimientos.length + 1);

    // Crear nuevo movimiento
    const nuevoMovimiento = {
      id: nuevoId,
      tipo: tipo,
      monto: monto,
      descripcion: descripcion,
      fecha: new Date().toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      timestamp: Date.now(),
    };

    // Agregar al inicio del array
    movimientos.unshift(nuevoMovimiento);

    // Limitar a 50 movimientos para no saturar localStorage
    if (movimientos.length > 50) {
      movimientos = movimientos.slice(0, 50);
    }

    // Guardar en localStorage
    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    console.log("📝 Transacción guardada:", nuevoMovimiento);
  }

  /**
   * Mostrar alertas de Bootstrap dinámicamente
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
      `
      );

    // Agregar al contenedor con animación
    $("#alert-container").append(alerta).hide().fadeIn(400);

    // Scroll suave hacia la alerta
    $("html, body").animate(
      {
        scrollTop: $("#alert-container").offset().top - 100,
      },
      500
    );
  }

  /**
   * Formatear números con separador de miles
   * @param {number} num - Número a formatear
   * @returns {string} - Número formateado
   */
  function formatearNumero(num) {
    return Math.floor(num).toLocaleString("es-CL");
  }

  // Enfocar automáticamente el campo de monto
  $("#montoDeposito").focus();

  // Animación de entrada
  $(".card").css({
    opacity: 0,
    transform: "translateY(30px)",
  });

  setTimeout(function () {
    $(".card").animate({ opacity: 1 }, 500);
    $(".card").css({
      transform: "translateY(0)",
      transition: "transform 0.5s ease",
    });
  }, 100);

  console.log("✅ Sistema de Depósitos listo para usar");
});
