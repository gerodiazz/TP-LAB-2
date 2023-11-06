const tipoEleccion = 1; 
const tipoRecuento = 1; 


var cargosGlobal = [];
var distritosGlobal = [];
var seccionesGlobal = [];
const valorDistritoVacio = "Distrito";

async function solicitarAñosApi() {
  try {
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
    if (!respuesta.ok) {
      throw new Error("Hubo un error para obtener los datos");
    }
    const años = await respuesta.json();
    return años; 
  } 
  catch (error) {
    console.error("Ocurrió un error al obtener los datos:", error);
    throw error;
  }
}

//ejecutando la funcion solicitarAñosApi
solicitarAñosApi()
  .then((años) => {
    cargarAños(años);
    console.log(años);
  })
  .catch((error) => {
    console.error("Error:", error);
  });


function cargarAños(años) {
  const elementoAño = document.getElementById("select-año");
  elementoAño.innerHTML = '<option value="0">Año</option>';
  
  años.forEach(año => {
    const opcion = document.createElement('option');
    opcion.value = año;
    opcion.textContent = año;
    elementoAño.appendChild(opcion);
  });
}





function añoElegido(event) {
  var añoSeleccionado = event.target.value;

  if (añoSeleccionado != 0) {
    // Verifico que no es nulo
    solicitarCargosApi(añoSeleccionado); //Llamo a solicitarCargosApi con el año seleccionado
  }
}

async function solicitarCargosApi(valorAño) {
  try {
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + valorAño);
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await respuesta.json(); // Almaceno en data
    console.log(data);

    const eleccion = data.find(
      (elemento) => elemento.IdEleccion === tipoEleccion
    ); // Encuentro el tipo de elección (PASO)

    console.log(
      "Año eleccion:",
      eleccion.Año,
      "Tipo eleccion: (1-PASO 2-GENERAL)",
      eleccion.IdEleccion 
    );

    cargarCargos(eleccion.Cargos);

    cargosGlobal = eleccion.Cargos; // Almaceno los cargos en variable global
  } 
  catch (error) {
    console.error("Error en solicitarCargosApi:", error);
  }
}

function cargarCargos(cargos) {
  let selectElement = document.getElementById("select-cargo");
  let primerValor = '<option value="0">Cargo</option>';

  const cargosDisponibles = [
    primerValor,
    ...cargos.map((cargo) => {
      return `<option value="${cargo.IdCargo}">${cargo.Cargo}</option>`;
    }),
  ]; // Devuelvo un nuevo array

  selectElement.innerHTML = cargosDisponibles;
}

function cargoElegido(event) {
  // Obtiene el cargo seleccionado para mostrar los distritos disponibles
  const idCargo = event.target.value;

  if (idCargo != 0 && idCargo) {
    const cargoSeleccionado = cargosGlobal.find(
      // Busco en el array global el ID del cargo seleccionado, lo almaceno en nueva constante.
      (cargo) => cargo.IdCargo === idCargo
    );

    console.log(
      "ID Cargo seleccionado:",
      cargoSeleccionado.IdCargo,
      "Nombre cargo seleccionado:",
      cargoSeleccionado.Cargo
    );

    distritosGlobal = cargoSeleccionado.Distritos; 

    mostrarDistritos(distritosGlobal);
  }
}

function mostrarDistritos(distritos) {
  let selectElement = document.getElementById("select-distrito");
  selectElement.innerHTML = null; // Limpio opciones anteriores

  const placeHolderVacio = document.createElement("option");
  placeHolderVacio.value = valorDistritoVacio;
  placeHolderVacio.text = "Distrito";
  selectElement.appendChild(placeHolderVacio);

  distritos.forEach((distrito) => {
    const opcionDistrito = document.createElement("option");
    opcionDistrito.value = distrito.IdDistrito;
    opcionDistrito.text = distrito.Distrito;
    selectElement.appendChild(opcionDistrito);
  });
}

function distritoElegido(event) {
  const idDistrito = Number(event.target.value);

  if (idDistrito != valorDistritoVacio && idDistrito) {
    const distritoSeleccionado = distritosGlobal.find((distrito) => {
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
        return seccion.Secciones;}).flat(); // Transformo el array en unidimensional con las secciones.

    // console.log("Secciones provinciales: ", seccionesAMostrar);

    mostrarSecciones(seccionesAMostrar);
  }
}


