<?php
require 'conexion.php';

$nombre = $_POST['nombre'];
$apellidoPaterno = $_POST['apellidoPaterno'];
$apellidoMaterno = $_POST['apellidoMaterno'];
$fechaNacimiento = $_POST['fechaNacimiento'];
$edad = $_POST['edad'];
$ocupacion = $_POST['ocupacion'];
$estadoCivil = $_POST['estadoCivil'];
$fechaIngreso = $_POST['fechaIngreso'];
$examenAnterior = $_POST['examenAnterior'];
$cintaAlumno = $_POST['cintaAlumno']; # De tabla (cintas)
$sigCinta = $_POST['sigCinta'];
$telefonoTutor = $_POST['telefonoTutor']; # De tabla (tutores)
$correoTutor = $_POST['correoTutor']; # De tabla (tutores)
$empresa = $_POST['empresa']; # De tabla (Dojos)

# Verificamos que el telefono o correo no exista en tutores
$sqlTutor = "SELECT id_tutor FROM tutores WHERE telefono = '$telefonoTutor'";
$resultadoTutor = $conn -> query($sqlTutor);

if(!$resultadoTutor){ # En caso de que haya error en la consulta se imprime error
    die("Error en la consulta: " . $conn -> error);
}

if ($resultadoTutor -> num_rows > 0){ # Verificamos que exista una fila con la especificacion asignada
    $filaTutor = $resultadoTutor -> fetch_assoc();
    $id_tutor = $filaTutor['id_tutor'];
}
else{
    $sqlInsertTutor = "INSERT INTO tutores (telefono, correo) VALUES ('$telefonoTutor', '$correoTutor')";

    if(!$conn -> query($sqlInsertTutor)){
        die("Error al insertar tutor: " . $conn -> error);
    }

    # Obtenemos el ID
    $id_tutor = $conn -> insert_id;
}

# Seleccionamos el id del Dojo
$sqlDojo = "SELECT id_dojo FROM dojos WHERE sucursal = '$empresa'";
$resultadoDojo = $conn -> query($sqlDojo);

if(!$resultadoDojo){ # Verificamos que no haya error en la consulta
    die("Error en la consulta: " . $conn -> error);
}

if ($resultadoDojo -> num_rows > 0){
    $filaDojo = $resultadoDojo -> fetch_assoc();
    $id_dojo = $filaDojo['id_dojo'];
}
else{
    $sqlInsertDojo = "INSERT INTO dojos (sucursal) VALUES ('$empresa')";

    if(!$conn -> query($sqlInsertDojo)){
        die("Error al insertar dojo: " . $conn -> error);
    }

    # Obtenemos el ID del dojo
    $id_dojo = $conn -> insert_id;
}

# Obtenemos la cinta
$sqlCinta = "SELECT id_cinta FROM cintas WHERE color = '$cintaAlumno'";
$resultadoCinta = $conn -> query($sqlCinta);

if (!$resultadoCinta){
    die("Error en la consulta de cinta: " . $conn -> error);
}

$filaCinta = $resultadoCinta -> fetch_assoc();
$id_cinta = $filaCinta['id_cinta'];

$sqlFormulario = "INSERT INTO alumnos (id_tutor, id_dojo, id_cinta, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, edad, ocupacion, estadoCivil, fechaIngreso, examenAnterior, sigCinta) VALUES ('$id_tutor', '$id_dojo' , '$id_cinta', '$nombre', '$apellidoPaterno', '$apellidoMaterno' , '$fechaNacimiento', '$edad', '$ocupacion', '$estadoCivil', '$fechaIngreso', '$examenAnterior', '$sigCinta')";

if(!$conn -> query($sqlFormulario)){
    die("Error al insertar el alumno: " . $conn -> error);
}

header("Location: consultar_alumnos.html");
exit();



?>