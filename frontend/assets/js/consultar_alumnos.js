
let alumnosGlobal = [];

// Map belt name (lowercase) → CSS class suffix
const beltClass = {
    "blanca":   "blanca",
    "amarilla": "amarilla",
    "naranja":  "naranja",
    "verde":    "verde",
    "azul":     "azul",
    "roja":     "roja",
    "negra":    "negra"
};

// 🔥 FUNCIÓN SEGURA (evita null)
function beltBadge(nombre) {
    if (!nombre) {
        return `<span class="belt-badge">Sin cinta</span>`;
    }

    const key = nombre.toLowerCase();
    const cls = beltClass[key] || "blanca";

    return `<span class="belt-badge belt-${cls}">
                <span class="belt-dot"></span>
                ${nombre}
            </span>`;
}

// 🔥 RENDER TABLA (con protección de NULL)
function renderTable(lista) {
    const tabla = document.getElementById("tabla-resultados");
    tabla.innerHTML = "";

    lista.forEach(alumno => {
        const fila = `
            <tr>
                <td>${alumno.id_alumno}</td>
                <td><strong>${alumno.nombre || "Sin nombre"} ${alumno.apellidoPaterno || ""}</strong></td>
                <td>${alumno.fechaNacimiento || "Sin fecha"}</td>
                <td>${alumno.edad || "-"}</td>
                <td>${alumno.fechaIngreso || "Sin fecha"}</td>
                <td>${alumno.examenAnterior || "Sin examen"}</td>
                <td>${beltBadge(alumno.color)}</td>
                <td>${beltBadge(alumno.sigCinta || alumno.color)}</td>
                <td>${alumno.sucursal || "Sin empresa"}</td>
                <td>
                    <button class="btn-table btn-table-edit" data-id = "${alumno.id_alumno}" >Editar</button>
                    <button class="btn-table btn-table-delete">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

// 🔥 FETCH CORRECTO
fetch("php/obtenerAlumnos.php")
    .then(response => response.json())
    .then(data => {
        console.log("DATOS DESDE BD:", data); // 👈 para debug
        alumnosGlobal = data;
        renderTable(data);
    })
    .catch(error => console.error("Error:", error));

// 🔍 BÚSQUEDA CORREGIDA
document.querySelector(".btn-search").addEventListener("click", () => {
    const q = document.getElementById("query").value.toLowerCase().trim();

    const filtrados = alumnosGlobal.filter(a => {
        const nombreCompleto = `${a.nombre || ""} ${a.apellidoPaterno || ""}`.toLowerCase();
        return nombreCompleto.includes(q);
    });

    renderTable(filtrados);
});

// 🔥 ENTER PARA BUSCAR
document.getElementById("query").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.querySelector(".btn-search").click();
    }
});