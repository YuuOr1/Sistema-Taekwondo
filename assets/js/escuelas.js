/* =====================================================
   escuelas.js — Lógica de la página de Escuelas
   - Ordenamiento por geolocalización (Haversine)
   - Inicialización de mapa Mapkick
   - Reveal de horarios al hover / clic
   ===================================================== */

'use strict';

/* ── Estado del mapa ────────────────────────────────────── */

let mapaInstancia = null;

/* ── Datos de escuelas ──────────────────────────────────── */

const ESCUELAS = [
    {
        id: 'libertad',
        nombre: 'Escuela Libertad',
        direccion: 'C. Dieciseis parte baja, Buena Vista, Tijuana',
        lat: 32.53335323360519,
        lng: -117.0086269558246,
        mapsUrl: 'https://maps.google.com/?q=32.53335323360519,-117.0086269558246',
        horario: [
            { dia: 'Lunes',     horas: '6:00 – 7:30 pm' },
            { dia: 'Miércoles', horas: '6:00 – 7:30 pm' },
            { dia: 'Viernes',   horas: '6:00 – 7:30 pm' },
            { dia: 'Sábado',    horas: '9:00 – 11:00 am' },
        ],
    },
    {
        id: 'soler',
        nombre: 'Escuela Soler',
        direccion: 'Ignacio Manuel Altamirano 4625, Tijuana',
        lat: 32.52942026725838,
        lng: -117.07299878785713,
        mapsUrl: 'https://maps.google.com/?q=32.52942026725838,-117.07299878785713',
        horario: [
            { dia: 'Lunes',     horas: '5:30 – 7:00 pm' },
            { dia: 'Miércoles', horas: '5:30 – 7:00 pm' },
            { dia: 'Viernes',   horas: '5:30 – 7:00 pm' },
            { dia: 'Sábado',    horas: '10:00 – 12:00 pm' },
        ],
    },
    {
        id: 'presa',
        nombre: 'Escuela Presa',
        direccion: 'Av. De Las Presas 10579, Tijuana',
        lat: 32.455121211316346,
        lng: -116.92028251854025,
        mapsUrl: 'https://maps.google.com/?q=32.455121211316346,-116.92028251854025',
        horario: [
            { dia: 'Martes',    horas: '6:00 – 7:30 pm' },
            { dia: 'Jueves',    horas: '6:00 – 7:30 pm' },
            { dia: 'Sábado',    horas: '8:00 – 10:00 am' },
        ],
    },
];

/* ── Fórmula de Haversine ───────────────────────────────── */

/**
 * Calcula la distancia en kilómetros entre dos puntos
 * geográficos usando la fórmula de Haversine.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distancia en km
 */
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Renderizar lista de escuelas ───────────────────────── */

function renderLista(escuelas) {
    const lista = document.getElementById('escuelas-list');
    if (!lista) return;

    lista.innerHTML = '';

    escuelas.forEach((esc, i) => {
        const item = document.createElement('li');
        item.className = 'escuela-item animate__animated animate__fadeInLeft';
        item.style.animationDelay = `${i * 0.09}s`;
        item.dataset.id = esc.id;

        const badgeHtml = esc.distanciaKm != null
            ? `<span class="escuela-item__badge is-visible">${esc.distanciaKm.toFixed(1)} km</span>`
            : `<span class="escuela-item__badge"></span>`;

        const scheduleRows = esc.horario.map(h => `
            <span class="escuela-item__day">${h.dia}</span>
            <span class="escuela-item__hours">${h.horas}</span>
        `).join('');

        item.innerHTML = `
            ${badgeHtml}
            <div class="escuela-item__body">
                <p class="escuela-item__number">0${i + 1}</p>
                <h3 class="escuela-item__name">${esc.nombre}</h3>
                <p class="escuela-item__address">${esc.direccion}</p>
            </div>
            <div class="escuela-item__schedule">
                <div class="escuela-item__schedule-inner">
                    <p class="escuela-item__schedule-title">Horarios</p>
                    <div class="escuela-item__schedule-grid">
                        ${scheduleRows}
                    </div>
                </div>
            </div>
        `;

        item.addEventListener('click', () => seleccionarEscuela(esc.id));
        lista.appendChild(item);
    });
}

