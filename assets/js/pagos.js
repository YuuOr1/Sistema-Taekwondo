// ── DATA ──
const alumnos = [
    { id: 1, nombre: "Aitana Ortega Benítez", cinta: "Blanca",   cinSubir: "Amarilla" },
    { id: 2, nombre: "Juan Pérez Martínez",   cinta: "Amarilla", cinSubir: "Verde"    },
    { id: 3, nombre: "Ana López García",      cinta: "Verde",    cinSubir: "Azul"     },
    { id: 4, nombre: "Carlos Gómez Ríos",     cinta: "Azul",     cinSubir: "Roja"     },
    { id: 5, nombre: "María Torres Sánchez",  cinta: "Naranja",  cinSubir: "Verde"    },
];

// Historial de pagos por alumno (id -> array de pagos)
const historialPagos = {
    1: [
        { tipo: "Colegiatura", concepto: "Marzo 2026",   monto: 300, fecha: "01/03/2026", metodo: "Efectivo",      estado: "pagado"    },
        { tipo: "Examen",      concepto: "Feb 2026",     monto: 200, fecha: "08/02/2026", metodo: "Efectivo",      estado: "pagado"    },
    ],
    2: [
        { tipo: "Colegiatura", concepto: "Marzo 2026",   monto: 350, fecha: "03/03/2026", metodo: "Efectivo",      estado: "pagado"    },
        { tipo: "Examen",      concepto: "Feb 2026",     monto: 250, fecha: "10/02/2026", metodo: "Efectivo",      estado: "pagado"    },
        { tipo: "Colegiatura", concepto: "Febrero 2026", monto: 350, fecha: "05/02/2026", metodo: "Transferencia", estado: "pagado"    },
    ],
    3: [
        { tipo: "Colegiatura", concepto: "Marzo 2026",   monto: 350, fecha: "05/03/2026", metodo: "Transferencia", estado: "pagado"    },
        { tipo: "Examen",      concepto: "Feb 2026",     monto: 250, fecha: "12/02/2026", metodo: "Transferencia", estado: "pagado"    },
    ],
    4: [
        { tipo: "Colegiatura", concepto: "Marzo 2026",   monto: 350, fecha: null,         metodo: null,            estado: "pendiente" },
        { tipo: "Examen",      concepto: "Feb 2026",     monto: 250, fecha: null,         metodo: null,            estado: "pendiente" },
    ],
    5: [
        { tipo: "Colegiatura", concepto: "Febrero 2026", monto: 350, fecha: null,         metodo: null,            estado: "vencido"   },
        { tipo: "Examen",      concepto: "Feb 2026",     monto: 250, fecha: null,         metodo: null,            estado: "vencido"   },
    ],
};

const pendientes = [
    { nombre: "Carlos Gómez Ríos",    cinta: "Azul",    concepto: "Colegiatura", periodo: "Marzo 2026",   monto: 350, dias: 12 },
    { nombre: "María Torres Sánchez", cinta: "Naranja", concepto: "Colegiatura", periodo: "Febrero 2026", monto: 350, dias: 28 },
    { nombre: "Carlos Gómez Ríos",    cinta: "Azul",    concepto: "Examen",      periodo: "Feb 2026",     monto: 250, dias: 5  },
    { nombre: "María Torres Sánchez", cinta: "Naranja", concepto: "Examen",      periodo: "Feb 2026",     monto: 250, dias: 5  },
];

// ── HELPERS ──
const beltMap = { blanca: "blanca", amarilla: "amarilla", naranja: "naranja", verde: "verde", azul: "azul", roja: "roja", negra: "negra" };

function beltBadge(nombre) {
    const cls = beltMap[nombre.toLowerCase()] || "blanca";
    return `<span class="belt-badge belt-${cls}"><span class="belt-dot"></span>${nombre}</span>`;
}

function estadoBadge(estado) {
    const map   = { pagado: "badge-pagado", pendiente: "badge-pendiente", vencido: "badge-vencido" };
    const label = { pagado: " Pagado",    pendiente: " Pendiente",    vencido: " Vencido"    };
    return `<span class="badge ${map[estado]}">${label[estado]}</span>`;
}

