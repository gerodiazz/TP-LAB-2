const tipoEleccion = 1; // PASO
const tipoRecuento = 1; 

var cargosGlobal = [];
var distritosGlobal = [];
var seccionesGlobal = [];

const seleccionDeAño = document.getElementById("seleccion-año");
const seleccionDeCargo = document.getElementById("seleccion-cargo");
const seleccionDeDistrito = document.getElementById("seleccion-distrito");
const seleccionDeSeccion = document.getElementById("seleccion-seccion");
const seleccionDeSeccionProvincial = document.getElementById("hdSeccionProvincial");

var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";
var valoresTotalizadosPositivos = "";

var añoSeleccionado = "";

async function solicitarAñosApi() {
  try {
    // Solicitud a la URL
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }
    const años = await respuesta.json();
    return años; // Devuelve los datos de años
  } catch (error) {
    console.error("Error en solicitarAñosApi:", error);
    throw error; // Lanza el error
  }
}

solicitarAñosApi()  //llamo a la funcion de solicitarAñosApi
  .then((años) => {
    cargarAños(años);
  })
  .catch((error) => {
    console.error("Error:", error);
  });



function cargarAños(años) {
  seleccionDeAño.innerHTML = ""; // Limpio opciones anteriores

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "Año";
  opcionInicial.text = "Año";
  seleccionDeAño.appendChild(opcionInicial); // Genero un primer valor vacio

  años.forEach((año) => {
    const opcionAño = document.createElement("option");
    opcionAño.value = año;
    opcionAño.text = año;
    seleccionDeAño.appendChild(opcionAño);
  });
}




function seleccionAño(event) {
  añoSeleccionado = event.target.value; // Asigno el elemento del evento

  //reestablezco los valores de los otros combos cuando elijo otro año
  seleccionDeCargo.value = "Cargo";
  seleccionDeDistrito.value = "Distrito";
  seleccionDeSeccion.value = "Sección";

  // Verifico que no es nulo
  if (añoSeleccionado != "Año" && añoSeleccionado) {
    
    solicitarCargos(añoSeleccionado); //Llamo a solicitarCargos con el año seleccionado
  }
}

async function solicitarCargos(valorAño) {
  try {
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + valorAño);
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await respuesta.json(); // Almaceno en data
    console.log(data, "esto es data");

    const eleccion = data.find((elemento) => elemento.IdEleccion === tipoEleccion); // Encuentro el tipo de elección (PASO)
    
    
    console.log("Año eleccion:", eleccion.Año, "Tipo eleccion: (1-PASO 2-GENERAL) -->", eleccion.IdEleccion);

    cargarCargos(eleccion.Cargos);

    cargosGlobal = eleccion.Cargos; // Almaceno los cargos en variable global
  } catch (error) {
    console.error("Error en solicitarCargos:", error);
  }
}

function cargarCargos(cargos) {
  seleccionDeCargo.innerHTML = "";

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "Cargo";
  opcionInicial.text = "Cargo";
  seleccionDeCargo.appendChild(opcionInicial); // Genero un primer valor vacio

  cargos.forEach((cargo) => {
    const opcionCargo = document.createElement("option");
    opcionCargo.value = cargo.IdCargo;
    opcionCargo.text = cargo.Cargo;
    seleccionDeCargo.appendChild(opcionCargo);
  });
}

function seleccionCargo(event) {
  // Obtiene el cargo seleccionado para mostrar los distritos disponibles
  const idCargo = event.target.value; // Asigno el valor del elemento (select) que generó ese evento
  seleccionDeDistrito.value = "Distrito";
  seleccionDeSeccion.value = "Sección";

  if (idCargo != "Cargo" && idCargo) {
    // Busco en el array global de CARGOS el ID del cargo seleccionado y lo almaceno en una constante.
    const cargoSeleccionado = cargosGlobal.find((cargo) => cargo.IdCargo === idCargo);
  

  console.log("ID Cargo seleccionado:", cargoSeleccionado.IdCargo, "Nombre cargo seleccionado:", cargoSeleccionado.Cargo);

    distritosGlobal = cargoSeleccionado.Distritos; // Variable global con los distritos disponibles del cargo seleccionado
    mostrarDistritos(distritosGlobal);
  }
}

