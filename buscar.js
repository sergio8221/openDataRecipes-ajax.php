
// Elementos
let elemResulBusca = document.getElementById('resulBusca');
let elemBusca = document.getElementById('busca');
let elemBtn = document.getElementById('btn-busca');

// Variables
let buscaJSON;

// Búsqueda
elemBtn.addEventListener('click', evt => {
    evt.preventDefault();

    var httReq = new XMLHttpRequest();
    httReq.open("GET", `./servirJSON.php?busca=${elemBusca.value.trim()}`, true);
    httReq.send();

    httReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let datos = this.responseText;
            buscaJSON = JSON.parse(datos);

            mostrarBusqueda();
        }
    }
});




// Funciones
function mostrarBusqueda() {
    // Vaciamos el cuadro de búsqueda
    elemResulBusca.innerHTML = ""

    buscaJSON.recipes.forEach(receta => {
        contenedorResulReceta = document.createElement('div');
        // Guardamos el id de receta para luego obtenerlo fácilmente al seleccionarla
        contenedorResulReceta.id = receta.recipe_id;
        contenedorResulReceta.className = 'resul-receta';
        contenedorResulReceta.style.backgroundImage = `url(${receta.image_url})`;

        tituloReceta = document.createElement('p');
        tituloReceta.innerText = receta.title;

        contenedorResulReceta.appendChild(tituloReceta);
        elemResulBusca.appendChild(contenedorResulReceta);
    });
}