function mostrarSecciones(secciones) {
  let selectElement = document.getElementById("select-seccion");
  selectElement.innerHTML = null; // Limpio opciones anteriores

  const placeHolderOption = document.createElement("option");
  placeHolderOption.value = "Sección vacia";
  placeHolderOption.text = "Sección";
  selectElement.appendChild(placeHolderOption);

  secciones.forEach((seccion) => {
    const opcionSeccion = document.createElement("option");
    opcionSeccion.value = seccion.IdSeccion;
    opcionSeccion.text = seccion.Seccion;
    selectElement.appendChild(opcionSeccion);
  }); // Recorro el array y creo select para cada elemento del mismo
}

function seccionElegida(event) {
  // Obtiene la seccion seleccionada
  const idSeccion = Number(event.target.value); //el Number castea a un entero el valor de event.target.value

  const seccionSeleccionada = seccionesGlobal.find(
    (seccion) => seccion.IdSeccion === idSeccion
  ); // Busco y almaceno el ID de la seccion que elegi

  const idSeccionProvincial = seccionesGlobal.find((secProv) => {
    const existeSeccion = secProv.Secciones.some(
      (seccion) => seccion.IdSeccion === idSeccion // ARREGLO
    );
    return existeSeccion;
  }).IDSeccionProvincial;
  // Busco en seccionesGlobal si hay un elemento cuyo ID sea igual al seleccionado.
  // Almaceno el valor de su propiedad IDSeccionProvincial en la constante

  console.log("El ID de la seccion provincial es:", idSeccionProvincial);

  let selectElement = document.getElementById("hdSeccionProvincial");
  selectElement.value = idSeccionProvincial; // Asigno el valor
}



var botonFiltrar = document.getElementById("filtrar");
botonFiltrar.addEventListener("click", filtrarDatos);

var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";


//funcion de filtrarDatos
async function filtrarDatos() {
  // boton que filtra los datos
  var anioEleccion = document.getElementById("select-año").value;
  var categoriaId = 2;
  var distritoId = document.getElementById("select-distrito").value;
  var seccionProvincialId = document.getElementById(
    "hdSeccionProvincial"
  ).value;
  var seccionId = document.getElementById("select-seccion").value;
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

  // https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=2019&tipoRecuento=1&tipoEleccion=2&categoriaId=2

  // Construir la URL con los valores de los campos
  var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await respuesta.json();

    mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
    electores = data.estadoRecuento.cantidadElectores;
    participacionSobreEscrutado = data.estadoRecuento.participacionPorcentaje;

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
    // Mostrar un mensaje de error en rojo con el detalle del error
    mostrarResultadosDeDatos(`Error: ${error.message}`);
  }
}





botonFiltrar.addEventListener("click", function () {
  // Llama a la función para actualizar el título y el subtítulo
  actualizarTituloYSubtitulo();
});

var selectAnio = document.getElementById("select-año");
var selectCargo = document.getElementById("select-cargo");
var selectDistrito = document.getElementById("select-distrito");
var selectSeccion = document.getElementById("select-seccion");



function actualizarTituloYSubtitulo() {
  var tipoEleccion = "PASO";
  var selectAnioValue = selectAnio.value;
  var selectCargoValue = selectCargo.options[selectCargo.selectedIndex].text;
  var selectDistritoValue = selectDistrito.options[selectDistrito.selectedIndex].text;
  var selectSeccionValue = selectSeccion.options[selectSeccion.selectedIndex].text;

  // Actualizar los elementos con el título y subtítulo
  document.getElementById("titulo-elecciones").textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
  document.getElementById("subtitulo-eleccion").textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
}





/*agarrando todos los elementos qeu deben ocultarse*/
var textoNegro = document.getElementById("titulo-elecciones");
var textoCeleste = document.getElementById("subtitulo-eleccion");
var msjColores = document.getElementById("seccion-mensajes-color");
var btnAgregarInformes = document.getElementById("boton-agregar-informe");
var recuadros = document.getElementById("tres-recuadros");
var seccionColores = document.getElementById("seccion-cuad-colores");


