// ── DATA ──
const alumnos = [
    { nombre: "Aitana Ortega Benítez",  fechaNac: "03/04/2016", edad: 9,  ingreso: "03/09/2025", exAnterior: "--------",   cinActual: "Blanca",   cinSubir: "Amarilla", categoria: "Principiante", cp: true,  vivos: true  },
    { nombre: "Juan Pérez Martínez",    fechaNac: "12/03/2009", edad: 14, ingreso: "01/01/2025", exAnterior: "15/06/2024", cinActual: "Amarilla", cinSubir: "Verde",    categoria: "Infantil",     cp: true,  vivos: true  },
    { nombre: "Ana López García",       fechaNac: "08/07/2011", edad: 12, ingreso: "02/01/2025", exAnterior: "10/05/2024", cinActual: "Verde",    cinSubir: "Azul",     categoria: "Infantil",     cp: false, vivos: true  },
    { nombre: "Carlos Gómez Ríos",      fechaNac: "22/11/2007", edad: 16, ingreso: "03/01/2025", exAnterior: "20/08/2024", cinActual: "Azul",     cinSubir: "Roja",     categoria: "Juvenil",      cp: true,  vivos: true },
    { nombre: "María Torres Sánchez",   fechaNac: "05/05/2008", edad: 15, ingreso: "04/01/2025", exAnterior: "12/07/2024", cinActual: "Naranja",  cinSubir: "Verde",    categoria: "Juvenil",      cp: true,  vivos: true  },
];

const historial = [
    { fecha: "15 Junio 2024",    total: 18, aprobados: 15, reprobados: 3 },
    { fecha: "10 Mayo 2024",     total: 22, aprobados: 20, reprobados: 2 },
    { fecha: "20 Agosto 2024",   total: 14, aprobados: 12, reprobados: 2 },
    { fecha: "12 Julio 2024",    total: 19, aprobados: 17, reprobados: 2 },
];

// ── BELT BADGE ──
const beltClassMap = { blanca:"blanca", amarilla:"amarilla", naranja:"naranja", verde:"verde", azul:"azul", roja:"roja", negra:"negra" };

function beltBadge(nombre) {
    const cls = beltClassMap[nombre.toLowerCase()] || "blanca";
    return `<span class="belt-badge belt-${cls}"><span class="belt-dot"></span>${nombre}</span>`;
}

// ── TAB 1: LISTA ──
function renderLista() {
    const tbody = document.getElementById("tabla-lista");
    tbody.innerHTML = "";
    alumnos.forEach(a => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${a.nombre}</strong></td>
            <td>${a.fechaNac}</td>
            <td>${a.edad}</td>
            <td>${a.ingreso}</td>
            <td>${a.exAnterior}</td>
            <td>${beltBadge(a.cinActual)}</td>
            <td>${beltBadge(a.cinSubir)}</td>
            <td>${a.categoria}</td>
            <td>
                <span class="badge ${a.cp ? 'badge-aprobado':'badge-reprobado'}">CP: ${a.cp?'Sí':'No'}</span>
                <span class="badge ${a.vivos ? 'badge-aprobado':'badge-reprobado'}" style="margin-left:4px">Vivos: ${a.vivos?'Sí':'No'}</span>
            </td>
            <td><span class="badge badge-pendiente">Pendiente</span></td>
        </tr>`;
    });
}

// ── TAB 2: CALIFICACIONES ──
function calcTotal(row) {
    const inputs = row.querySelectorAll(".score-input");
    let sum = 0, count = 0;
    inputs.forEach(inp => {
        const v = parseFloat(inp.value);
        if (!isNaN(v)) { sum += v; count++; }
    });
    const avg = count > 0 ? (sum / count).toFixed(1) : "—";
    row.querySelector(".score-total").textContent = avg;

    const badge = row.querySelector(".resultado-badge");
    if (count === inputs.length) {
        const num = parseFloat(avg);
        badge.textContent = num >= 7 ? "Aprobado" : "Reprobado";
        badge.className = `badge resultado-badge ${num >= 7 ? "badge-aprobado" : "badge-reprobado"}`;
    }
}

function renderCalificaciones() {
    const tbody = document.getElementById("tabla-calificaciones");
    tbody.innerHTML = "";
    alumnos.forEach((a, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${a.nombre}</strong></td>
            <td>${beltBadge(a.cinSubir)}</td>
            <td><input class="score-input" type="number" min="5" max="10" placeholder="—"></td>
            <td><input class="score-input" type="number" min="5" max="10" placeholder="—"></td>
            <td><input class="score-input" type="number" min="5" max="10" placeholder="—"></td>
            <td><input class="score-input" type="number" min="5" max="10" placeholder="—"></td>
            <td><span class="score-total">—</span></td>
            <td><span class="badge badge-pendiente resultado-badge">Pendiente</span></td>
            <td><button class="btn-save">Guardar</button></td>
        `;
        tr.querySelectorAll(".score-input").forEach(inp => inp.addEventListener("input", () => calcTotal(tr)));
        tr.querySelector(".btn-save").addEventListener("click", () => {
            alert(`✔ Calificación de ${a.nombre} guardada`);
        });
        tbody.appendChild(tr);
    });
}

// ── TAB 3: HISTORIAL ──
function renderHistorial() {
    const grid = document.getElementById("historial-grid");
    grid.innerHTML = "";
    historial.forEach(h => {
        grid.innerHTML += `
        <div class="historial-card">
            <h4>Examen — ${h.fecha}</h4>
            <p class="historial-meta">Total de alumnos: <strong>${h.total}</strong></p>
            <div class="historial-stats">
                <div class="stat-box aprobados">
                    <span class="stat-num">${h.aprobados}</span>
                    <span class="stat-label">Aprobados</span>
                </div>
                <div class="stat-box reprobados">
                    <span class="stat-num">${h.reprobados}</span>
                    <span class="stat-label">Reprobados</span>
                </div>
                <div class="stat-box">
                    <span class="stat-num">${Math.round(h.aprobados/h.total*100)}%</span>
                    <span class="stat-label">Aprobación</span>
                </div>
            </div>
        </div>`;
    });
}

// ── TABS LOGIC ──
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
});

// ── INIT ──
renderLista();
renderCalificaciones();
renderHistorial();