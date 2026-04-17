<?php
require 'conexion.php';

$sql = "SELECT 
    alumnos.*, 
    IFNULL(cintas.color, 'Sin cinta') AS color,
    IFNULL(alumnos.sigCinta, 'Sin cinta') AS sigCinta,
    IFNULL(alumnos.fechaIngreso, 'Sin fecha') AS fechaIngreso,
    IFNULL(alumnos.examenAnterior, 'Sin examen') AS examenAnterior,
    dojos.sucursal
FROM alumnos
JOIN cintas ON alumnos.id_cinta = cintas.id_cinta
JOIN dojos ON alumnos.id_dojo = dojos.id_dojo";

$resultado = $conn->query($sql);

if (!$resultado) {
    die("Error en la consulta: " . $conn->error);
}

$alumnos = [];

while($fila = $resultado->fetch_assoc()){
    $alumnos[] = $fila;
}

// indicar que es JSON
header('Content-Type: application/json');

echo json_encode($alumnos);
?>