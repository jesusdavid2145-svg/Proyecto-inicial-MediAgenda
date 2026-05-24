// =====================
// DATOS DE REPORTES
// =====================
const reportes = [
  {
    fecha: '27 May 2025, 10:32 AM',
    tipo: 'Resumen de citas',
    rango: '01 May - 31 May 2025',
    generadoPor: 'Jesús Ramírez',
    iniciales: 'JR',
    estado: 'completado',
    formato: 'pdf'
  },
  {
    fecha: '26 May 2025, 04:15 PM',
    tipo: 'Actividad de médicos',
    rango: '01 May - 31 May 2025',
    generadoPor: 'María Ramírez',
    iniciales: 'MR',
    estado: 'completado',
    formato: 'excel'
  },
  {
    fecha: '25 May 2025, 09:08 AM',
    tipo: 'Citas por especialidad',
    rango: '01 May - 31 May 2025',
    generadoPor: 'Felipe Ruiz',
    iniciales: 'FR',
    estado: 'en-proceso',
    formato: 'pdf'
  },
  {
    fecha: '20 May 2025, 11:20 AM',
    tipo: 'Nuevos pacientes',
    rango: '01 May - 31 May 2025',
    generadoPor: 'Ana Torres',
    iniciales: 'AT',
    estado: 'completado',
    formato: 'excel'
  },
  {
    fecha: '15 May 2025, 02:30 PM',
    tipo: 'Ingresos por servicios',
    rango: '01 Abr - 30 Abr 2025',
    generadoPor: 'Jesús Ramírez',
    iniciales: 'JR',
    estado: 'completado',
    formato: 'pdf'
  }
];