// ── SUMMARY CARDS ──
function renderSummary() {
    const total   = alumnos.length;
    const pagados = Object.values(historialPagos).filter(h =>
        h.some(p => p.tipo === "Colegiatura" && p.estado === "pagado")
    ).length;
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
            <span class="card-value">${total}</span>
            <span class="card-sub">Inscritos actualmente</span>
        </div>
    `;
}

// ── LISTA DE ALUMNOS ──
let alumnoAbierto = null; 

function renderAlumnos(filtro = "") {
    const lista = document.getElementById("alumnos-lista");
    const filtrados = alumnos.filter(a =>
        a.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
        lista.innerHTML = `<p class="no-results">No se encontraron alumnos con ese nombre.</p>`;
        return;
    }

    lista.innerHTML = filtrados.map(a => `
        <div class="alumno-card" id="card-${a.id}">
            <div class="alumno-row" onclick="toggleAlumno(${a.id})">
                <div class="alumno-info">
                    <span class="alumno-nombre">${a.nombre}</span>
                    ${beltBadge(a.cinta)}
                </div>
                <div class="alumno-row-right">
                    <span class="alumno-toggle-hint">Ver pagos y registrar</span>
                    <span class="toggle-arrow" id="arrow-${a.id}">▼</span>
                </div>
            </div>

            <div class="alumno-panel" id="panel-${a.id}">

                <!-- Formulario de nuevo pago -->
                <div class="panel-section">
                    <h4 class="panel-section-title">Registrar nuevo pago</h4>
                    <div class="pago-form">
                        <div class="form-row">
                            <div class="field-group">
                                <label>Tipo de pago</label>
                                <select id="tipo-${a.id}">
                                    <option value="">Seleccionar...</option>
                                    <option value="Colegiatura">Colegiatura</option>
                                    <option value="Examen">Examen</option>
                                    <option value="Torneo">Torneo</option>
                                </select>
                            </div>
                            <div class="field-group">
                                <label>Concepto / Periodo</label>
                                <input type="text" id="concepto-${a.id}" placeholder="Ej. Marzo 2026 o nombre del torneo">
                            </div>
                            <div class="field-group">
                                <label>Monto ($)</label>
                                <input type="number" id="monto-${a.id}" placeholder="Ej. 350">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="field-group">
                                <label>Fecha de pago</label>
                                <input type="date" id="fecha-${a.id}" value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="field-group">
                                <label>Método de pago</label>
                                <select id="metodo-${a.id}">
                                    <option value="">Seleccionar...</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                </select>
                            </div>
                            <div class="field-group field-group-btn">
                                <button class="btn-registrar-pago" onclick="registrarPago(${a.id})">
                                    ✔ Registrar pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Historial de pagos -->
                <div class="panel-section">
                    <h4 class="panel-section-title">Historial de pagos</h4>
                    <div class="historial-wrapper">
                        ${renderHistorial(a.id)}
                    </div>
                </div>

            </div>
        </div>
    `).join("");
}

function renderHistorial(alumnoId) {
    const pagos = historialPagos[alumnoId] || [];
    if (pagos.length === 0) {
        return `<p class="no-results" style="padding:12px 0">Sin pagos registrados.</p>`;
    }
    return `
        <table class="tabla tabla-historial">
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Método</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${pagos.map(p => `
                    <tr>
                        <td>${p.tipo}</td>
                        <td>${p.concepto}</td>
                        <td><strong>$${p.monto}</strong></td>
                        <td>${p.fecha || "—"}</td>
                        <td>${p.metodo || "—"}</td>
                        <td>${estadoBadge(p.estado)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function toggleAlumno(id) {
    const panel = document.getElementById(`panel-${id}`);
    const arrow = document.getElementById(`arrow-${id}`);
    const card  = document.getElementById(`card-${id}`);

    // Si ya estaba abierto, solo cerrarlo
    if (alumnoAbierto === id) {
        panel.classList.remove("open");
        arrow.classList.remove("open");
        card.classList.remove("active");
        alumnoAbierto = null;
        return;
    }

    // Cerrar el que estaba abierto antes
    if (alumnoAbierto !== null) {
        const prevPanel = document.getElementById(`panel-${alumnoAbierto}`);
        const prevArrow = document.getElementById(`arrow-${alumnoAbierto}`);
        const prevCard  = document.getElementById(`card-${alumnoAbierto}`);
        if (prevPanel) prevPanel.classList.remove("open");
        if (prevArrow) prevArrow.classList.remove("open");
        if (prevCard)  prevCard.classList.remove("active");
    }

    // Abrir el nuevo
    panel.classList.add("open");
    arrow.classList.add("open");
    card.classList.add("active");
    alumnoAbierto = id;

    // Scroll suave hacia la card
    setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
}

function registrarPago(alumnoId) {
    const tipo     = document.getElementById(`tipo-${alumnoId}`).value;
    const concepto = document.getElementById(`concepto-${alumnoId}`).value.trim();
    const monto    = document.getElementById(`monto-${alumnoId}`).value;
    const fecha    = document.getElementById(`fecha-${alumnoId}`).value;
    const metodo   = document.getElementById(`metodo-${alumnoId}`).value;

    if (!tipo)     { alert("Selecciona el tipo de pago.");   return; }
    if (!concepto) { alert("Ingresa el concepto o periodo."); return; }
    if (!monto)    { alert("Ingresa el monto.");             return; }
    if (!metodo)   { alert("Selecciona el método de pago."); return; }

    const alumno = alumnos.find(a => a.id === alumnoId);

    // Agregar al historial en memoria
    if (!historialPagos[alumnoId]) historialPagos[alumnoId] = [];
    historialPagos[alumnoId].unshift({
        tipo, concepto, monto: parseFloat(monto),
        fecha: fecha ? new Date(fecha).toLocaleDateString("es-MX", { day:"2-digit", month:"2-digit", year:"numeric" }) : null,
        metodo, estado: "pagado"
    });

    // Refrescar historial en el panel
    document.querySelector(`#panel-${alumnoId} .historial-wrapper`).innerHTML = renderHistorial(alumnoId);

    // Limpiar el formulario
    document.getElementById(`tipo-${alumnoId}`).value    = "";
    document.getElementById(`concepto-${alumnoId}`).value = "";
    document.getElementById(`monto-${alumnoId}`).value   = "";
    document.getElementById(`metodo-${alumnoId}`).value  = "";

    // Actualizar resumen
    renderSummary();

    alert(`✔ Pago de ${tipo} registrado para ${alumno.nombre}`);
}

// ── TAB PENDIENTES ──
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
            <td><span class="dias-badge ${p.dias > 20 ? 'dias-alto' : 'dias-medio'}">${p.dias} días</span></td>
            <td><button class="btn-table btn-table-pay">✔ Marcar pagado</button></td>
        </tr>`;
    });
}

// ── BUSCADOR ──
document.getElementById("buscador-alumnos").addEventListener("input", function () {
    alumnoAbierto = null;
    renderAlumnos(this.value);
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
renderAlumnos();
renderPendientes();