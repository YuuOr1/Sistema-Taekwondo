// ── DATA ──
const alumnos = [
    { nombre: "Aitana Ortega Benítez", cinta: "Blanca",   cinSubir: "Amarilla" },
    { nombre: "Juan Pérez Martínez",   cinta: "Amarilla", cinSubir: "Verde"    },
    { nombre: "Ana López García",      cinta: "Verde",    cinSubir: "Azul"     },
    { nombre: "Carlos Gómez Ríos",     cinta: "Azul",     cinSubir: "Roja"     },
    { nombre: "María Torres Sánchez",  cinta: "Naranja",  cinSubir: "Verde"    },
];

const colegiatura = [
    { nombre:"Juan Pérez Martínez",   cinta:"Amarilla", monto:350, fecha:"03/03/2026", metodo:"Efectivo",      estado:"pagado"    },
    { nombre:"Ana López García",      cinta:"Verde",    monto:350, fecha:"05/03/2026", metodo:"Transferencia", estado:"pagado"    },
    { nombre:"Carlos Gómez Ríos",     cinta:"Azul",     monto:350, fecha:null,         metodo:null,            estado:"pendiente" },
    { nombre:"María Torres Sánchez",  cinta:"Naranja",  monto:350, fecha:null,         metodo:null,            estado:"vencido"   },
    { nombre:"Aitana Ortega Benítez", cinta:"Blanca",   monto:300, fecha:"01/03/2026", metodo:"Efectivo",      estado:"pagado"    },
];

const examenPagos = [
    { nombre:"Juan Pérez Martínez",   cinSubir:"Verde",    monto:250, fecha:"10/02/2026", metodo:"Efectivo",      estado:"pagado"    },
    { nombre:"Ana López García",      cinSubir:"Azul",     monto:250, fecha:"12/02/2026", metodo:"Transferencia", estado:"pagado"    },
    { nombre:"Carlos Gómez Ríos",     cinSubir:"Roja",     monto:250, fecha:null,         metodo:null,            estado:"pendiente" },
    { nombre:"María Torres Sánchez",  cinSubir:"Verde",    monto:250, fecha:null,         metodo:null,            estado:"vencido"   },
    { nombre:"Aitana Ortega Benítez", cinSubir:"Amarilla", monto:200, fecha:"08/02/2026", metodo:"Efectivo",      estado:"pagado"    },
];

const pendientes = [
    { nombre:"Carlos Gómez Ríos",    cinta:"Azul",    concepto:"Colegiatura", periodo:"Marzo 2026",     monto:350, dias:12 },
    { nombre:"María Torres Sánchez", cinta:"Naranja", concepto:"Colegiatura", periodo:"Febrero 2026",   monto:350, dias:28 },
    { nombre:"Carlos Gómez Ríos",    cinta:"Azul",    concepto:"Examen",      periodo:"Feb 2026",       monto:250, dias:5  },
    { nombre:"María Torres Sánchez", cinta:"Naranja", concepto:"Examen",      periodo:"Feb 2026",       monto:250, dias:5  },
];

// ── HELPERS ──
const beltMap = { blanca:"blanca", amarilla:"amarilla", naranja:"naranja", verde:"verde", azul:"azul", roja:"roja", negra:"negra" };

function beltBadge(nombre) {
    const cls = beltMap[nombre.toLowerCase()] || "blanca";
    return `<span class="belt-badge belt-${cls}"><span class="belt-dot"></span>${nombre}</span>`;
}

function estadoBadge(estado) {
    const map = { pagado:"badge-pagado", pendiente:"badge-pendiente", vencido:"badge-vencido" };
    const label = { pagado:"✔ Pagado", pendiente:"⏳ Pendiente", vencido:"⚠ Vencido" };
    return `<span class="badge ${map[estado]}">${label[estado]}</span>`;
}

