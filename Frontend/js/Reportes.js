const API = "http://localhost:3000/api";

function getToken() { return localStorage.getItem('token'); }
function getUsuario() { const u = localStorage.getItem('usuario'); return u ? JSON.parse(u) : null; }

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'Loginindex.html'; return; }
  renderTabla();
  setTimeout(() => { renderGraficaBarras(); renderGraficaLinea(); }, 100);
});

const reportes = [
  { fecha: 'Hoy, 10:32 AM', tipo: 'Resumen de citas', rango: '01 May - 31 May 2026', generadoPor: 'Admin', iniciales: 'AD', estado: 'completado', formato: 'pdf' },
  { fecha: 'Ayer, 04:15 PM', tipo: 'Actividad de médicos', rango: '01 May - 31 May 2026', generadoPor: 'Sistema', iniciales: 'SI', estado: 'completado', formato: 'excel' },
  { fecha: 'Hace 2 días', tipo: 'Citas por especialidad', rango: '01 May - 31 May 2026', generadoPor: 'Sistema', iniciales: 'SI', estado: 'en-proceso', formato: 'pdf' }
];

function renderTabla() {
  const tbody = document.getElementById('tabla-reportes');
  if (!tbody) return;
  tbody.innerHTML = '';
  reportes.forEach((r, i) => {
    const estadoLabel = { 'completado': 'Completado', 'en-proceso': 'En proceso', 'error': 'Error' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.82rem;">${r.fecha}</td>
      <td style="font-weight:500;">${r.tipo}</td>
      <td style="font-size:0.82rem;color:#6b7280;">${r.rango}</td>
      <td><div class="generado-cell"><div class="gen-avatar">${r.iniciales}</div>${r.generadoPor}</div></td>
      <td><span class="estado-reporte ${r.estado}">${estadoLabel[r.estado]}</span></td>
      <td><div class="formato-cell formato-${r.formato}">${r.formato.toUpperCase()}</div></td>
      <td>
        <div class="acciones-cell">
          <button class="btn-descargar" onclick="descargarReporte(${i})" title="Descargar" ${r.estado !== 'completado' ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function generarReporte() {
  try {
    const res   = await fetch(`${API}/citas`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    const citas = await res.json();
    if (!res.ok) { mostrarAlerta('error', 'Error', 'No se pudieron obtener los datos.'); return; }

    const usuario = getUsuario();
    const nuevoReporte = {
      fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      tipo:  'Reporte de citas',
      rango: 'Todas las fechas',
      generadoPor: usuario?.nombre || 'Admin',
      iniciales: `${usuario?.nombre?.[0] || 'A'}${usuario?.apellido?.[0] || ''}`.toUpperCase(),
      estado: 'completado',
      formato: 'pdf'
    };
    reportes.unshift(nuevoReporte);
    renderTabla();
    mostrarAlerta('success', 'Reporte generado', `Se encontraron ${citas.length} citas en el sistema.`);
  } catch (err) {
    mostrarAlerta('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
  }
}

function limpiarFiltros() {
  ['filtro-fecha','filtro-medico','filtro-estado','filtro-especialidad','filtro-modalidad'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  mostrarAlerta('info', 'Filtros limpiados', 'Todos los filtros fueron restablecidos.');
}

function toggleExportar() {
  const drop = document.getElementById('exportar-dropdown');
  if (drop) drop.style.display = drop.style.display === 'none' ? 'block' : 'none';
}

function exportar(formato) {
  const drop = document.getElementById('exportar-dropdown');
  if (drop) drop.style.display = 'none';
  mostrarAlerta('success', `Exportando en ${formato.toUpperCase()}`, 'La descarga iniciará en breve.');
}

function descargarReporte(idx) {
  const r = reportes[idx];
  if (r.estado !== 'completado') { mostrarAlerta('error', 'No disponible', 'Este reporte aún no está listo.'); return; }
  mostrarAlerta('success', 'Descarga iniciada', `Descargando "${r.tipo}" en ${r.formato.toUpperCase()}.`);
}

function programarReporte(e) { e.preventDefault(); mostrarAlerta('success', 'Reporte programado', 'Tu reporte automático ha sido programado.'); }
function crearReporte(e) { e.preventDefault(); mostrarAlerta('info', 'Próximamente', 'Esta funcionalidad estará disponible pronto.'); }
function verDiccionario(e) { e.preventDefault(); mostrarAlerta('info', 'Diccionario', 'El diccionario de datos estará disponible pronto.'); }
function configurarExportacion(e) { e.preventDefault(); mostrarAlerta('success', 'Configuración guardada', 'La exportación automática fue configurada.'); }

function renderGraficaBarras() {
  const canvas = document.getElementById('grafica-barras');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const datos  = [260, 198, 156, 142, 130, 94, 82, 55];
  const labels = ['Medicina\ngeneral', 'Dermatología', 'Cardiología', 'Ortopedia', 'Ginecología', 'Pediatría', 'Neurología', 'Otras'];
  const max = Math.max(...datos);
  canvas.width  = canvas.parentElement.offsetWidth || 400;
  canvas.height = 200;
  const w = canvas.width, h = canvas.height, padL = 30, padR = 10, padT = 20, padB = 45;
  const barW = (w - padL - padR) / datos.length - 8;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + ((h - padT - padB) / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padL - 4, y + 3);
  }
  datos.forEach((val, i) => {
    const x = padL + i * ((w - padL - padR) / datos.length) + 4;
    const barH = ((h - padT - padB) * val) / max;
    const y = h - padB - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - padB);
    grad.addColorStop(0, '#1a56db'); grad.addColorStop(1, '#60a5fa');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(x, y, barW, barH, [4,4,0,0]); ctx.fill();
    ctx.fillStyle = '#374151'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(val, x + barW / 2, y - 4);
    ctx.fillStyle = '#6b7280'; ctx.font = '9px sans-serif';
    labels[i].split('\n').forEach((l, li) => ctx.fillText(l, x + barW / 2, h - padB + 12 + li * 11));
  });
}

function renderGraficaLinea() {
  const canvas = document.getElementById('grafica-linea');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const datos  = [180, 196, 210, 185, 210, 150, 117];
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const max = Math.max(...datos) + 30;
  canvas.width  = canvas.parentElement.offsetWidth || 400;
  canvas.height = 200;
  const w = canvas.width, h = canvas.height, padL = 35, padR = 15, padT = 20, padB = 35;
  const stepX = (w - padL - padR) / (datos.length - 1);
  const getY  = val => padT + ((h - padT - padB) * (1 - val / max));
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + ((h - padT - padB) / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), padL - 4, y + 3);
  }
  ctx.beginPath();
  datos.forEach((val, i) => { const x = padL + i * stepX, y = getY(val); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.lineTo(padL + (datos.length - 1) * stepX, h - padB); ctx.lineTo(padL, h - padB); ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, h - padB);
  grad.addColorStop(0, 'rgba(26,86,219,0.15)'); grad.addColorStop(1, 'rgba(26,86,219,0)');
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath(); ctx.strokeStyle = '#1a56db'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  datos.forEach((val, i) => { const x = padL + i * stepX, y = getY(val); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.stroke();
  datos.forEach((val, i) => {
    const x = padL + i * stepX, y = getY(val);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1a56db'; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#374151'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(val, x, y - 10);
    ctx.fillStyle = '#6b7280'; ctx.fillText(labels[i], x, h - padB + 15);
  });
}

window.addEventListener('resize', () => { renderGraficaBarras(); renderGraficaLinea(); });

function toggleNotif() { document.getElementById('notif-dropdown')?.classList.toggle('active'); }
function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
}

document.addEventListener('click', function(e) {
  const wrap    = document.querySelector('.notif-wrap');
  const drop    = document.getElementById('notif-dropdown');
  const expWrap = document.querySelector('.btn-exportar-wrap');
  const expDrop = document.getElementById('exportar-dropdown');
  if (wrap && drop && !wrap.contains(e.target)) drop.classList.remove('active');
  if (expWrap && expDrop && !expWrap.contains(e.target)) expDrop.style.display = 'none';
});

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'Loginindex.html';
}

function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta-global');
  if (!alerta) return;
  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `<div class="alerta-icono">${iconos[tipo] || iconos.info}</div><div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>`;
  alerta.style.display = 'flex';
  setTimeout(() => alerta.style.display = 'none', 5000);
}