<?php
require 'conexion.php';

$sql = "SELECT alumnos.* , FROM alumnos
JOIN cintas ON alumnos.id_cinta = cintas.id_cinta
JOIN dojos ON alumnos.id_dojo = dojos.id_dojo";

$resultado = $conn->query($sql);

if (!$resultado) {
    die("Error en la consulta: " . $conn->error);
}

$alumnos = [];

while($fila = $resultado -> fetch_assoc()){
    $alumnos[] = $fila;
}

# Se indica que enviaremos un json
header('Content-Type: application/json');

echo json_encode($alumnos); # Convertimos el arreglo a JSON
?>