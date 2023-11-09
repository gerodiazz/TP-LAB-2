const tipoEleccion = 1; 
const tipoRecuento = 1; 



var arregloDeCargos = [];
var arregloDeDistritos = [];
var arregloDeSecciones = [];
const vDistritoVacio = "Distrito";

var contenedorAgrupacionesPoliticas = document.getElementById("tres-recuadros");

//agarrando los elementos con su ID
var selectAnio = document.getElementById("select-año");
var selectCargo = document.getElementById("select-cargo");
var selectDistrito = document.getElementById("select-distrito");
var selectSeccion = document.getElementById("select-seccion");
var seccionProvincial = document.getElementById("hdSeccionProvincial");

//consultamos en la API todos los períodos disponibles
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
  .then((años) => { //si la promesa se resuelve se ejecuta el .then y se pasa el arreglo devuelto a cargarAños
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
    solicitarCargosApi(añoSeleccionado); //Llamo a solicitarCargosApi con el año seleccionado
  }
}

async function solicitarCargosApi(vanio) {
  try {
    const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + vanio);
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    const datos = await respuesta.json(); 
    console.log(datos);
    

    //buscando la coincidencia con el tipo de elección que estamos consultando
    let eleccion = null;
    for (let i = 0; i < datos.length; i++) {
      const registro = datos[i];
      if (registro.IdEleccion === tipoEleccion) {
        eleccion = registro;
        break; 
      }
    }

    console.log("Año eleccion:", eleccion.Año, "Tipo eleccion: (1-Paso 2-General)", eleccion.IdEleccion);

    cargarCargos(eleccion.Cargos);

    arregloDeCargos = eleccion.Cargos; // Almaceno los cargos en variable global
  } 
  catch (error) {
    console.error("Error en solicitarCargosApi:", error);
  }
}

function cargarCargos(cargos) {
  let elementoSelect = document.getElementById("select-cargo");
  let primerValor = '<option value="0">Cargo</option>';
  let opciones = [primerValor];

  for (let i = 0; i < cargos.length; i++) {
    const cargo = cargos[i];
    const opcion = `<option value="${cargo.IdCargo}">${cargo.Cargo}</option>`;
    opciones.push(opcion);
  }

  elementoSelect.innerHTML = opciones;
}

function cargoElegido(event) {
  const idCargo = event.target.value; // obtengo el cargo seleccionado para mostrar los distritos disponibles

  if (idCargo != 0 && idCargo) {
    const cargoSeleccionado = arregloDeCargos.find(function(cargo) {
      return cargo.IdCargo === idCargo;
    });

    console.log("ID Cargo seleccionado:",cargoSeleccionado);

    arregloDeDistritos = cargoSeleccionado.Distritos; 

    mostrarDistritos(arregloDeDistritos);
  }
}

function mostrarDistritos(distritos) {
  let elementoSelect = document.getElementById("select-distrito");
  elementoSelect.innerHTML = null; // Limpio opciones anteriores

  const opcionVacia = document.createElement("option");
  opcionVacia.value = vDistritoVacio;
  opcionVacia.text = "Distrito";
  elementoSelect.appendChild(opcionVacia);

  distritos.forEach((distrito) => {
    const opcionDistrito = document.createElement("option");
    opcionDistrito.value = distrito.IdDistrito;
    opcionDistrito.text = distrito.Distrito;
    elementoSelect.appendChild(opcionDistrito);
  });
}

function distritoElegido(event) {
  const idDistrito = Number(event.target.value);

  if (idDistrito != vDistritoVacio && idDistrito) {
    const distritoSeleccionado = arregloDeDistritos.find((distrito) => {
      return distrito.IdDistrito === idDistrito;
    });

    console.log(
      "ID Distrito seleccionado:",
      distritoSeleccionado.IdDistrito,
      "Nombre distrito seleccionado:",
      distritoSeleccionado.Distrito
    );

    arregloDeSecciones = distritoSeleccionado.SeccionesProvinciales; // Almaceno las secciones provinciales

    const seccionesAMostrar = arregloDeSecciones.map((seccion) => {
        return seccion.Secciones;}).flat(); // Transformo el array en unidimensional con las secciones.

    // console.log("Secciones provinciales: ", seccionesAMostrar);

    mostrarSecciones(seccionesAMostrar);
  }
}


