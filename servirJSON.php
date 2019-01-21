<?php
$claveUsuario = 'c0f271a391588723fc935581e4fe0bfc';

// Si la consulta es una búsqueda
if(isset($_GET["busca"])){
    $terminoBusca = $_GET["busca"];
    $resulBusca = file_get_contents("http://food2fork.com/api/search?key=$claveUsuario&q=$terminoBusca");
    echo $resulBusca;
}

// Si nos están pidiendo una receta
if(isset($_GET["id"])){
    $idReceta = $_GET["id"];
    $resulReceta = file_get_contents("http://food2fork.com/api/get?key=$claveUsuario&rId=$idReceta");
    echo $resulReceta;
}
?>