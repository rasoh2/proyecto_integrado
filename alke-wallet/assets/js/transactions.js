/**
 * ALKE WALLET - Historial de Transacciones
 * transactions.js - Manejo de historial de movimientos con jQuery
 * Desarrollado para el Bootcamp SENCE 2025
 */

$(document).ready(function () {
  console.log("📊 Pantalla de Últimos Movimientos Cargada - Alke Wallet");

  // Verificar autenticación
  verificarAutenticacion();

  // Obtener movimientos desde localStorage
  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  console.log("📋 Total de movimientos:", movimientos.length);

  // Mostrar saldo y resumen
  mostrarResumen();

  // Mostrar todos los movimientos al cargar
  mostrarMovimientos("todos", "reciente");

  // Configurar eventos
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
   * Mostrar resumen de saldo y totales
   */
  function mostrarResumen() {
    const saldo = parseFloat(localStorage.getItem("saldo")) || 0;
    let totalDepositado = 0;
    let totalEnviado = 0;

    movimientos.forEach(function (mov) {
      // Validar que monto existe y es un número válido
      const montoValido = parseFloat(mov.monto) || 0;

      if (mov.tipo === "deposito") {
        totalDepositado += montoValido;
      } else if (mov.tipo === "transferencia") {
        totalEnviado += montoValido;
      }
    });

    $("#saldoActual").text("$" + formatearNumero(saldo));
    $("#totalDepositado").text("$" + formatearNumero(totalDepositado));
    $("#totalEnviado").text("$" + formatearNumero(totalEnviado));

    console.log("💰 Resumen:");
    console.log("   Saldo actual: $" + formatearNumero(saldo));
    console.log("   Total depositado: $" + formatearNumero(totalDepositado));
    console.log("   Total enviado: $" + formatearNumero(totalEnviado));
  }

  /**
   * Configurar eventos de filtros y ordenamiento
   */
  function configurarEventos() {
    // Evento para filtrar por tipo
    $("#filtroTipo").on("change", function () {
      const filtro = $(this).val();
      const orden = $("#ordenar").val();
      console.log("🔍 Filtro seleccionado:", filtro);
      mostrarMovimientos(filtro, orden);
    });

    // Evento para ordenar
    $("#ordenar").on("change", function () {
      const orden = $(this).val();
      const filtro = $("#filtroTipo").val();
      console.log("↕️ Orden seleccionado:", orden);
      mostrarMovimientos(filtro, orden);
    });

    console.log("✅ Eventos configurados");
  }

  /**
   * Mostrar movimientos filtrados y ordenados
   * @param {string} filtro - Tipo de filtro (todos, deposito, transferencia)
   * @param {string} orden - Tipo de orden (reciente, antiguo, mayor, menor)
   */
  function mostrarMovimientos(filtro, orden) {
    // Limpiar lista
    $("#listaMovimientos").empty();
    $("#sinMovimientos").hide();

    // Obtener movimientos actualizados
    movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    // Filtrar movimientos según el tipo
    let movimientosFiltrados = movimientos;

    if (filtro !== "todos") {
      movimientosFiltrados = movimientos.filter(function (mov) {
        return mov.tipo === filtro;
      });
    }

    console.log(
      `🔍 Movimientos filtrados (${filtro}):`,
      movimientosFiltrados.length
    );

    // Ordenar movimientos
    movimientosFiltrados = ordenarMovimientos(movimientosFiltrados, orden);

    // Verificar si hay movimientos
    if (movimientosFiltrados.length === 0) {
      mostrarSinMovimientos(filtro);
      return;
    }

    // Crear elementos con jQuery
    movimientosFiltrados.forEach(function (mov, index) {
      const $item = crearItemMovimiento(mov, index);
      $("#listaMovimientos").append($item);
    });

    // Mostrar lista con animación
    $("#listaMovimientos").hide().fadeIn(500);

    console.log("✅ Movimientos mostrados correctamente");
  }

  /**
   * Ordenar movimientos según criterio
   * @param {Array} movimientos - Array de movimientos
   * @param {string} orden - Criterio de orden
   * @returns {Array} - Movimientos ordenados
   */
  function ordenarMovimientos(movimientos, orden) {
    switch (orden) {
      case "reciente":
        return movimientos.sort((a, b) => b.timestamp - a.timestamp);

      case "antiguo":
        return movimientos.sort((a, b) => a.timestamp - b.timestamp);

      case "mayor":
        return movimientos.sort((a, b) => b.monto - a.monto);

      case "menor":
        return movimientos.sort((a, b) => a.monto - b.monto);

      default:
        return movimientos;
    }
  }

  /**
   * Crear elemento HTML para un movimiento
   * @param {Object} mov - Objeto de movimiento
   * @param {number} index - Índice del movimiento
   * @returns {jQuery} - Elemento jQuery
   */
  function crearItemMovimiento(mov, index) {
    // Determinar signo, clase e icono según tipo
    const signo = mov.tipo === "deposito" ? "+" : "-";
    const clase = mov.tipo === "deposito" ? "text-success" : "text-danger";
    const iconoTipo = mov.tipo === "deposito" ? "💰" : "💸";
    const bgClase =
      mov.tipo === "deposito" ? "bg-success-soft" : "bg-danger-soft";

    // Validar que monto existe y es un número válido
    const montoValido =
      mov.monto !== undefined && !isNaN(mov.monto) ? mov.monto : 0;

    // Crear elemento <li>
    const $li = $("<li></li>")
      .addClass(
        "list-group-item d-flex justify-content-between align-items-start"
      )
      .css({
        opacity: 0,
        transform: "translateX(-20px)",
      });

    // Contenedor de información
    const $infoContainer = $("<div></div>").addClass("flex-grow-1");

    // Título del movimiento
    const $titulo = $("<div></div>")
      .addClass("d-flex align-items-center mb-2")
      .html(
        `
        <span class="badge ${bgClase} me-2">${iconoTipo}</span>
        <strong>${getTipoTransaccion(mov.tipo)}</strong>
      `
      );

    // Descripción
    const $descripcion = $("<p></p>")
      .addClass("mb-1 text-muted")
      .text(mov.descripcion || "Sin descripción");

    // Fecha
    const $fecha = $("<small></small>")
      .addClass("text-muted")
      .html(`📅 ${mov.fecha || "Fecha no disponible"}`);

    // Si es transferencia, agregar destinatario
    if (mov.tipo === "transferencia" && mov.alias) {
      const $destinatario = $("<small></small>")
        .addClass("text-muted d-block")
        .html(`👤 Para: ${mov.alias}`);
      $infoContainer.append($destinatario);
    }

    // Ensamblar información
    $infoContainer.append($titulo).append($descripcion).append($fecha);

    // Contenedor de monto
    const $montoContainer = $("<div></div>")
      .addClass("text-end ms-3")
      .html(
        `
        <h5 class="${clase} fw-bold mb-0">${signo} $${formatearNumero(
          montoValido
        )}</h5>
      `
      );

    // Ensamblar y agregar animación
    $li.append($infoContainer).append($montoContainer);

    // Animación de entrada escalonada
    setTimeout(function () {
      $li.animate({ opacity: 1 }, 400);
      $li.css({
        transform: "translateX(0)",
        transition: "transform 0.4s ease",
      });
    }, index * 50);

    return $li;
  }

  /**
   * Mostrar mensaje cuando no hay movimientos
   * @param {string} filtro - Tipo de filtro aplicado
   */
  function mostrarSinMovimientos(filtro) {
    const mensajes = {
      todos: "No hay movimientos registrados",
      deposito: "No hay depósitos registrados",
      transferencia: "No hay transferencias registradas",
    };

    $("#sinMovimientos")
      .html(
        `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#6c757d" class="mb-3">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
        </svg>
        <h5 class="text-muted">${mensajes[filtro] || mensajes.todos}</h5>
        <p class="text-muted">Comienza realizando un depósito o transferencia</p>
      `
      )
      .fadeIn(400);

    console.log("📭 No hay movimientos para mostrar con el filtro:", filtro);
  }

  /**
   * Obtener el tipo de transacción en formato legible
   * @param {string} tipo - Tipo de transacción
   * @returns {string} - Tipo formateado
   */
  function getTipoTransaccion(tipo) {
    const tipos = {
      deposito: "Depósito",
      transferencia: "Transferencia Enviada",
      compra: "Compra",
      "transferencia-recibida": "Transferencia Recibida",
    };
    return tipos[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }

  /**
   * Formatear números con separador de miles
   * @param {number} num - Número a formatear
   * @returns {string} - Número formateado
   */
  function formatearNumero(num) {
    return Math.floor(num).toLocaleString("es-CL");
  }

  // Agregar estilos para los badges personalizados
  const style = document.createElement("style");
  style.textContent = `
    .bg-success-soft {
      background-color: rgba(28, 200, 138, 0.15);
      color: #1cc88a;
      font-size: 1.2rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
    }
    .bg-danger-soft {
      background-color: rgba(231, 74, 59, 0.15);
      color: #e74a3b;
      font-size: 1.2rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
    }
  `;
  document.head.appendChild(style);

  // Animación de entrada para las tarjetas de resumen
  $(".card").each(function (index) {
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

  // Mostrar resumen en consola
  console.log("════════════════════════════════════════");
  console.log("📊 RESUMEN DE MOVIMIENTOS");
  console.log("════════════════════════════════════════");

  let totalDepositos = 0;
  let totalTransferencias = 0;
  let sumaDepositos = 0;
  let sumaTransferencias = 0;

  movimientos.forEach(function (mov) {
    if (mov.tipo === "deposito") {
      totalDepositos++;
      sumaDepositos += mov.monto;
    } else if (mov.tipo === "transferencia") {
      totalTransferencias++;
      sumaTransferencias += mov.monto;
    }
  });

  console.log("💰 Depósitos:");
  console.log("   Cantidad:", totalDepositos);
  console.log("   Total: $" + formatearNumero(sumaDepositos));
  console.log("\n💸 Transferencias:");
  console.log("   Cantidad:", totalTransferencias);
  console.log("   Total: $" + formatearNumero(sumaTransferencias));
  console.log(
    "\n📈 Balance neto: $" + formatearNumero(sumaDepositos - sumaTransferencias)
  );
  console.log("════════════════════════════════════════");

  console.log("✅ Sistema de Transacciones listo para usar");
});