function mostrarDistritos(distritos) {
  seleccionDeDistrito.innerHTML = "";

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "Distrito";
  opcionInicial.text = "Distrito";
  seleccionDeDistrito.appendChild(opcionInicial); // Genero un primer valor vacio

  distritos.forEach((distrito) => {
    const opcionDistrito = document.createElement("option");
    opcionDistrito.value = distrito.IdDistrito;
    opcionDistrito.text = distrito.Distrito;
    seleccionDeDistrito.appendChild(opcionDistrito);
  });
}

var distritoSeleccionado = "";

function distritoElegido(event) {
  const idDistrito = Number(event.target.value);
  seleccionDeSeccion.value = "Sección";

  if (idDistrito != "Distrito" && idDistrito) {
    distritoSeleccionado = distritosGlobal.find((distrito) => {
      return distrito.IdDistrito === idDistrito;
    });

    console.log(
      "ID Distrito seleccionado:",
      distritoSeleccionado.IdDistrito,
      "Nombre distrito seleccionado:",
      distritoSeleccionado.Distrito
    );

    seccionesGlobal = distritoSeleccionado.SeccionesProvinciales; // Almaceno las secciones provinciales

    const seccionesAMostrar = seccionesGlobal.map((seccion) => {
        return seccion.Secciones;
      }).flat(); // Transformo el array en unidimensional con las secciones.

    // console.log("Secciones provinciales: ", seccionesAMostrar);

    mostrarSecciones(seccionesAMostrar);
  }
}

function mostrarSecciones(secciones) {
  seleccionDeSeccion.innerHTML = ""; // Limpio opciones anteriores

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "Sección";
  opcionInicial.text = "Sección";
  seleccionDeSeccion.appendChild(opcionInicial);

  secciones.forEach((seccion) => {
    const opcionSeccion = document.createElement("option");
    opcionSeccion.value = seccion.IdSeccion;
    opcionSeccion.text = seccion.Seccion;
    seleccionDeSeccion.appendChild(opcionSeccion);
  }); // Recorro el array y creo options por cada elemento del mismo
}

function obtenerSeccion(event) {
  // Obtiene la seccion seleccionada
  const idSeccion = Number(event.target.value);

  const seccionSeleccionada = seccionesGlobal.find(
    (seccion) => seccion.IdSeccion === idSeccion
  ); // Busco y almaceno el ID de la seccion que elegi

  const idSeccionProvincial = seccionesGlobal.find((secProv) => {
    const existeSeccion = secProv.Secciones.some(
      (seccion) => seccion.IdSeccion === idSeccion
    );
    return existeSeccion;
  }).IDSeccionProvincial;
  // Busco en seccionesGlobal si hay un elemento cuyo ID sea igual al seleccionado.
  // Almaceno el valor de su propiedad IDSeccionProvincial en la constante
  console.log("El ID de la seccion es:", idSeccion);
  console.log("El ID de la seccion provincial es:", idSeccionProvincial);

  seleccionDeSeccionProvincial.value = idSeccionProvincial; // Asigno el valor (el ID de la seccion provincial)
}

