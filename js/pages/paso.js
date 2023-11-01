const tipoEleccion = 1; // PASO
const tipoRecuento = 1; // Recuento definitivo

async function fetchDatos() {
    try { // Solicitud a la URL 
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const años = await response.json();
        return años; // Devuelve los datos de años
    } catch (error) {
        console.error("Error en fetchDatos:", error);
        throw error; // Lanza el error
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

// Llamo a las funciones secuencialmente. fetch, luego cargarAños.
fetchDatos()
    .then(años => {
        cargarAños(años);
        console.log(años)
    })
    .catch(error => {
        console.error("Error:", error);
    });



function seleccionAño() {
    var selectElement = document.getElementById("select-año");
    var selectedValue = selectElement.value;

    console.log(selectedValue);

    if (selectedValue && selectedValue != 0) { // Verifico que no es nulo
        fetchCargos(selectedValue); //Llamo a fetchCargos con el año seleccionado
    }
}



async function fetchCargos(selectedValue) {
    console.log(tipoEleccion);
    try {
        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectedValue);
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        var data = await response.json();  // Almaceno en data
        data = data[tipoEleccion] // Accedo a los datos de PASO
        console.log(data[tipoEleccion])
        cargarCargos(data);

    } catch (error) {
        console.error("Error en fetchCargos:", error);
    }
}

var datosCargosYDistritos;


function cargarCargos(data) {
    var selectElement = document.getElementById("select-cargo");
    let selectHTML = '<option value="0">Cargo</option>';

    datosCargosYDistritos = data // Cargo data en variable global
    var cargosAMostrar = [] // Array para llenar el segundo combo

    cargosAMostrar = data.Cargos.map((dato) => { // Se devuelve el cargo en forma de array 
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
    // Obtiene el distrito seleccionado para mostrar las secciones disponibles
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













// Obtener una referencia al botón "Filtrar" por su id
var botonFiltrar = document.getElementById("boton-filtrar");

// Asociar un evento de clic al botón
botonFiltrar.addEventListener("click", filtrarDatos);


async function filtrarDatos() {
    // Obtener los valores de los campos de selección
    var anioEleccion = document.getElementById("select-año").value;
    var tipoRecuento = tipoRecuento;
    var tipoEleccion = tipoEleccion;
    var categoriaId = 2;
    var distritoId = document.getElementById("select-distrito").value;
    var seccionProvincialId = document.getElementById("hdSeccionProvincial").value;
    var seccionId = document.getElementById("select-seccion").value;
    var circuitoId = "";
    var mesaId = "";



    // Construir la URL con los valores de los campos
    var url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }

        const data = await response.json();


        // Si la respuesta fue correcta, imprimir en la consola
        console.log(data);
    } catch (error) {
        // Mostrar un mensaje de error en rojo con el detalle del error
        mostrarMensajeError(`Error: ${error.message}`);
    }
}


function mostrarMensaje(mensaje) {
    // Aquí puedes implementar la lógica para mostrar un mensaje al usuario, por ejemplo, en un cuadro de diálogo o en un elemento en el documento.
    alert(mensaje); // Ejemplo: mostrar el mensaje en una ventana emergente
}

function mostrarMensajeError(mensaje) {
    // Aquí puedes implementar la lógica para mostrar un mensaje de error al usuario.
    // Puede ser un cuadro de diálogo de error, un mensaje en la página, etc.
    // Por ejemplo, puedes mostrar un mensaje de error en un elemento con un ID específico:

    var mensajeErrorElement = document.getElementById("mensaje-error");

    if (mensajeErrorElement) {
        mensajeErrorElement.textContent = mensaje;
        mensajeErrorElement.style.color = "red"; // Establecer el color del mensaje en rojo
    } else {
        alert("Error: " + mensaje); // Si no existe un elemento con ID "mensaje-error", muestra una alerta.
    }
}

botonFiltrar.addEventListener("click", function () {
    // Llama a la función para actualizar el título y el subtítulo
    actualizarInformacionTituloYSubtitulo();
});


var selectAnio = document.getElementById("select-año");
var selectCargo = document.getElementById("select-cargo");
var selectDistrito = document.getElementById("select-distrito");
var selectSeccion = document.getElementById("select-seccion");

selectAnio.addEventListener("change", actualizarInformacionTituloYSubtitulo);
selectCargo.addEventListener("change", actualizarInformacionTituloYSubtitulo);
selectDistrito.addEventListener("change", actualizarInformacionTituloYSubtitulo);
selectSeccion.addEventListener("change", actualizarInformacionTituloYSubtitulo);

function actualizarInformacionTituloYSubtitulo() {
    var tipoEleccion = "PASO"
    var selectAnioValue = selectAnio.value;
    var selectCargoValue = selectCargo.value;
    var selectDistritoValue = selectDistrito.value;
    var selectSeccionValue = selectSeccion.options[selectSeccion.selectedIndex].text;

    // Actualizar los elementos del DOM con el título y subtítulo
    document.getElementById("titulo-elecciones").textContent = `Elecciones ${selectAnioValue} | ${tipoEleccion}`;
    document.getElementById("subtitulo-eleccion").textContent = `${selectAnioValue} > ${tipoEleccion} > ${selectCargoValue} > ${selectDistritoValue} > ${selectSeccionValue}`;
}