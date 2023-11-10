var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";
var valoresTotalizadosPositivos = "";
var mapa = document.getElementById("mapas-svg");//
var textoTituloChico = document.getElementById("texto-elecciones-chico");//modificado
var textoSubtituloChico = document.getElementById("texto-path-chico");//modificado

var datosPorAgrupacion = document.getElementById("datos-por-agrupacion");//
var porcentajesAgrupacion = document.getElementById("porcentaje-agrupaciones");//

var sectorTitulos = document.getElementById("sec-titulo");//
var sectorContenidos = document.getElementById("sec-contenido");//

const tablaResultados = document.getElementById("tabla-resultados");//modificado

// Almaceno los displays originales de cada uno, previo a ocultarlos
const displayOriginal = {
  sectorTitulos: sectorTitulos.style.display,
  sectorContenidos: sectorContenidos.style.display,
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
    const informes = JSON.parse(localStorage.getItem("INFORMES"));
    filtrarDatos(informes);
    sectorTitulos.style.display = displayOriginal.sectorTitulos
    sectorContenidos.style.display = displayOriginal.sectorContenidos
  } else {
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
        var titulo = `Elecciones ${anioEleccion} | ${eleccionTipo}`;
        let subtitulo = `${anioEleccion} > ${eleccionTipo} > ${nombreCargo} > ${nombreDistrito} > ${nombreSeccion}`;
        let mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
        let electores = data.estadoRecuento.cantidadElectores;
        let participacionSobreEscrutado =
          data.estadoRecuento.participacionPorcentaje;

        // Crear nuevos elementos tr, td y agregarlos a la tabla
        const tr = document.createElement("tr");

        const tdProvincia = actualizarMapa(distritoId);

        const tdEleccion = document.createElement("td");

        const h3Eleccion = document.createElement("h3");
        h3Eleccion.innerHTML = titulo;
        tdEleccion.appendChild(h3Eleccion);

        const pEleccion = document.createElement("p");
        pEleccion.classList.add("texto-path");
        pEleccion.innerHTML = subtitulo;
        tdEleccion.appendChild(pEleccion);

        const tdCuadros = mostrarInformacionCuadros(
          mesasEscrutadas,
          electores,
          participacionSobreEscrutado
        );

        let valoresTotales = data.valoresTotalizadosPositivos;

        const tdDatos = document.createElement("td");
        tdDatos.appendChild(crearYOrdenarAgrupaciones(valoresTotales));

        // Agrega los td al tr
        tr.appendChild(tdProvincia);
        tr.appendChild(tdEleccion);
        tr.appendChild(tdCuadros);
        tr.appendChild(tdDatos);

        // Agrega el tr a la tabla
        tablaResultados.appendChild(tr);

        sectorTitulos.style.display = displayOriginal.sectorTitulos;
        sectorContenidos.style.display = displayOriginal.sectorContenidos;

        console.log("Resultados obtenidos: ", data);
      } catch (error) {
        console.error(`Error en la solicitud: ${error.message}`);
        console.error(error);
      }
    }
  }
}

function actualizarMapa(distritoId) {
  const imagenMapa = document.createElement("div");
  const provinciaEncontrada = provincias.find(
    (provincia) => provincia.idDistrito == distritoId
  );
  console.log(provinciaEncontrada)

  if (provinciaEncontrada) {
    imagenMapa.innerHTML = `${provinciaEncontrada.svg}`;
    imagenMapa.style.width = "100px";
    return imagenMapa;
  } else {
    console.log(
      "No se encontró una provincia correspondiente al distrito seleccionado."
    );
    return document.createElement("div"); // Retorna vacío si no se encuentra la provincia
  }
}

function mostrarInformacionCuadros(
  mesasEscrutadas,
  electores,
  participacionSobreEscrutado
) {
  // Crear un contenedor div
  const contenedorCuadros = document.createElement("div");

  // Agregar la información al contenedor
  contenedorCuadros.innerHTML = `
    <p>Mesas Computadas: ${mesasEscrutadas}</p>
    <p>Electores: ${electores}</p>
    <p>Participación: ${participacionSobreEscrutado}%</p>
  `;

  return contenedorCuadros;
}

function crearYOrdenarAgrupaciones(valoresTotales) {
  // Ordenar las agrupaciones por la cantidad de votos (de mayor a menor)
  valoresTotales.sort((a, b) => b.votos - a.votos);

  // Crear el contenedor
  const contenedorAgrupaciones = document.createElement("div");
  contenedorAgrupaciones.id = "datosPorAgrupacion";
  contenedorAgrupaciones.style.overflowY = "auto"; 

  
  valoresTotales.forEach((agrupacion) => {
    let nombreAgrupacion = agrupacion.nombreAgrupacion;
    let votosPorcentaje = agrupacion.votosPorcentaje;
    let votos = agrupacion.votos;

    // Crear y configurar los elementos HTML
    const divAgrupacion = document.createElement("div");
    divAgrupacion.classList.add("datos-por-agrupacion");

    const pNombre = document.createElement("p");
    pNombre.style.fontWeight = "bold";
    pNombre.textContent = nombreAgrupacion;

    const divPorcentaje = document.createElement("div");
    const pPorcentaje = document.createElement("p");
    pPorcentaje.innerHTML = `${votosPorcentaje}% <br> (${votos} votos)`;

    // Construir la estructura del DOM
    divPorcentaje.appendChild(pPorcentaje);
    divAgrupacion.appendChild(pNombre);
    divAgrupacion.appendChild(divPorcentaje);

    // Agregar los elementos al contenedor
    contenedorAgrupaciones.appendChild(divAgrupacion);
  });

  return contenedorAgrupaciones;
}

function generarTitulo(anioEleccion, eleccionTipo) {
  document.getElementById(
    "texto-elecciones-chico"
  ).innerHTML = `Elecciones ${anioEleccion} | ${eleccionTipo}`;
}

function generarSubtitulo(
  anioEleccion,
  eleccionTipo,
  nombreCargo,
  nombreDistrito,
  nombreSeccion
) {
  document.getElementById(
    "texto-path-chico"
  ).innerHTML = `${anioEleccion} > ${eleccionTipo} > ${nombreCargo} > ${nombreDistrito} > ${nombreSeccion}`;
}