// =====================
// RENDERIZAR TABLA
// =====================
function renderTabla() {
  const tbody = document.getElementById('tabla-reportes');
  tbody.innerHTML = '';

  reportes.forEach((r, i) => {
    const iconoFormato = r.formato === 'pdf'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

    const estadoLabel = {
      'completado': 'Completado',
      'en-proceso': 'En proceso',
      'error':      'Error'
    };

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.82rem; white-space:nowrap;">${r.fecha}</td>
      <td style="font-weight:500;">${r.tipo}</td>
      <td style="font-size:0.82rem; color:#6b7280; white-space:nowrap;">${r.rango}</td>
      <td>
        <div class="generado-cell">
          <div class="gen-avatar">${r.iniciales}</div>
          ${r.generadoPor}
        </div>
      </td>
      <td><span class="estado-reporte ${r.estado}">${estadoLabel[r.estado]}</span></td>
      <td>
        <div class="formato-cell ${r.formato === 'pdf' ? 'formato-pdf' : 'formato-excel'}">
          ${iconoFormato}
          ${r.formato.toUpperCase()}
        </div>
      </td>
      <td>
        <div class="acciones-cell">
          <button class="btn-descargar" onclick="descargarReporte(${i})" title="Descargar" ${r.estado !== 'completado' ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button class="btn-opciones" title="Más opciones">⋮</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =====================
// GRÁFICA DE BARRAS
// =====================
function renderGraficaBarras() {
  const canvas = document.getElementById('grafica-barras');
  const ctx    = canvas.getContext('2d');

  const datos = [260, 198, 156, 142, 130, 94, 82, 55];
  const labels = ['Medicina\ngeneral', 'Dermatología', 'Cardiología', 'Ortopedia', 'Ginecología', 'Pediatría', 'Oftalmología', 'Otras'];
  const max    = Math.max(...datos);

  canvas.width  = canvas.parentElement.offsetWidth || 400;
  canvas.height = 200;

  const w      = canvas.width;
  const h      = canvas.height;
  const padL   = 30;
  const padR   = 10;
  const padT   = 20;
  const padB   = 45;
  const barW   = (w - padL - padR) / datos.length - 8;

  ctx.clearRect(0, 0, w, h);

  // Líneas de referencia
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + ((h - padT - padB) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.font      = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padL - 4, y + 3);
  }

  // Barras
  datos.forEach((val, i) => {
    const x    = padL + i * ((w - padL - padR) / datos.length) + 4;
    const barH = ((h - padT - padB) * val) / max;
    const y    = h - padB - barH;

    // Gradiente
    const grad = ctx.createLinearGradient(0, y, 0, h - padB);
    grad.addColorStop(0, '#1a56db');
    grad.addColorStop(1, '#60a5fa');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Valor encima
    ctx.fillStyle = '#374151';
    ctx.font      = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val, x + barW / 2, y - 4);

    // Label abajo
    ctx.fillStyle = '#6b7280';
    ctx.font      = '9px Plus Jakarta Sans, sans-serif';
    const lineas = labels[i].split('\n');
    lineas.forEach((l, li) => {
      ctx.fillText(l, x + barW / 2, h - padB + 12 + li * 11);
    });
  });
}

// =====================
// GRÁFICA DE LÍNEA
// =====================
function renderGraficaLinea() {
  const canvas = document.getElementById('grafica-linea');
  const ctx    = canvas.getContext('2d');

  const datos  = [180, 196, 210, 185, 210, 150, 117];
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const max    = Math.max(...datos) + 30;

  canvas.width  = canvas.parentElement.offsetWidth || 400;
  canvas.height = 200;

  const w    = canvas.width;
  const h    = canvas.height;
  const padL = 35;
  const padR = 15;
  const padT = 20;
  const padB = 35;

  ctx.clearRect(0, 0, w, h);

  const stepX = (w - padL - padR) / (datos.length - 1);
  const getY  = val => padT + ((h - padT - padB) * (1 - val / max));

  // Líneas de referencia
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + ((h - padT - padB) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#9ca3af';
    ctx.font      = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padL - 4, y + 3);
  }

  // Área rellena
  ctx.beginPath();
  datos.forEach((val, i) => {
    const x = padL + i * stepX;
    const y = getY(val);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(padL + (datos.length - 1) * stepX, h - padB);
  ctx.lineTo(padL, h - padB);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, h - padB);
  grad.addColorStop(0, 'rgba(26,86,219,0.15)');
  grad.addColorStop(1, 'rgba(26,86,219,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Línea
  ctx.beginPath();
  ctx.strokeStyle = '#1a56db';
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  datos.forEach((val, i) => {
    const x = padL + i * stepX;
    const y = getY(val);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Puntos y valores
  datos.forEach((val, i) => {
    const x = padL + i * stepX;
    const y = getY(val);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle   = '#fff';
    ctx.strokeStyle = '#1a56db';
    ctx.lineWidth   = 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#374151';
    ctx.font      = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val, x, y - 10);

    // Label
    ctx.fillStyle = '#6b7280';
    ctx.fillText(labels[i], x, h - padB + 15);
  });
}

// =====================
// GENERAR REPORTE
// =====================
function generarReporte() {
  const fecha       = document.getElementById('filtro-fecha').value;
  const medico      = document.getElementById('filtro-medico').value;
  const estado      = document.getElementById('filtro-estado').value;
  const especialidad = document.getElementById('filtro-especialidad').value;
  const modalidad   = document.getElementById('filtro-modalidad').value;

  // Simular que no hay datos con filtros muy específicos
  if (medico && estado && especialidad) {
    mostrarAlerta('warning', 'Sin datos disponibles', 'No se encontraron registros con los filtros seleccionados. Intenta con un rango más amplio.');
    return;
  }

  // Agregar nuevo reporte a la tabla
  const nuevoReporte = {
    fecha: new Date().toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    tipo: 'Reporte personalizado',
    rango: document.getElementById('filtro-fecha').options[document.getElementById('filtro-fecha').selectedIndex].text,
    generadoPor: 'Jesús Ramírez',
    iniciales: 'JR',
    estado: 'completado',
    formato: 'pdf'
  };

  reportes.unshift(nuevoReporte);
  renderTabla();
  mostrarAlerta('success', 'Reporte generado exitosamente', 'El reporte ha sido generado y está disponible para descargar.');
}

// =====================
// LIMPIAR FILTROS
// =====================
function limpiarFiltros() {
  document.getElementById('filtro-fecha').selectedIndex       = 0;
  document.getElementById('filtro-medico').selectedIndex      = 0;
  document.getElementById('filtro-estado').selectedIndex      = 0;
  document.getElementById('filtro-especialidad').selectedIndex = 0;
  document.getElementById('filtro-modalidad').selectedIndex   = 0;
  mostrarAlerta('info', 'Filtros limpiados', 'Todos los filtros han sido restablecidos a sus valores predeterminados.');
}

// =====================
// EXPORTAR
// =====================
function toggleExportar() {
  const drop = document.getElementById('exportar-dropdown');
  drop.style.display = drop.style.display === 'none' ? 'block' : 'none';
}

function exportar(formato) {
  document.getElementById('exportar-dropdown').style.display = 'none';
  mostrarAlerta('success',
    `Exportando en ${formato.toUpperCase()}`,
    `El reporte se está generando en formato ${formato.toUpperCase()}. La descarga iniciará en breve.`
  );
}

// =====================
// DESCARGAR REPORTE
// =====================
function descargarReporte(idx) {
  const r = reportes[idx];
  if (r.estado !== 'completado') {
    mostrarAlerta('error', 'No disponible', 'Este reporte aún no está listo para descargar.');
    return;
  }
  mostrarAlerta('success', 'Descarga iniciada', `Descargando "${r.tipo}" en formato ${r.formato.toUpperCase()}.`);
}

// =====================
// ACCIONES RÁPIDAS
// =====================
function programarReporte(e) {
  e.preventDefault();
  mostrarAlerta('success', 'Exportación programada', 'Tu reporte automático ha sido programado exitosamente para el 01 Jun 2025 a las 06:00 AM.');
}

function crearReporte(e) {
  e.preventDefault();
  mostrarAlerta('info', 'Crear reporte personalizado', 'Esta funcionalidad estará disponible próximamente.');
}

function verDiccionario(e) {
  e.preventDefault();
  mostrarAlerta('info', 'Diccionario de datos', 'El diccionario de datos estará disponible próximamente.');
}

function configurarExportacion(e) {
  e.preventDefault();
  mostrarAlerta('success', 'Configuración guardada', 'La exportación automática ha sido configurada correctamente.');
}

// =====================
// ALERTAS
// =====================
function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta-global');

  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };

  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-icono">${iconos[tipo]}</div>
    <div class="alerta-texto">
      <strong>${titulo}</strong>
      <span>${mensaje}</span>
    </div>
  `;
  alerta.style.display = 'flex';
  alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => { alerta.style.display = 'none'; }, 5000);
}

// =====================
// NOTIFICACIONES
// =====================
function toggleNotif() {
  const notif = document.getElementById('notif-dropdown');
  notif.classList.toggle('active');
}

function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
  const sidebarBadge = document.querySelector('.nav-item .badge');
  if (sidebarBadge) sidebarBadge.style.display = 'none';
}

document.addEventListener('click', function (e) {
  const notifWrap = document.querySelector('.notif-wrap');
  const notifDrop = document.getElementById('notif-dropdown');
  const expWrap   = document.querySelector('.btn-exportar-wrap');
  const expDrop   = document.getElementById('exportar-dropdown');

  if (notifWrap && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
  if (expWrap && !expWrap.contains(e.target)) {
    expDrop.style.display = 'none';
  }
});

// =====================
// INICIALIZAR
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderTabla();
  setTimeout(() => {
    renderGraficaBarras();
    renderGraficaLinea();
  }, 100);
});

window.addEventListener('resize', () => {
  renderGraficaBarras();
  renderGraficaLinea();
});