async function filtrarDatos() {
  // Obtener los valores de los campos de selección
  var anioEleccion = document.getElementById("seleccion-año").value;
  var categoriaId = 2;
  var distritoId = document.getElementById("seleccion-distrito").value;
  var seccionId = document.getElementById("seleccion-seccion").value;
  var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
  var circuitoId = "";
  var mesaId = "";

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

  

  // nueva URL con los valores de los campos obtenidos
  let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await respuesta.json();
    

    // Obtengo datos para cuadros
    mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
    electores = data.estadoRecuento.cantidadElectores;
    participacionSobreEscrutado = data.estadoRecuento.participacionPorcentaje;
    valoresTotalizadosPositivos = data.valoresTotalizadosPositivos;

    console.log(
      "Mesas totalizadas:",
      mesasEscrutadas,
      "Electores:",
      electores,
      "Participacion sobre escrutado:",
      participacionSobreEscrutado
    );

    // Si la respuesta fue correcta, imprimir en la consola
    console.log("Resultados obtenidos: ", data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

const botonFiltrar = document.getElementById("boton-filtrar");
const mensajeExito = document.getElementById("mensaje-exito");
const mensajeError = document.getElementById("mensaje-error");
const mensajeIncompleto = document.getElementById("mensaje-incompleto");

//oculto elementos (mensajes)
mensajeExito.style.display = "none";
mensajeError.style.display = "none";
mensajeIncompleto.style.display = "none";

const sectorTitulos = document.getElementById("sector-titulos");
const agregarInforme = document.getElementById("agregar-informe-boton");
const cartasPrincipales = document.getElementById("main-cards");
const agrupacionesContainer = document.getElementById("agrupaciones-container");
const mapa = document.getElementById("mapa");
const chartWrap = document.getElementById("chart-wrap");

// Almaceno los displays originales de cada elemento antes de ocultarlos
const displayOriginal = {
  sectorTitulos: sectorTitulos.style.display,
  agregarInforme: agregarInforme.style.display,
  cartasPrincipales: cartasPrincipales.style.display,
  agrupacionesContainer: agrupacionesContainer.style.display,
  mapa: mapa.style.display,
  chartWrap: chartWrap.style.display,
};

//oculto los elementos
sectorTitulos.style.display = "none";
agregarInforme.style.display = "none";
cartasPrincipales.style.display = "none";
agrupacionesContainer.style.display = "none";
mapa.style.display = "none";
chartWrap.style.display = "none";

var mensajeInicioFiltrar = document.getElementById("mensaje-inicio");
mensajeInicioFiltrar.textContent = "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR";
mensajeInicioFiltrar.style.marginTop = "50px";
mensajeInicioFiltrar.style.marginBottom = "50px";

function volverVisiblesElementos() {
  mensajeInicioFiltrar.style.display = "none";
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  agregarInforme.style.display = displayOriginal.agregarInforme;
  cartasPrincipales.style.display = displayOriginal.cartasPrincipales;
  agrupacionesContainer.style.display = displayOriginal.agrupacionesContainer;
  mapa.style.display = displayOriginal.mapa;
  chartWrap.style.display = displayOriginal.chartWrap;
}

botonFiltrar.addEventListener("click", async function () {
  mostrarMensajeDeCarga();

  try {
    // Llamar a filtrarDatos de manera asíncrona
    await filtrarDatos();

    setTimeout(function () {
      if (mesasEscrutadas !== 0 && validarFiltros()) {
        realizarFiltrado();
        // Oculta el mensaje de carga cuando la operación está completa
        ocultarMensajeDeCarga();
      } else if (mesasEscrutadas === 0 && validarFiltros()) {
        actualizarInformacionTituloYSubtitulo();
        mostrarError("No se encontró información para la consulta realizada", "#ffc107");

        agregarInforme.style.display = "none";
        cartasPrincipales.style.display = "none";
        agrupacionesContainer.style.display = "none";
        mapa.style.display = "none";
        chartWrap.style.display = "none";
      } else {
        actualizarInformacionTituloYSubtitulo();
        mostrarError("Error: Los filtros no son válidos", "red");

        agregarInforme.style.display = "none";
        cartasPrincipales.style.display = "none";
        agrupacionesContainer.style.display = "none";
        mapa.style.display = "none";
        chartWrap.style.display = "none";
      }
    }, 2000); // se espera un tiempo de 2 segundos
  } catch (error) {
    console.error("Error en la función filtrarDatos:", error);
    mostrarError("Error en la operación", "#dc3545");
  }
});


function mostrarMensajeDeCarga() {
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  mensajeInicioFiltrar.style.display = "block";
  mensajeInicioFiltrar.style.backgroundColor = `var(--gris-claro)`;
  mensajeInicioFiltrar.innerHTML = `<i class="fa-solid fa-spinner"></i>Su operación esta siendo procesada`;
}

function realizarFiltrado() {
  actualizarInformacionTituloYSubtitulo();
  volverVisiblesElementos();
  mostrarInformacionCuadros();
  actualizarMapa();
  agrupacionesPoliticas();
  resumenVotos();
}




function ocultarMensajeDeCarga() {
  mensajeInicioFiltrar.style.display = "none";
}





function validarFiltros() {
  return (
    seleccionDeAño.value !== "Año" &&
    seleccionDeCargo.value !== "Cargo" &&
    seleccionDeDistrito.value !== "Distrito" &&
    seleccionDeSeccion.value !== "Sección"
  );
}

function mostrarError(mensaje, colorFondo) {
  sectorTitulos.style.display = displayOriginal.sectorTitulos;
  mensajeInicioFiltrar.style.display = "block";
  mensajeInicioFiltrar.innerHTML = mensaje;
  mensajeInicioFiltrar.style.backgroundColor = colorFondo;
}



function actualizarInformacionTituloYSubtitulo() {
  let tipoEleccion = "PASO";
  let selectAnioValue = seleccionDeAño.value;
  let selectCargoValue = seleccionDeCargo.options[seleccionDeCargo.selectedIndex].text;
  let selectDistritoValue = seleccionDeDistrito.options[seleccionDeDistrito.selectedIndex].text;
  let selectSeccionValue = seleccionDeSeccion.options[seleccionDeSeccion.selectedIndex].text;

  // se actualizan los elementos con el titulo y subtitulo
  document.getElementById("titulo-principal").textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
  document.getElementById("subtitulo").textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
}

function mostrarInformacionCuadros() {
  // Actualizar elementos con la información
  document.getElementById("mesas-escrutadas-porcentaje").innerHTML = mesasEscrutadas;
  document.getElementById("electores-porcentaje").innerHTML = electores;
  document.getElementById("participacion-porcentaje").innerHTML = participacionSobreEscrutado + "%";
}

function actualizarMapa() {
  let imagenMapa = document.getElementById("mapa");

  const provinciaEncontrada = provincias.find(
    (provincia) => provincia.idDistrito === distritoSeleccionado.IdDistrito
  );

  if (provinciaEncontrada) {
    imagenMapa.innerHTML = `<h3>${provinciaEncontrada.provincia}</h3> ${provinciaEncontrada.svg}`;
  } else {
    console.log(
      "No se encontró una provincia correspondiente al distrito seleccionado."
    );
  }
}


let agrupacionesYColores = {}; //objeto para almacenar las agrupaciones y sus colores

const coloresAgrupaciones = {
  0: { colorPleno: "var(--grafica-amarillo)", colorLiviano: "var(--grafica-amarillo-claro)" },
  1: { colorPleno: "var(--grafica-celeste)", colorLiviano: "var(--grafica-celeste-claro)" },
  2: { colorPleno: "var(--grafica-lila)", colorLiviano: "var(--grafica-lila-claro)" },
  3: { colorPleno: "var(--grafica-bordo)", colorLiviano: "var(--grafica-bordo-claro)" },
  4: { colorPleno: "var(--grafica-verde)", colorLiviano: "var(--grafica-verde-claro)" },
  5: { colorPleno: "var(--grafica-anaranjado)", colorLiviano: "var(--grafica-anaranjado-claro)" },
  6: { colorPleno: "var(--grafica-rojo)", colorLiviano: "var(--grafica-rojo-claro)" },
  7: { colorPleno: "var(--grafica-violeta)", colorLiviano: "var(--grafica-violeta-claro)" },
  8: { colorPleno: "var(--grafica-azul-fuerte)", colorLiviano: "var(--grafica-azul)" },
  9: { colorPleno: "var(--grafica-gris)", colorLiviano: "var(--grafica-gris-claro)",}
};


async function agrupacionesPoliticas() {
  var i = 0
  var contenedor = document.getElementById("contenedor-barras");
  contenedor.innerHTML = ""
  valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);
  valoresTotalizadosPositivos.forEach(valores => {

      var nombreAgrup = valores.nombreAgrupacion
      var votosTotales = valores.votos
      var barra = document.createElement("div")
      barra.innerHTML = `<h3>${nombreAgrup}</h3>`
      contenedor.appendChild(barra)

      valores.listas.forEach(lista => {

          var nombre = lista.nombre
          var cantVotos = lista.votos
          var porcentajeVotos = cantVotos * 100 / votosTotales
          porcentajeVotos = porcentajeVotos.toFixed(2)
          barra.innerHTML = barra.innerHTML + `
              <h5>${nombre}</h5>
              <p>${porcentajeVotos}%</p>
              <p>${cantVotos} VOTOS</p>
            <div class="progress" style="background: ${coloresAgrupaciones[i]?.colorLiviano || coloresAgrupaciones[9]?.colorLiviano}; ">
              <div class="progress-bar" style="width:${porcentajeVotos}%; background: ${coloresAgrupaciones[i]?.colorPleno || coloresAgrupaciones[9]?.colorPleno || "black"};" >
                  <span class="progress-bar-text">${porcentajeVotos}%</span>
              </div>
            </div>`
          contenedor.appendChild(barra)
          i += 1
      })
  })
}



async function resumenVotos(){
  cont = document.getElementById("grid-votos")
  cont.innerHTML = "";
  var i = 0;
  valoresTotalizadosPositivos.forEach(valores =>{
      if (i < 8){
      var nombre = valores.nombreAgrupacion;
      var votosPorcentaje = valores.votosPorcentaje;
      cont.innerHTML = cont.innerHTML + `<div class="bar" id=${nombre} data-name="${nombre}" title="${nombre} ${votosPorcentaje}%" style="--bar-value:${votosPorcentaje}%; background-color:${coloresAgrupaciones[i].colorPleno};"></div>`
      i += 1;
      
      }
  })
}



//cuando se agrega un informe
const agregarAInformesBoton = document.getElementById("agregar-informe-boton");

agregarAInformesBoton.addEventListener("click", function () {
  let vAnio = seleccionDeAño.value;
  let vTipoRecuento = tipoRecuento;
  let vTipoEleccion = tipoEleccion;
  let vCategoriaId = seleccionDeCargo.value;
  let vDistrito = seleccionDeDistrito.value;
  let vSeccionProvincial = `${seleccionDeSeccionProvincial.value},`;
  let vSeccionID = seleccionDeSeccion.value;
  let nombreCargo = seleccionDeCargo.options[seleccionDeCargo.selectedIndex].text;
  let nombreDistrito = seleccionDeDistrito.options[seleccionDeDistrito.selectedIndex].text;
  let nombreSeccion = seleccionDeSeccion.options[seleccionDeSeccion.selectedIndex].text;

  // Cadena con los valores
  const nuevoRegistro = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${vSeccionID}|${nombreCargo}|${nombreDistrito}|${nombreSeccion}`;

  // Obtiene los registros existentes del localStorage (si los hay)
  const informesExistenteJSON = localStorage.getItem("INFORMES"); //JSON almacenado en el localStorage con clave INFORMES
  let informesExistente = [];

  if (informesExistenteJSON) {
    try {
      informesExistente = JSON.parse(informesExistenteJSON); //convierte la cadena JSON del localStorage a un array
    } catch (error) {
      // Mostrar un mensaje de error
      console.error("Error al analizar JSON:", error);
      mensajeError.style.display = "block";
      setTimeout(() => {
        mensajeError.style.display = "none";
      }, 5000);
    }
  }

  // Verifica si el nuevo registro ya existe
  if (informesExistente.includes(nuevoRegistro)) {
    mensajeIncompleto.style.display = "block";
    setTimeout(() => {
      mensajeIncompleto.style.display = "none";
    }, 5000);
  } else {
    // Agrega el nuevo registro al array
    informesExistente.push(nuevoRegistro);

    // DEVUELVE EL REGISTRO AL LOCALSTORAGE EN FORMATO DE CADENA JSON
    localStorage.setItem("INFORMES", JSON.stringify(informesExistente));
    mensajeExito.style.display = "block";
    setTimeout(() => {
      mensajeExito.style.display = "none";
    }, 5000);
  }
});



