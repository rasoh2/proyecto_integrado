/**
 * ALKE WALLET - Sistema de Transferencias
 * sendMoney.js - Manejo de envío de dinero y gestión de contactos con jQuery
 * Desarrollado para el Bootcamp SENCE 2025
 */

$(document).ready(function () {
  console.log("💸 Pantalla de Enviar Dinero Cargada - Alke Wallet");

  // Variables globales
  let modalContacto;

  // Verificar autenticación
  verificarAutenticacion();

  // Inicializar modal de Bootstrap
  const modalElement = document.getElementById("modalContacto");
  if (modalElement) {
    modalContacto = new bootstrap.Modal(modalElement);
  }

  // Cargar contactos iniciales si no existen
  inicializarContactos();

  // Mostrar saldo disponible
  mostrarSaldoDisponible();

  // Cargar contactos en el select
  cargarContactos();

  // Mostrar lista de contactos
  mostrarListaContactos();

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
   * Inicializar contactos predefinidos (vacio por ahora ya que no hay endpoint de contactos)
   */
  function inicializarContactos() {
    if (!localStorage.getItem("contactos")) {
      console.log("📥 Inicializando contactos vacíos...");
      localStorage.setItem("contactos", JSON.stringify([]));
      cargarContactos();
      mostrarListaContactos();
    }
  }

  /**
   * Mostrar saldo disponible
   */
  function mostrarSaldoDisponible() {
    const saldo = parseFloat(localStorage.getItem("saldo")) || 0;
    $("#saldoDisponible").text("$" + formatearNumero(saldo));
    console.log("💵 Saldo disponible: $" + formatearNumero(saldo));
  }

  /**
   * Cargar contactos en el select con filtro opcional
   * @param {string} filtro - Texto para filtrar contactos
   */
  function cargarContactos(filtro = "") {
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const $select = $("#selectContacto");

    console.log("📋 Cargando contactos en select:", contactos.length);

    // Limpiar select excepto la primera opción
    $select.find("option:not(:first)").remove();

    // Filtrar contactos si hay búsqueda
    const contactosFiltrados = contactos.filter(function (contacto) {
      if (!filtro) return true;
      const textoCompleto =
        `${contacto.nombre} ${contacto.apellido} ${contacto.alias}`.toLowerCase();
      return textoCompleto.includes(filtro.toLowerCase());
    });

    console.log("🔍 Contactos filtrados:", contactosFiltrados.length);

    // Agregar contactos filtrados
    contactosFiltrados.forEach(function (contacto, index) {
      // Encontrar índice original
      const indexOriginal = contactos.findIndex(
        (c) => c.numeroCuenta === contacto.numeroCuenta
      );

      $select.append(
        $("<option></option>")
          .val(indexOriginal)
          .text(
            `${contacto.nombre} ${contacto.apellido} - ${contacto.alias} (${contacto.banco})`
          )
      );
    });

    // Mensaje si no hay contactos
    if (contactosFiltrados.length === 0) {
      $select.append(
        $("<option></option>")
          .attr("disabled", true)
          .text("❌ No se encontraron contactos")
      );
    }
  }

  /**
   * Mostrar lista de contactos guardados
   */
  function mostrarListaContactos() {
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const $lista = $("#listaContactos");

    $lista.empty();

    if (contactos.length === 0) {
      $("#sinContactos").show();
      return;
    }

    $("#sinContactos").hide();

    contactos.forEach(function (contacto, index) {
      const $item = $("<div></div>")
        .addClass(
          "list-group-item d-flex justify-content-between align-items-center"
        )
        .html(
          `
          <div>
            <strong>👤 ${contacto.nombre} ${contacto.apellido}</strong>
            <br>
            <small class="text-muted">
              ${contacto.alias} • ${contacto.banco} • ${contacto.numeroCuenta}
            </small>
          </div>
          <button class="btn btn-sm btn-danger btn-eliminar" data-index="${index}">
            🗑️ Eliminar
          </button>
        `
        );

      $lista.append($item);
    });

    // Evento para eliminar contactos
    $(".btn-eliminar").on("click", function () {
      const index = $(this).data("index");
      eliminarContacto(index);
    });

    console.log("📋 Lista de contactos actualizada");
  }

  /**
   * Configurar eventos de la página
   */
  function configurarEventos() {
    // Búsqueda en tiempo real
    $("#buscarContacto").on("input", function () {
      const textoBusqueda = $(this).val();
      console.log("🔍 Buscando:", textoBusqueda);
      cargarContactos(textoBusqueda);

      // Ocultar información del contacto y botón al buscar
      $("#infoContacto").slideUp(300);
      $("#selectContacto").val("");
    });

    // Mostrar información al seleccionar contacto
    $("#selectContacto").on("change", function () {
      const index = $(this).val();

      if (index !== "") {
        mostrarInfoContacto(parseInt(index));
      } else {
        $("#infoContacto").slideUp(300);
      }
    });

    // Abrir modal para nuevo contacto
    $("#btnNuevoContacto").on("click", function () {
      console.log("➕ Abriendo modal de nuevo contacto");
      modalContacto.show();
    });

    // Guardar nuevo contacto
    $("#btnGuardarContacto").on("click", function () {
      guardarContacto();
    });

    // Evento submit del formulario de envío
    $("#sendMoneyForm").on("submit", function (e) {
      e.preventDefault();
      realizarTransferencia();
    });

    // Validación del monto en tiempo real
    $("#montoEnviar").on("input", function () {
      let valor = $(this).val();
      if (valor < 0) {
        $(this).val(0);
      }
    });

    console.log("✅ Eventos configurados");
  }

  /**
   * Mostrar información del contacto seleccionado
   * @param {number} index - Índice del contacto
   */
  function mostrarInfoContacto(index) {
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos[index];

    if (contacto) {
      $("#infoNombre").text(`${contacto.nombre} ${contacto.apellido}`);
      $("#infoBanco").text(contacto.banco);
      $("#infoCuenta").text(contacto.numeroCuenta);

      $("#infoContacto").slideDown(300);

      console.log("📋 Contacto seleccionado:", contacto);
    }
  }

  /**
   * Guardar nuevo contacto
   */
  function guardarContacto() {
    // Obtener datos del formulario
    const contacto = {
      nombre: $("#nombre").val().trim(),
      apellido: $("#apellido").val().trim(),
      numeroCuenta: $("#numeroCuenta").val().trim(),
      alias: $("#alias").val().trim(),
      banco: $("#banco").val(),
    };

    console.log("💾 Intentando guardar contacto:", contacto);

    // Validar campos
    if (
      !contacto.nombre ||
      !contacto.apellido ||
      !contacto.numeroCuenta ||
      !contacto.alias ||
      !contacto.banco
    ) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    // Validar número de cuenta
    if (
      contacto.numeroCuenta.length < 8 ||
      contacto.numeroCuenta.length > 12 ||
      isNaN(contacto.numeroCuenta)
    ) {
      alert("⚠️ El número de cuenta debe tener entre 8 y 12 dígitos numéricos");
      $("#numeroCuenta").focus();
      return;
    }

    // Obtener contactos existentes
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

    // Verificar si ya existe el número de cuenta
    const existe = contactos.some(
      (c) => c.numeroCuenta === contacto.numeroCuenta
    );

    if (existe) {
      alert("⚠️ Este número de cuenta ya está registrado");
      $("#numeroCuenta").focus();
      return;
    }

    // Agregar contacto
    contactos.push(contacto);
    localStorage.setItem("contactos", JSON.stringify(contactos));

    console.log("✅ Contacto guardado exitosamente");
    console.log("📊 Total de contactos:", contactos.length);

    // Limpiar formulario
    $("#formContacto")[0].reset();

    // Cerrar modal
    modalContacto.hide();

    // Recargar contactos
    cargarContactos();
    mostrarListaContactos();

    // Mostrar alerta de éxito
    mostrarAlerta("✅ Contacto agregado exitosamente", "success");

    setTimeout(function () {
      $("#alert-container").fadeOut(400, function () {
        $(this).empty().show();
      });
    }, 3000);
  }

  /**
   * Eliminar contacto
   * @param {number} index - Índice del contacto a eliminar
   */
  function eliminarContacto(index) {
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos[index];

    const confirmar = confirm(
      `¿Estás seguro de eliminar a ${contacto.nombre} ${contacto.apellido}?`
    );

    if (confirmar) {
      contactos.splice(index, 1);
      localStorage.setItem("contactos", JSON.stringify(contactos));

      console.log("🗑️ Contacto eliminado:", contacto);

      cargarContactos();
      mostrarListaContactos();

      mostrarAlerta("✅ Contacto eliminado correctamente", "info");

      setTimeout(function () {
        $("#alert-container").fadeOut(400, function () {
          $(this).empty().show();
        });
      }, 2000);
    }
  }

  /**
   * Realizar transferencia de dinero
   */
  function realizarTransferencia() {
    const indexContacto = $("#selectContacto").val();
    const monto = parseFloat($("#montoEnviar").val());

    console.log("💸 Intentando realizar transferencia");

    // Validaciones
    if (!indexContacto || indexContacto === "") {
      mostrarAlerta("⚠️ Por favor selecciona un destinatario", "warning");
      return;
    }

    if (isNaN(monto) || monto <= 0) {
      mostrarAlerta("⚠️ Por favor ingresa un monto válido", "danger");
      $("#montoEnviar").focus();
      return;
    }

    if (monto < 1000) {
      mostrarAlerta(
        "⚠️ El monto mínimo de transferencia es $1.000 CLP",
        "warning"
      );
      $("#montoEnviar").focus();
      return;
    }

    // Verificar saldo suficiente
    const saldoActual = parseFloat(localStorage.getItem("saldo")) || 0;

    if (monto > saldoActual) {
      mostrarAlerta(
        `⚠️ Saldo insuficiente<br><small>Saldo disponible: $${formatearNumero(
          saldoActual
        )}</small>`,
        "danger"
      );
      return;
    }

    // Obtener datos del contacto
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos[parseInt(indexContacto)];

    // Calcular nuevo saldo
    const nuevoSaldo = saldoActual - monto;

    console.log("💵 Saldo anterior: $" + formatearNumero(saldoActual));
    console.log("💵 Monto a transferir: $" + formatearNumero(monto));
    console.log("💵 Nuevo saldo: $" + formatearNumero(nuevoSaldo));

    // Guardar nuevo saldo
    localStorage.setItem("saldo", nuevoSaldo.toString());

    // Actualizar visualización
    mostrarSaldoDisponible();

    // Guardar transacción
    guardarTransaccion(
      "transferencia",
      monto,
      `Transferencia a ${contacto.nombre} ${contacto.apellido}`,
      contacto.alias
    );

    // Mostrar mensaje de éxito
    mostrarAlerta(
      `
      <div class="text-center">
        <h5 class="mb-3">✅ ¡Transferencia exitosa!</h5>
        <p class="mb-2"><strong>Destinatario:</strong> ${contacto.nombre} ${
        contacto.apellido
      }</p>
        <p class="mb-2"><strong>Banco:</strong> ${contacto.banco}</p>
        <p class="mb-2"><strong>Monto:</strong> $${formatearNumero(
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
    $("#sendMoneyForm")[0].reset();
    $("#infoContacto").slideUp(300);
    $("#buscarContacto").val("");

    // Desactivar botón temporalmente
    $("#btnEnviarDinero").prop("disabled", true).text("Procesando...");

    // Redirigir después de 3 segundos
    setTimeout(function () {
      window.location.href = "menu.html";
    }, 3000);

    console.log("✅ Transferencia realizada exitosamente");
  }

  /**
   * Guardar transacción en localStorage
   */
  function guardarTransaccion(tipo, monto, descripcion, alias = "") {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    // Generar ID único incremental
    const ultimoId = movimientos.length > 0 ? movimientos[0].id || 0 : 0;
    const nuevoId = Math.max(ultimoId + 1, movimientos.length + 1);

    const nuevoMovimiento = {
      id: nuevoId,
      tipo: tipo,
      monto: monto,
      descripcion: descripcion,
      alias: alias,
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

    movimientos.unshift(nuevoMovimiento);

    if (movimientos.length > 50) {
      movimientos = movimientos.slice(0, 50);
    }

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    console.log("📝 Transacción guardada:", nuevoMovimiento);
  }

  /**
   * Mostrar alertas de Bootstrap
   */
  function mostrarAlerta(mensaje, tipo) {
    $("#alert-container").empty();

    const alerta = $("<div></div>")
      .addClass(`alert alert-${tipo} alert-dismissible fade show`)
      .attr("role", "alert")
      .html(
        `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      );

    $("#alert-container").append(alerta).hide().fadeIn(400);

    $("html, body").animate(
      {
        scrollTop: $("#alert-container").offset().top - 100,
      },
      500
    );
  }

  /**
   * Formatear números
   */
  function formatearNumero(num) {
    return Math.floor(num).toLocaleString("es-CL");
  }

  console.log("✅ Sistema de Transferencias listo para usar");
});
