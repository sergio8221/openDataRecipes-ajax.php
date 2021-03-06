
// Elementos
let elemResulBusca = document.getElementById('resulBusca');
let elemBusca = document.getElementById('busca');
let elemBtn = document.getElementById('btn-busca');
let elemNPag = document.getElementById('nPag');
let elemPasoPagina = document.getElementById('pasoPagina');
let elemPagAnterior = document.getElementById('pagAnterior');
let elemPagSiguiente = document.getElementById('pagSiguiente');

let elemContReceta = document.getElementById('contReceta');

let elemListaCompra = document.getElementById('listaCompra');
let elemCarrito = document.getElementById('carrito');
let elemCerrarCarrito = document.getElementById('cerrarCarrito');
let elemCestaVacia = document.getElementById('cestaVacia');
let elemListaIngredientes = document.querySelector('#ingredientesCompra>ul');

// Variables
let buscaJSON; //JSON con la búsqueda actual
let recetaJSON; //JSON con la receta actual
let listaCompra = []; //Array con la lista de la compra
let elemCargaBusca; //Gif carga búsqueda
let elemCargaReceta; //Gif carga receta
let elemIngredientes; //Elemento UL de ingredientes cargados
cargarGifs(); // Precargamos los gifs de carga en las variables anteriores

// Constantes
const nBuscaPag = 8; // Número de resultados por página

// Evento buscar receta
elemBtn.addEventListener('click', evt => {
    evt.preventDefault();
    elemResulBusca.innerHTML = "";
    elemResulBusca.appendChild(elemCargaBusca);

    let request = new XMLHttpRequest();
    request.open("GET", `./servirJSON.php?busca=${elemBusca.value.trim()}`, true);
    request.send();

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let datos = this.responseText;
            buscaJSON = JSON.parse(datos);

            mostrarBusqueda(1); //Mostramos la primera página de resultados
        }
    }
});

// Evento seleccionar receta
elemResulBusca.addEventListener('click', evt => {
    let elemRecetaSelec = evt.target;
    let idReceta = elemRecetaSelec.id;
    elemContReceta.innerHTML = "";
    elemContReceta.appendChild(elemCargaReceta);

    let request = new XMLHttpRequest();
    request.open("GET", `./servirJSON.php?id=${idReceta}`, true);
    request.send();

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let datos = this.responseText;
            recetaJSON = JSON.parse(datos);

            mostrarReceta();
        }
    }
});

// Evento pasar página
elemPasoPagina.addEventListener('click', evt => {
    if (buscaJSON) { // Sólo si hay una búsqueda
        if (evt.target == elemPagSiguiente) {
            if (parseInt(elemNPag.innerText) < (buscaJSON.recipes.length / nBuscaPag)) {
                mostrarBusqueda(parseInt(elemNPag.innerText) + 1);
            }
        }
        if (evt.target == elemPagAnterior) {
            if (parseInt(elemNPag.innerText) > 1) {
                mostrarBusqueda(parseInt(elemNPag.innerText) - 1);
            }
        }
    }
});

// Evento abrir lista ingredientes
elemCarrito.addEventListener('click', evt => {
    elemListaCompra.style.width = '40%';
    elemListaCompra.style.height = '500%';
});

// Evento cerrar lista ingredientes
elemCerrarCarrito.addEventListener('click', evt => {
    elemListaCompra.style.width = 0;
    elemListaCompra.style.height = 0;
});

// ---------------FUNCIONES---------------------------
function cargarGifs() {
    elemCargaBusca = new Image();
    elemCargaBusca.src = "./img/cargaBusca.gif";
    elemCargaBusca.id = "carga-busca";

    elemCargaReceta = new Image();
    elemCargaReceta.src = "./img/cargaReceta.gif";
    elemCargaReceta.id = "carga-receta";
}

