var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";
var valoresTotalizadosPositivos = "";
var mapa = document.getElementById("mapas-svg");
var textoTituloChico = document.getElementById("texto-titulo");
var textoSubtituloChico = document.getElementById("texto-azul");

var datosPorAgrupacion = document.getElementById("datos-por-agrupacion");
var porcentajesAgrupacion = document.getElementById("porcentaje-agrupaciones");

var sectorTitulos = document.getElementById("sec-titulo");
var sectorContenidos = document.getElementById("sec-contenido");

// Almaceno los displays originales de cada uno, previo a ocultarlos
var displayOriginal = {
  sectorTitulos: sectorTitulos.style.display,
  sectorContenidos: sectorContenidos.style.display,
//holamundo
};

sectorTitulos.style.display = "none";
sectorContenidos.style.display = "none";

const mensajeExito = document.getElementById("mensaje-exito");
const mensajeError = document.getElementById("mensaje-error");
const mensajeIncompleto = document.getElementById("mensaje-incompleto");

mensajeExito.style.display = "none";
mensajeError.style.display = "none";
mensajeIncompleto.style.display = "none";

function hayInformes() {
  if (localStorage.getItem("INFORMES")) {
    // Si hay datos, realiza alguna acción con ellos, como mostrarlos en tu aplicación.
    const informes = JSON.parse(localStorage.getItem("INFORMES"));
    // Por ejemplo, puedes mostrar los informes en una lista en tu página web.
    filtrarDatos(informes);
    sectorTitulos.style.display = displayOriginal.sectorTitulos;
    sectorContenidos.style.display = displayOriginal.sectorContenidos;
  } else {
    // Si no hay datos, muestra un mensaje amarillo al usuario.
    mensajeIncompleto.style.display = "block";
    mensajeIncompleto.innerHTML = `<i class="fas fa-exclamation"></i>No hay informes guardados para mostrar</p>`;
  }
}

hayInformes();

async function filtrarDatos(informes) {
  if (informes && informes.length > 0) {
    for (const informe of informes) {
      const informePartes = informe.split("|");

      // Obtener los datos necesarios para construir la URL de la API
      let anioEleccion = informePartes[0];
      let tipoRecuento = informePartes[1];
      let tipoEleccion = informePartes[2];
      let categoriaId = informePartes[3];
      let distritoId = informePartes[4];
      let seccionProvincialId = informePartes[5];
      let seccionId = informePartes[6];
      let circuitoId = "";
      let mesaId = "";

      let nombreCargo = informePartes[7];
      let nombreDistrito = informePartes[8];
      let nombreSeccion = informePartes[9];

      console.log(
        anioEleccion,
        tipoRecuento,
        tipoEleccion,
        distritoId,
        seccionProvincialId,
        seccionId,
        nombreCargo,
        nombreDistrito,
        nombreSeccion
      );

      seccionProvincialId = seccionProvincialId.replace(",", "");
      // Construir la URL de la API
      let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }

        const data = await response.json();

        // Si la respuesta fue correcta, imprimir en la consola
        console.log("Resultados obtenidos: ", data);

        console.log(
          "Año:",
          anioEleccion,
          "Categoria:",
          categoriaId,
          "Tipo de elección:",
          tipoEleccion,
          "Tipo de recuento:",
          tipoRecuento,
          "ID Distrito:",
          distritoId,
          "ID Sección Provincial:",
          seccionProvincialId,
          "ID Sección:",
          seccionId
        );

        let eleccionTipo = "";

        if (data.tipoEleccion == 1) {
          eleccionTipo = "PASO";
        } else {
          eleccionTipo = "Generales";
        }

        // Construir el registro de la tabla con los datos de la API
        let titulo = `Elecciones ${anioEleccion} | ${eleccionTipo}`;
        let subtitulo = `${anioEleccion} > ${eleccionTipo} > ${nombreCargo} > ${nombreDistrito} > ${nombreSeccion}`;
        let mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
        let electores = data.estadoRecuento.cantidadElectores;
        let participacionSobreEscrutado =
          data.estadoRecuento.participacionPorcentaje;

        // Mostrar los datos generales en la tabla
        textoTituloChico.innerHTML = titulo;
        textoSubtituloChico.innerHTML = subtitulo;

        actualizarMapa(distritoId);
        mostrarInformacionCuadros(
          mesasEscrutadas,
          electores,
          participacionSobreEscrutado
        );

        // Mostrar datos por agrupación
        // Ordenar las agrupaciones por la cantidad de votos (de mayor a menor)
        let valoresTotales = data.valoresTotalizadosPositivos;

        crearYOrdenarAgrupaciones(valoresTotales);

        // Si la respuesta fue correcta, imprimir en la consola
        console.log("Resultados obtenidos: ", data);
      } catch (error) {
        console.error(`Error en la solicitud: ${error.message}`);
        console.error(error);
      }
    }
  }
}

