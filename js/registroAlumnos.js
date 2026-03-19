const botonEnviar = document.getElementById("botonEnviar");

botonEnviar.addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value.trim();

    if (!nombre) {
        alert("Por favor ingresa el nombre del alumno.");
        return;
    }

    alert("✔ Alumno registrado exitosamente");
    window.location.href = "consultar_alumnos.html";
});