/*display original de los elementos*/
var objetoDisplays = {
  textoNegro: textoNegro.style.display,
  textoCeleste: textoCeleste.style.display,
  msjColores: msjColores.style.display,
  btnAgregarInformes: btnAgregarInformes.style.display,
  recuadros: recuadros.style.display,
  seccionColores: seccionColores.style.display
};
 


/*ocultando elementos*/
textoNegro.style.display = "none";
textoCeleste.style.display = "none";
msjColores.style.display = "none";
btnAgregarInformes.style.display = "none";
seccionColores.style.display = "none";
recuadros.style.display = "none";


/*funcion para volver visible los elementos*/
function volverVisibleElementos() {
  textoNegro.style.display = objetoDisplays.textoNegro;
  textoCeleste.style.display = objetoDisplays.textoCeleste;
  msjColores.style.display = objetoDisplays.msjColores;
  btnAgregarInformes.style.display = objetoDisplays.btnAgregarInformes;
  recuadros.style.display = objetoDisplays.recuadros;
  seccionColores.style.display = objetoDisplays.seccionColores;
 
};


/*funcion para validar los campos*/
var añoSelected = document.getElementById("select-año");
var cargoSelected = document.getElementById("select-cargo");
var distritoSelected = document.getElementById("select-distrito");
var seccionSelected = document.getElementById("select-seccion");


function validacionCampos() {
  return (añoSelected.value == "Año" &&
  cargoSelected.value == "Cargo" &&
  distritoSelected.value == "Distrito" &&
  seccionSelected.value == "Sección")
}





botonFiltrar.addEventListener("click", async function () {
  mensajeCargaDeDatos();
  try {
    // Llamar a filtrarDatos de manera asíncrona
    await filtrarDatos();
      
    setTimeout(function () {
    if (mesasEscrutadas !== "" && validacionCampos()) {
        realizarFiltrado();
        ocultarMensajeDeCarga();
      } 
      else if (mesasEscrutadas === "" && validacionCampos()) {
        actualizarTituloYSubtitulo();
        mostrarResultadosDeDatos(
          "No se encontró información para la consulta realizada",
          "yellow"
        );
      } else {
        actualizarTituloYSubtitulo();
        mostrarResultadosDeDatos("Error: Los filtros no son válidos", "red");
      }
      
      
    }, 1000) 
    
  } catch (error) {
    // Manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario.
    console.error("Error en la función filtrarDatos:", error);
    mostrarResultadosDeDatos("Error en la operación", "red");
    ocultarMensajeDeCarga();
  }
});


function realizarFiltrado() {
  filtrarDatos();
  actualizarTituloYSubtitulo();
  volverVisibleElementos();

}




function mostrarResultadosDeDatos(mensaje, colorFondo) {
  textoNegro.style.display = objetoDisplays.textoNegro;
  textoCeleste.style.display = objetoDisplays.textoCeleste;
  let msjInicio = document.getElementById("titulo-mensaje");
  msjInicio.textContent = mensaje;
  msjInicio.style.backgroundColor = colorFondo;
  msjInicio.style.fontWeight = "bold"
  msjInicio.style.textAlign = "center";
}




function mensajeCargaDeDatos() {
  let msjInicio = document.getElementById("titulo-mensaje");
  msjInicio.style.backgroundColor = "grey";
  msjInicio.innerHTML = "La operacion se esta gestionando";
  msjInicio.style.fontWeight = "bold"
  msjInicio.style.textAlign = "center";
}

function ocultarMensajeDeCarga() {
  let msjInicio = document.getElementById("titulo-mensaje");
  msjInicio.style.display = "none";
}



function visualizarInformacionCuadros() {
  let cuadradoMesaEscrutada = document.getElementById("urna-mesas-escrutadas");
  let cuadradoElectores = document.getElementById("tipitos-electores");
  let cuadradoEscrutados = document.getElementById("escrutadas");
  
  cuadradoMesaEscrutada.innerHTML = mesasEscrutadas;
  cuadradoElectores.innerHTML = electores;
  cuadradoEscrutados.innerHTML = participacionSobreEscrutado;

}