// ── SUMMARY CARDS ──
function renderSummary() {
    const total = colegiatura.length;
    const pagados = colegiatura.filter(p => p.estado === "pagado").length;
    const pend = pendientes.length;

    document.getElementById("summary-cards").innerHTML = `
        <div class="summary-card verde">
            <span class="card-label">Colegiaturas al corriente</span>
            <span class="card-value">${pagados} / ${total}</span>
            <span class="card-sub">Alumnos pagados este mes</span>
        </div>
        <div class="summary-card rojo">
            <span class="card-label">Pagos pendientes</span>
            <span class="card-value">${pend}</span>
            <span class="card-sub">Requieren atención</span>
        </div>
        <div class="summary-card azul">
            <span class="card-label">Total alumnos activos</span>
            <span class="card-value">${alumnos.length}</span>
            <span class="card-sub">Inscritos actualmente</span>
        </div>
    `;
}

// ── TAB 1: PENDIENTES ──
function renderPendientes() {
    const tbody = document.getElementById("tabla-pendientes");
    tbody.innerHTML = "";
    pendientes.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${p.nombre}</strong></td>
            <td>${beltBadge(p.cinta)}</td>
            <td>${p.concepto}</td>
            <td>${p.periodo}</td>
            <td><strong>$${p.monto}</strong></td>
            <td><span class="dias-badge ${p.dias > 20 ? 'dias-alto':'dias-medio'}">${p.dias} días</span></td>
            <td>
                <button class="btn-table btn-table-pay">✔ Marcar pagado</button>
            </td>
        </tr>`;
    });
}

// ── TAB 2: COLEGIATURA ──
function renderColegiatura() {
    const tbody = document.getElementById("tabla-colegiatura");
    tbody.innerHTML = "";
    colegiatura.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${p.nombre}</strong></td>
            <td>${beltBadge(p.cinta)}</td>
            <td><strong>$${p.monto}</strong></td>
            <td>${p.fecha || "—"}</td>
            <td>${p.metodo || "—"}</td>
            <td>${estadoBadge(p.estado)}</td>
            <td>
                ${p.estado !== "pagado"
                    ? `<button class="btn-table btn-table-pay">✔ Registrar pago</button>`
                    : `<button class="btn-table btn-table-view">Ver detalle</button>`}
            </td>
        </tr>`;
    });
}

// ── TAB 3: EXAMEN ──
function renderExamen() {
    const tbody = document.getElementById("tabla-examen");
    tbody.innerHTML = "";
    examenPagos.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${p.nombre}</strong></td>
            <td>${beltBadge(p.cinSubir)}</td>
            <td><strong>$${p.monto}</strong></td>
            <td>${p.fecha || "—"}</td>
            <td>${p.metodo || "—"}</td>
            <td>${estadoBadge(p.estado)}</td>
            <td>
                ${p.estado !== "pagado"
                    ? `<button class="btn-table btn-table-pay">✔ Registrar pago</button>`
                    : `<button class="btn-table btn-table-view">Ver detalle</button>`}
            </td>
        </tr>`;
    });
}

// ── MODAL ──
const overlay = document.getElementById("modal-overlay");
const modalAlumno = document.getElementById("modal-alumno");

// Populate alumno select
alumnos.forEach(a => {
    const opt = document.createElement("option");
    opt.textContent = a.nombre;
    modalAlumno.appendChild(opt);
});

// Set today's date
const today = new Date().toISOString().split("T")[0];
document.getElementById("modal-fecha").value = today;

document.getElementById("btn-registrar-colegiatura").addEventListener("click", () => {
    overlay.classList.add("open");
});
document.getElementById("modal-close").addEventListener("click", () => overlay.classList.remove("open"));
document.getElementById("btn-cancel-modal").addEventListener("click", () => overlay.classList.remove("open"));
overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });

document.getElementById("btn-confirm").addEventListener("click", () => {
    const alumno = modalAlumno.value;
    if (!alumno) { alert("Selecciona un alumno"); return; }
    alert(`✔ Pago de colegiatura registrado para ${alumno}`);
    overlay.classList.remove("open");
});

// ── TABS ──
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
});

// ── INIT ──
renderSummary();
renderPendientes();
renderColegiatura();
renderExamen();