/* ── Seleccionar escuela activa ─────────────────────────── */

function seleccionarEscuela(id) {
    document.querySelectorAll('.escuela-item').forEach(el => {
        el.classList.toggle('is-active', el.dataset.id === id);
    });

    // Actualizar enlace de Google Maps en el footer del mapa
    const esc = ESCUELAS.find(e => e.id === id);
    const gmapsLink = document.getElementById('gmaps-link');
    if (gmapsLink && esc) {
        gmapsLink.href = esc.mapsUrl;
        gmapsLink.textContent = `Ver ${esc.nombre} en Maps`;
    }
}

/* ── Inicializar mapa Mapkick ───────────────────────────── */

function initMapa(escuelas, userPos) {
    const loadingEl = document.getElementById('mapa-loading');

    // Puntos para el mapa (formato Mapkick)
    const puntos = escuelas.map(esc => ({
        latitude: esc.lat,
        longitude: esc.lng,
        label: esc.nombre,
        tooltip: `${esc.nombre} ${esc.direccion}`,
        color: '#C4253C',
    }));

    // Añadir posición del usuario si está disponible
    if (userPos) {
        puntos.push({
            latitude: userPos.lat,
            longitude: userPos.lng,
            label: 'Tu ubicación',
            tooltip: 'Tu ubicación',
            color: '#464DAC',
        });
    }

    // Si ya existe una instancia, destruirla y crear un div limpio
    if (mapaInstancia) {
        const contenedor = document.getElementById('mapa-container');
        if (contenedor) {
            contenedor.innerHTML = '';
        }
    }

    mapaInstancia = new Mapkick.Map('mapa-container', puntos, { zoom: 10 });

    // Ocultar pantalla de carga
    if (loadingEl) loadingEl.classList.add('is-hidden');
}

/* ── Geolocalización y ordenamiento ─────────────────────── */

function solicitarUbicacion() {
    const btn = document.getElementById('location-btn');
    const sortLabel = document.querySelector('.escuelas-panel__sort-label');

    if (!navigator.geolocation) {
        mostrarError('Tu navegador no soporta geolocalización.');
        return;
    }

    if (btn) {
        btn.textContent = 'Obteniendo ubicación…';
        btn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;

            // Calcular distancias
            const ordenadas = ESCUELAS
                .map(esc => ({
                    ...esc,
                    distanciaKm: haversine(latitude, longitude, esc.lat, esc.lng),
                }))
                .sort((a, b) => a.distanciaKm - b.distanciaKm);

            // Re-renderizar lista ordenada
            renderLista(ordenadas);

            if (sortLabel) sortLabel.classList.add('is-visible');
            if (btn) btn.style.display = 'none';

            // Seleccionar la más cercana automáticamente
            seleccionarEscuela(ordenadas[0].id);

            // Reiniciar mapa con posición del usuario
            initMapa(ordenadas, { lat: latitude, lng: longitude });
        },
        (err) => {
            let msg = 'No se pudo obtener tu ubicación.';
            if (err.code === err.PERMISSION_DENIED) {
                msg = 'Permiso de ubicación denegado.';
            }
            mostrarError(msg);
            if (btn) {
                btn.textContent = 'Encontrar mi escuela más cercana';
                btn.disabled = false;
            }
        },
        { timeout: 10000, maximumAge: 60000 }
    );
}

function mostrarError(mensaje) {
    // Toast simple no intrusivo
    const toast = document.createElement('div');
    toast.textContent = mensaje;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2.4rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1F276D',
        color: '#fff',
        padding: '1.2rem 2.4rem',
        borderRadius: '0.8rem',
        fontSize: '1.4rem',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        zIndex: '9999',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/* ── Bootstrap ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    // Renderizar lista sin orden de distancia inicialmente
    renderLista(ESCUELAS);

    // Inicializar mapa sin posición de usuario
    initMapa(ESCUELAS, null);

    // Evento del botón de geolocalización
    const locationBtn = document.getElementById('location-btn');
    if (locationBtn) {
        locationBtn.addEventListener('click', solicitarUbicacion);
    }

    // Seleccionar la primera escuela por defecto
    seleccionarEscuela(ESCUELAS[0].id);
});