function mostrarSecciones(secciones) {
  let elementoSelect = document.getElementById("select-seccion");
  elementoSelect.innerHTML = null; // Limpio opciones anteriores

  const etiquetaOption = document.createElement("option");
  etiquetaOption.value = "Sección vacia";
  etiquetaOption.text = "Sección";
  elementoSelect.appendChild(etiquetaOption);

  secciones.forEach((seccion) => {
    const opcionSeccion = document.createElement("option");
    opcionSeccion.value = seccion.IdSeccion;
    opcionSeccion.text = seccion.Seccion;
    elementoSelect.appendChild(opcionSeccion);
  }); // Recorro el array y creo options para el select
}



function seccionElegida(event) {
  const idSeccion = Number(event.target.value);

  const seccionSeleccionada = arregloDeSecciones.find(
    (seccion) => seccion.IdSeccion === idSeccion
  ); // Busco y almaceno el ID de la seccion que elegi

  const idSeccionProvincial = arregloDeSecciones.find((secProv) => {
    const existeSeccion = secProv.Secciones.some(
      (seccion) => seccion.IdSeccion === idSeccion
    );
    return existeSeccion;
  }).IDSeccionProvincial;

  seccionProvincial.value = idSeccionProvincial;
  
  console.log(seccionSeleccionada, idSeccionProvincial);
}




var mesasEscrutadas = "";
var electores = "";
var participacionSobreEscrutado = "";

var botonFiltrar = document.getElementById("filtrar");
botonFiltrar.addEventListener("click", filtrarDatos);


//funcion de filtrarDatos

var datos; //en datos se va a almacenar el JSON
async function filtrarDatos() {
  // boton que filtra los datos
  var anioEleccion = document.getElementById("select-año").value;
  var categoriaId = 2;
  var distritoId = document.getElementById("select-distrito").value;
  var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
  var seccionId = document.getElementById("select-seccion").value;
  var circuitoId = "";
  var mesaId = "";

  console.log("Año:", anioEleccion, "Categoria:", categoriaId, "Tipo de elección:", tipoEleccion, "Tipo de recuento:", tipoRecuento, "ID Distrito:", distritoId, "ID Sección Provincial:", seccionProvincialId, "ID Sección:", seccionId);

  // reemplazando cada XXXX con el valor recuperado
  var nuevaUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

  try {
    const respuesta = await fetch(nuevaUrl);

    if (!respuesta.ok) {
      throw new Error("Error en la solicitud");
    }

    datos = await respuesta.json();

    mesasEscrutadas = datos.estadoRecuento.mesasTotalizadas;
    electores = datos.estadoRecuento.cantidadElectores;
    participacionSobreEscrutado = datos.estadoRecuento.participacionPorcentaje;

    console.log("Mesas totalizadas:", mesasEscrutadas, "Electores:", electores, "Participacion sobre escrutado:", participacionSobreEscrutado);

    
    console.log("Resultados obtenidos: ", datos);
  } catch (error) {
    // Mostrar un mensaje de error en rojo con el detalle del error
    mostrarResultadosDeDatos(`Error: ${error.message}`, "red");
  }
}



botonFiltrar.addEventListener("click", function () {
  actualizarTituloYSubtitulo(); // Llamo a la función para actualizar el titulo y subtitulo
});



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
var msjRojo = document.getElementById("mensaje-error");
var msjAmarillo = document.getElementById("mensaje-exclamacion");
var msjVerde = document.getElementById("mensaje-completado");



/*display original de los elementos*/
var objetoDisplays = {
  textoNegro: textoNegro.style.display,
  textoCeleste: textoCeleste.style.display,
  msjColores: msjColores.style.display,
  btnAgregarInformes: btnAgregarInformes.style.display,
  recuadros: recuadros.style.display,
  seccionColores: seccionColores.style.display,
  msjRojoUsuario: msjRojo.style.display,
  msjAmarilloUsuario: msjAmarillo.style.display,
  msjVerdeUsuario: msjVerde.style.display   
  
};
 


/*ocultando elementos*/
textoNegro.style.display = "none";
textoCeleste.style.display = "none";
msjColores.style.display = "none";
btnAgregarInformes.style.display = "none";
seccionColores.style.display = "none";
recuadros.style.display = "none";
msjRojo.style.display = "none";
msjAmarillo.style.display = "none";
msjVerde.style.display = "none";