function actualizarMapa(distritoId) {
  let imagenMapa = document.getElementById("mapas-svg");

  const provinciaEncontrada = provincias.find(
    (provincia) => provincia.idDistrito == distritoId
  );

  if (provinciaEncontrada) {
    imagenMapa.innerHTML = `${provinciaEncontrada.svg}`;
    imagenMapa.style.width = "10px";
    imagenMapa.style.height = "10px";
  } else {
    console.log(
      "No se encontró una provincia correspondiente al distrito seleccionado."
    );
  }
}

function mostrarInformacionCuadros(
  mesasEscrutadas,
  electores,
  participacionSobreEscrutado
) {
  // Actualizar elementos con la información
  document.getElementById("mesas-computadas").innerHTML = mesasEscrutadas;
  document.getElementById("electores-porcentaje").innerHTML = electores;
  document.getElementById("participacion-porcentaje").innerHTML =
    participacionSobreEscrutado + "%";
}

function crearYOrdenarAgrupaciones(valoresTotales) {
  // Ordenar las agrupaciones por la cantidad de votos (de mayor a menor)
  valoresTotales.sort((a, b) => b.votos - a.votos);

  // Crear el contenedor
  var contenedorAgrupaciones = document.createElement("div");
  contenedorAgrupaciones.id = "datosPorAgrupacion"; // Asegúrate de que coincide con el ID existente
  contenedorAgrupaciones.style.overflowY = "auto"; // Agregar scroll vertical

  // Iterar sobre las agrupaciones ordenadas
  valoresTotales.forEach((agrupacion) => {
    let nombreAgrupacion = agrupacion.nombreAgrupacion;
    let votosPorcentaje = agrupacion.votosPorcentaje;
    let votos = agrupacion.votos;

    // Crear y configurar los elementos HTML
    var divAgrupacion = document.createElement("div");
    divAgrupacion.classList.add("datos-por-agrupacion");

    var pNombre = document.createElement("p");
    pNombre.style.fontWeight = "bold";
    pNombre.id = "datos-por-agrupacion";
    pNombre.textContent = nombreAgrupacion;

    var divPorcentaje = document.createElement("div");
    var pPorcentaje = document.createElement("p");
    pPorcentaje.id = "porcentaje-agrupaciones";
    pPorcentaje.innerHTML = `${votosPorcentaje}% <br> (${votos} votos)`;

    // Construir la estructura del DOM
    divPorcentaje.appendChild(pPorcentaje);
    divAgrupacion.appendChild(pNombre);
    divAgrupacion.appendChild(divPorcentaje);

    // Agregar los elementos al contenedor
    contenedorAgrupaciones.appendChild(divAgrupacion);
  });

  // Agregar el contenedor al DOM
  datosPorAgrupacion.innerHTML = ""; // Limpiar el contenido existente
  datosPorAgrupacion.appendChild(contenedorAgrupaciones);

}

