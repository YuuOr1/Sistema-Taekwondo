<?php
    $servidor = "svdm056.serverneubox.com.mx";
    $usuario = "glevanco_taekw_bd";
    $password = "6nP4MjHSCCxqJpjUtgay";
    $bd = "glevanco_taekw_bd";

    $conn = mysqli_connect($servidor, $usuario, $password, $bd);

    if (!$conn){
        die("Error de conexion: " . mysqli_connect_error());
    }