/*funcion para volver visible los elementos*/
function volverVisibleElementos() {
  textoNegro.style.display = objetoDisplays.textoNegro;
  textoCeleste.style.display = objetoDisplays.textoCeleste;
  msjColores.style.display = objetoDisplays.msjColores;
  btnAgregarInformes.style.display = objetoDisplays.btnAgregarInformes;
  recuadros.style.display = objetoDisplays.recuadros;
  seccionColores.style.display = objetoDisplays.seccionColores;
 
};

//validando los campos
function validacionCampos() {
  return (selectAnio.value != 0 &&
  selectCargo.value != 0 &&
  selectDistrito.value != 0 &&
  selectSeccion.value != 0)
}




botonFiltrar.addEventListener("click", async function () {
  mensajeCargaDeDatos();

  try {
    // Llamar a filtrarDatos de manera asíncrona
    await filtrarDatos();

    if (mesasEscrutadas !== 0 && validacionCampos()) {
      realizarFiltrado();
      ocultarMensajeDeCarga();
    } 
    else if (mesasEscrutadas === 0 && validacionCampos()) {
      actualizarTituloYSubtitulo()
      mostrarResultadosDeDatos("No se encontró información para la consulta realizada", "#ffc107");
    } 
    else {
      actualizarTituloYSubtitulo();
      mostrarResultadosDeDatos("Error en la operacion", "#dc3545");
    }
  } 
  catch (error) {
    console.error("Error en la función filtrarDatos:", error);
    mostrarResultadosDeDatos("Error en la operación", "#dc3545");
    ocultarMensajeDeCarga();
  }
});


function realizarFiltrado() {
  actualizarTituloYSubtitulo();
  volverVisibleElementos();
  visualizarInfoCuadradoColores();
  actualizarMapa();
}


function actualizarMapa() {
  let imagenMapa = document.getElementById("mapas-svg");

  const provinciaEncontrada = provincias.find(
    (provincia) => provincia.idDistrito == selectDistrito.value
  );

  if (provinciaEncontrada) {
    imagenMapa.innerHTML = `
      <div style="margin: 0 auto; width: 50%; text-align: center;"> 
        <h3>${provinciaEncontrada.provincia}</h3>
        ${provinciaEncontrada.svg}
      </div>
    `;
  }
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



function visualizarInfoCuadradoColores() {
  let cuadradoMesaEscrutada = document.getElementById("porcentaje-urna");
  let cuadradoElectores = document.getElementById("porcentaje-electores");
  let cuadradoEscrutados = document.getElementById("porcentaje-escrutados");
  
  cuadradoMesaEscrutada.innerHTML = mesasEscrutadas;
  cuadradoElectores.innerHTML = electores;
  cuadradoEscrutados.innerHTML = participacionSobreEscrutado;
}

const botonAgregarInformes = document.getElementById("boton-agregar-informe");

botonAgregarInformes.addEventListener("click", function () {
  const vanio = selectAnio.value;
  const vTipoRecuento = tipoRecuento;
  const vTipoEleccion = tipoEleccion;
  const vCategoriaId = selectCargo.value;
  const vDistrito = selectDistrito.value;
  const vSeccionProvincial = seccionProvincial.value;
  const vSeccionId = selectSeccion.value;

  // Cadena con los valores
  const nuevoRegistro = `${vanio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${vSeccionId}`;

  // Obtiene los registros existentes del localStorage (si los hay)
  const informesExistenteJSON = localStorage.getItem("INFORMES");
  console.log(informesExistenteJSON);
  let informesExistentes = [];

  if (informesExistenteJSON) {
    try {
      informesExistentes = JSON.parse(informesExistenteJSON);
    } catch (error) {
      
      console.error("Error al analizar JSON:", error);
    }
  }

  // Verifica si el nuevo registro ya existe
  if (informesExistentes.includes(nuevoRegistro)) {
    msjAmarillo.style.display = "block";
    setTimeout(() => {
      msjAmarillo.style.display = "none";
    }, 5000);
  } else {
    // Agrega el nuevo registro al array
    informesExistentes.push(nuevoRegistro);

    // Almacena el array actualizado en el localStorage
    localStorage.setItem("INFORMES", JSON.stringify(informesExistentes));
    msjVerde.style.display = "block";
    setTimeout(() => {
      msjVerde.style.display = "none";
    }, 5000);
  }
});