function mostrarBusqueda(nPag) {
    // Vaciamos el cuadro de búsqueda
    elemResulBusca.innerHTML = ""
    // Escribimos el número de página
    elemNPag.innerText = nPag;

    buscaJSON.recipes.forEach((receta, i) => {
        if (i >= (nPag - 1) * nBuscaPag && i < nPag * nBuscaPag) {
            let contenedorResulReceta = document.createElement('div');
            // Guardamos el id de receta para luego obtenerlo fácilmente al seleccionarla
            contenedorResulReceta.id = receta.recipe_id;
            contenedorResulReceta.className = 'resul-receta';
            contenedorResulReceta.style.backgroundImage = `url(${receta.image_url})`;

            let tituloReceta = document.createElement('p');
            tituloReceta.innerText = receta.title;

            contenedorResulReceta.appendChild(tituloReceta);
            elemResulBusca.appendChild(contenedorResulReceta);
        }
    });
}

function mostrarReceta() {
    elemContReceta.innerHTML = "";

    // Imagen receta
    let imagenReceta = document.createElement('div');
    imagenReceta.id = "imagenReceta";
    imagenReceta.style.backgroundImage = `url(${recetaJSON.recipe.image_url})`;

    // Título de la receta
    let tituloReceta = document.createElement('h2');
    tituloReceta.innerText = recetaJSON.recipe.title;

    // Autor receta
    let autorLinea = document.createElement('span');
    let autorReceta = document.createElement('span');
    autorReceta.innerText = "Autor: " + recetaJSON.recipe.publisher;
    let webAutor = document.createElement('a');
    webAutor.href = recetaJSON.recipe.publisher_url;
    webAutor.innerText = "Web";
    webAutor.target = "_blank";

    autorLinea.appendChild(autorReceta);
    autorLinea.appendChild(webAutor);
    imagenReceta.appendChild(tituloReceta);
    imagenReceta.appendChild(autorLinea);

    // Ingredientes
    let listaIngredientes = document.createElement('ul');
    recetaJSON.recipe.ingredients.forEach(ingrediente => {
        let ingItem = document.createElement('li');
        ingItem.innerText = ingrediente;
        let comprar = new Image();
        comprar.src = "./img/iconos/carrito.svg";
        ingItem.appendChild(comprar);

        listaIngredientes.appendChild(ingItem);
    });

    // Número de comensales
    let pie = document.createElement('div');
    pie.id = "pieReceta";
    let comensales = document.createElement('p');
    comensales.innerText = "Comensales: " + calcularComensales();


    // Enlace a la receta original
    let enlaceReceta = document.createElement('a');
    enlaceReceta.href = recetaJSON.recipe.source_url;
    enlaceReceta.innerText = "Receta Original";
    enlaceReceta.target = "_blank";

    pie.appendChild(comensales);
    pie.appendChild(enlaceReceta);

    // Añadimos todos los elementos a la vista de receta
    elemContReceta.appendChild(imagenReceta);
    elemContReceta.appendChild(listaIngredientes);
    elemContReceta.appendChild(pie);

    // Añadimos el manejador de evento para comprar ingredientes
    elemIngredientes = document.querySelector('#contReceta>ul');
    elemIngredientes.addEventListener('click', evt => {
        // Si es uno de los carritos de compra
        if (evt.target.tagName == 'IMG') {
            addCompra(evt.target.parentNode.innerText);
        }
    });
}

function calcularComensales() {
    // Estimamos los comensales por el número de ingredientes
    return Math.floor(recetaJSON.recipe.ingredients.length / 3);
}

function addCompra(ingrediente) {
    listaCompra.push(ingrediente);

    actualizarCompra();
}

// Repintar la lista de la compra
function actualizarCompra() {
    if (listaCompra.length > 0) {
        elemCestaVacia.style.display = "none";
        elemListaIngredientes.innerHTML = "";
        listaCompra.forEach(ingrediente => {
            ing = document.createElement('li');
            ing.innerText = ingrediente;
            elemListaIngredientes.appendChild(ing);
        });
    } else {
        elemCestaVacia.style.display = "inline";
        elemListaIngredientes.innerHTML = "";
    }
}