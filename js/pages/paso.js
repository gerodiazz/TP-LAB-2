const tipoEleccion = 1;
const tipoRecuento = 1;

// solicitud a la URL 
async function solicitarDatosApi() {
    try { 
        const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (!respuesta.ok) {
            throw new Error("Error en la solicitud");
        }
        const años = await respuesta.json();
        return años; 
    } catch (error) {
        console.error("Error en fetchDatos:", error);
        throw error; 
    }
}

function cargarAños(años) {
    var selectElement = document.getElementById("select-año");

    let selectHTML = '<option value="0">Año</option>';

    selectHTML += años.map(año => {
        return `<option value="${año}">${año}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

// Llamo a la funcion solicitarDatosApi
solicitarDatosApi()
    .then(años => {
        cargarAños(años);
    })
    .catch(error => {
        console.error("Error:", error);
    });



function seleccionAño() {
    var selectElement = document.getElementById("select-año");
    var selectedValue = selectElement.value;

    console.log(selectedValue);

    if (selectedValue && selectedValue != 0) { 
        solicitarCargos(selectedValue); 
    }
}



async function solicitarCargos(selectedValue) {
    console.log(tipoEleccion);
    try {
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectedValue);
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        var data = await response.json();  
        data = data[tipoEleccion] // accedo a los datos de PASO

        cargarCargos(data);

    } catch (error) {
        console.error("Error en fetchCargos:", error);
    }
}

var datosCargosYDistritos;


function cargarCargos(data) {
    var selectElement = document.getElementById("select-cargo");
    let selectHTML = '<option value="0">Cargo</option>';

    datosCargosYDistritos = data // cargo data en la variable global
    var cargosAMostrar = [] // array para llenar los cargos

    cargosAMostrar = data.Cargos.map((dato) => { // se devuelve el cargo en forma de array 
        return dato.Cargo;
    })
    console.log(cargosAMostrar)

    selectHTML += cargosAMostrar.map(cargo => {
        return `<option value="${cargo}">${cargo}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}


var arrayAñoMasCargo;

function cargoSeleccionado() {
    // Obtiene el cargo seleccionado para mostrar los distritos disponibles
    arrayAñoMasCargo = datosCargosYDistritos.Cargos;
    console.log(arrayAñoMasCargo);
    var selectElement = document.getElementById("select-cargo");
    var selectedValue = selectElement.value;

    console.log(selectedValue)
    if (selectedValue != 0 && selectedValue) {
        var arrayFiltrado = arrayAñoMasCargo.filter(obj => obj.Cargo === selectedValue);
        arrayAñoMasCargo = arrayFiltrado
        console.log(arrayAñoMasCargo)

        var arrayDistritos = arrayFiltrado[0].Distritos.map(obj => obj.Distrito);

        console.log(arrayDistritos);

        mostrarDistritos(arrayDistritos);

    }

}


function mostrarDistritos(arrayDistritos) {

    var selectElement = document.getElementById("select-distrito");

    let selectHTML = '<option value="0">Distrito</option>';

    selectHTML += arrayDistritos.map(distrito => {
        return `<option value="${distrito}">${distrito}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;

}

var seccionesAMostrar;

function distritoSeleccionado() {
    var selectElement = document.getElementById("select-distrito");
    var selectedValue = selectElement.value;
    console.log(selectedValue);

    console.log(arrayAñoMasCargo);

    seccionesAMostrar = arrayAñoMasCargo[0].Distritos.find(obj => obj.Distrito === selectedValue);

    if (seccionesAMostrar) {
        seccionesAMostrar = seccionesAMostrar.SeccionesProvinciales[0].Secciones;
    }

    mostrarSecciones(seccionesAMostrar);
}



function mostrarSecciones(seccionesAMostrar) {
    var selectElement = document.getElementById("select-seccion");

    let selectHTML = '<option value="0">Sección</option>';

    selectHTML += seccionesAMostrar.map(seccion => {
        return `<option value="${seccion.IdSeccion}">${seccion.Seccion}</option>`;
    }).join('');

    selectElement.innerHTML = selectHTML;
}

function seccionSeleccionada() {
    var selectElement = document.getElementById("select-seccion");
    var selectedValue = selectElement.value;
    console.log(selectedValue);


    if (selectedValue != 0 && selectedValue) {
        var distritoSeleccionado = arrayAñoMasCargo[0].Distritos.find(obj => obj.Distrito === selectedValue);

        if (distritoSeleccionado) {
            var seccionesFiltradas = distritoSeleccionado.SeccionesProvinciales[0].Secciones;
            mostrarSecciones(seccionesFiltradas);

            console.log(seccionesFiltradas);
        }
    }
}
async function registroDatos() {

    
    const anioEleccion = document.getElementById("select-año").value;
    const cargoElegido = document.getElementById("select-cargo").value;
    const distritoElegido = document.getElementById("select-distrito").value;
    const seccionElegida = document.getElementById("select-seccion").value;
    const tipoEleccion = "paso";
    const titulo = document.getElementById("titulo-elecciones");
    const subtitulo = document.getElementById("subtitulo-eleccion");
    const mesasEscrutadasDato = document.getElementById("urna-mesas-escrutadas");
    const electoresDato = document.getElementById("tipitos-electores");
    const participacionDato = document.getElementById("escrutadas");

    
    titulo.innerText = `Elecciones ${anioEleccion} | ${tipoEleccion}`;
    subtitulo.innerText = `${anioEleccion} > ${tipoEleccion} > ${cargoElegido} > ${distritoElegido} > ${seccionElegida}`;
    mesasEscrutadasDato.innerText = estadoRecuento.mesasTotalizadas;
    electoresDato.innerText = estadoRecuento.cantidadElectores;
    participacionDato.innerText = estadoRecuento.participacionPorcentaje;

}
async function filtrarDatos() {
    var selectAño = document.getElementById("select-año");
    var selectCargo = document.getElementById("select-cargo");
    var selectDistrito = document.getElementById("select-distrito");
    var selectSeccion = document.getElementById("select-seccion");

    var mensajeCompletado = document.getElementById("mensaje-completado");
    var mensajeError = document.getElementById("mensaje-error");
    var mensajeExclamacion = document.getElementById("mensaje-exclamacion");

    // Valida y verifica si todos los campos de seleccion estan completos
    if (selectAño.value === "0" || selectCargo.value === "0" || selectDistrito.value === "0" || selectSeccion.value === "0") {
        mensajeCompletado.style.display = "none";
        mensajeError.style.display = "none";
        mensajeExclamacion.style.display = "block";
        mensajeExclamacion.innerHTML = '<i class="fas fa-exclamation"></i> Faltan campos por seleccionar.';
    } else {
        mensajeExclamacion.style.display = "none";

        try {
            mensajeCompletado.style.display = "block";
            mensajeError.style.display = "none";
            mensajeCompletado.innerHTML = '<i class="fas fa-thumbs-up"></i> Operación completada con éxito.';
        } catch (error) { // muestra mensaje de error
            mensajeCompletado.style.display = "none";
            mensajeError.style.display = "block";
            mensajeError.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: ' + error.message;
        }
    }
}




