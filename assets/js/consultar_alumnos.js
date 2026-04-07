const alumnos = [
    {id:1, nombre:"Juan Pérez",   fecha:"12/03/2009", edad:14, ing:"01/01/2025", ex:"15/06/2024", cinta:"Amarilla", prox:"Verde",    empresa:"MPK"},
    {id:2, nombre:"Ana López",    fecha:"08/07/2011", edad:12, ing:"02/01/2025", ex:"10/05/2024", cinta:"Blanca",   prox:"Amarilla", empresa:"Otra"},
    {id:3, nombre:"Carlos Gómez", fecha:"22/11/2007", edad:16, ing:"03/01/2025", ex:"20/08/2024", cinta:"Verde",    prox:"Roja",     empresa:"MPK"},
    {id:4, nombre:"María Torres", fecha:"05/05/2008", edad:15, ing:"04/01/2025", ex:"12/07/2024", cinta:"Azul",     prox:"Naranja",  empresa:"Otra"},
    {id:5, nombre:"Luis Ramírez", fecha:"30/09/2010", edad:13, ing:"05/01/2025", ex:"18/09/2024", cinta:"Naranja",  prox:"Azul",     empresa:"MPK"}
];

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

function beltBadge(nombre) {
    const key = nombre.toLowerCase();
    const cls = beltClass[key] || "blanca";
    return `<span class="belt-badge belt-${cls}">
                <span class="belt-dot"></span>
                ${nombre}
            </span>`;
}

function renderTable(lista) {
    const tabla = document.getElementById("tabla-resultados");
    tabla.innerHTML = "";

    lista.forEach(alumno => {
        const fila = `
            <tr>
                <td>${alumno.id}</td>
                <td><strong>${alumno.nombre}</strong></td>
                <td>${alumno.fecha}</td>
                <td>${alumno.edad}</td>
                <td>${alumno.ing}</td>
                <td>${alumno.ex}</td>
                <td>${beltBadge(alumno.cinta)}</td>
                <td>${beltBadge(alumno.prox)}</td>
                <td>${alumno.empresa}</td>
                <td>
                    <button class="btn-table btn-table-edit">Editar</button>
                    <button class="btn-table btn-table-delete">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

renderTable(alumnos);

// Search functionality
document.querySelector(".btn-search").addEventListener("click", () => {
    const q = document.getElementById("query").value.toLowerCase().trim();
    const filtrados = alumnos.filter(a => a.nombre.toLowerCase().includes(q));
    renderTable(filtrados);
});

document.getElementById("query").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.querySelector(".btn-search").click();
});