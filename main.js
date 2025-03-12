import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx/xlsx.mjs";

const form = document.getElementById("registro-form");
const descargarBtn = document.getElementById("descargar");
const borrarBtn = document.getElementById("borrar");
const logos = document.querySelectorAll(".logo_e");
let registros = []; // Array para almacenar los datos del formulario
let empresaSeleccionada = null; // Variable para guardar la empresa seleccionada

// Abrir (o crear) la base de datos IndexedDB llamada "miBaseDeDatos"
const request = indexedDB.open("miBaseDeDatos", 1);

request.onerror = (event) => {
  console.error("Error al abrir la base de datos", event);
};

request.onsuccess = (event) => {
  console.log("Base de datos abierta con éxito", event.target.result);
  cargarRegistros(); // Cargar los registros desde IndexedDB
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore("registros", { keyPath: "id", autoIncrement: true });
  store.createIndex("nombre", "nombre", { unique: false });
};

// Recuperar los registros guardados en IndexedDB
function cargarRegistros() {
  const db = request.result;
  const transaction = db.transaction(["registros"]);
  const store = transaction.objectStore("registros");

  const getAllRequest = store.getAll();
  getAllRequest.onsuccess = (event) => {
    registros = event.target.result;
  };

  getAllRequest.onerror = (event) => {
    console.error("Error al cargar los registros", event);
  };
}

// Manejar selección de empresa
logos.forEach((logo) => {
  logo.addEventListener("click", () => {
    empresaSeleccionada = logo.getAttribute("data-empresa");
    Swal.fire({
      title: "Empresa seleccionada",
      text: `Has seleccionado: ${empresaSeleccionada} ahora presiona ENVIAR`,
      icon: "info",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button'
      },
      buttonsStyling: false
    });
  });
});

// Enviar formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validar si se ha seleccionado una empresa
  if (!empresaSeleccionada) {
    Swal.fire({
      title: "Error",
      text: "Por favor selecciona una empresa antes de enviar.",
      icon: "error",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button'
      },
      buttonsStyling: false
    });
    return;
  }

  const data = {
    usuario: form.usuario.value,
    tipoId: form["tipo-id"].value,
    numeroId: form["numero-id"].value,
    nombre: form.nombre.value,
    observacion: form.observacion.value,
    empresa: empresaSeleccionada, // Incluir la empresa seleccionada
    horaCreacion: new Date().toISOString(),
  };

  // Agregar datos a IndexedDB
  const db = request.result;
  const transaction = db.transaction(["registros"], "readwrite");
  const store = transaction.objectStore("registros");
  const addRequest = store.add(data);

  addRequest.onsuccess = () => {
    registros.push(data);
    empresaSeleccionada = null; // Resetear la selección de empresa
    Swal.fire({
      title: "¡Genial!",
      text: "El registro se guardó correctamente.",
      icon: "success",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button'
      },
      buttonsStyling: false
    });
    form.reset();
  };

  addRequest.onerror = () => {
    console.error("Error al agregar el registro.");
  };
});

// Descargar archivo Excel
descargarBtn.addEventListener("click", () => {
  if (registros.length === 0) {
    Swal.fire({
      title: "Advertencia",
      text: "No hay datos para descargar.",
      icon: "warning",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button'
      },
      buttonsStyling: false
    });
    return;
  }

  const registrosConHora = registros.map((registro) => ({
    ...registro,
    horaCreacion: new Date(registro.horaCreacion).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(registrosConHora);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  XLSX.writeFile(workbook, "registros_inhouse.xlsx");
  Swal.fire({
    title: "¡Listo!",
    text: "El archivo Excel se descargó correctamente.",
    icon: "success",
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      content: 'custom-swal-content',
      confirmButton: 'custom-swal-confirm-button',
      cancelButton: 'custom-swal-cancel-button'
    },
    buttonsStyling: false
  });
});

// Borrar registros
borrarBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¡Advertencia!",
    text: "Estás a punto de borrar todos los registros. El mundo como lo conoces podría desaparecer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      content: 'custom-swal-content',
      confirmButton: 'custom-swal-confirm-button',
      cancelButton: 'custom-swal-cancel-button'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      const db = request.result;
      const transaction = db.transaction(["registros"], "readwrite");
      const store = transaction.objectStore("registros");

      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        registros = [];
        Swal.fire({
          title: "¡Listo!",
          text: "Los datos han sido borrados.",
          icon: "success",
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button',
            cancelButton: 'custom-swal-cancel-button'
          },
          buttonsStyling: false
        });
      };

      clearRequest.onerror = () => {
        console.error("Error al borrar los registros");
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al intentar borrar los registros.",
          icon: "error",
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button',
            cancelButton: 'custom-swal-cancel-button'
          },
          buttonsStyling: false
        });
      };
    }
  });
});
