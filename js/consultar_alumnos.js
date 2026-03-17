const alumnos = [
    {id:1, nombre:"Juan Pérez", fecha: "00/00/0000", edad:14, ing: "01/01/2025", ex: "00/00/0000", prox: "Verde", empresa: "MPK", cinta:"Amarilla"},
    {id:2, nombre:"Ana López", fecha: "00/00/0000", edad:12, ing: "02/01/2025", ex: "00/00/0000", prox: "Amarilla", empresa: "Otra", cinta:"Blanca"},
    {id:3, nombre:"Carlos Gómez", fecha: "00/00/0000", edad:16, ing: "03/01/2025", ex: "00/00/0000", prox: "Roja", empresa: "MPK", cinta:"Verde"},
    {id:4, nombre:"María Torres", fecha: "00/00/0000", edad:15, ing: "04/01/2025", ex: "00/00/0000", prox: "Naranja", empresa: "Otra", cinta:"Azul"},
    {id:5, nombre:"Luis Ramírez", fecha: "00/00/0000", edad:13, ing: "05/01/2025", ex: "00/00/0000", prox: "Azul", empresa: "MPK", cinta:"Naranja"}
];

const tabla = document.getElementById("tabla-resultados");

alumnos.forEach(alumno => {

    const fila = `
        <tr>
            <td>${alumno.id}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.fecha}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.ing}</td>
            <td>${alumno.ex}</td>
            <td>${alumno.cinta}</td>
            <td>${alumno.prox}</td>
            <td>${alumno.empresa}</td>
            <td>
                <button>Editar</button>
                <button>Eliminar</button>
            </td>
        </tr>
    `;

    tabla.innerHTML += fila;

});