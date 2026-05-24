// =====================
// DATOS DE NOTIFICACIONES
// =====================
let notificaciones = [
  {
    id: 0,
    tipo: 'recordatorio',
    icono: 'blue',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    titulo: 'Recordatorio de cita',
    descripcion: 'Tienes una cita de Medicina general mañana a las 10:30 AM con la Dra. Laura Gómez.',
    fecha: '31 May 2025, 09:15 AM',
    tag: 'no-leida',
    tagLabel: 'No leída',
    leida: false,
    archivada: false
  },
  {
    id: 1,
    tipo: 'recordatorio',
    icono: 'orange',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    titulo: 'Cita reprogramada',
    descripcion: 'Tu cita de Dermatología fue reprogramada para el 03 Jun 2025 a las 09:00 AM.',
    fecha: '30 May 2025, 04:32 PM',
    tag: 'importante',
    tagLabel: 'Importante',
    leida: false,
    archivada: false
  },
  {
    id: 2,
    tipo: 'sistema',
    icono: 'purple',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    titulo: 'Resultados disponibles',
    descripcion: 'Ya puedes consultar tus resultados de laboratorio en tu historial clínico.',
    fecha: '30 May 2025, 11:08 AM',
    tag: 'nueva',
    tagLabel: 'Nueva',
    leida: false,
    archivada: false
  },
  {
    id: 3,
    tipo: 'recordatorio',
    icono: 'green',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    titulo: 'Confirmación de cita',
    descripcion: 'Tu cita médica fue confirmada correctamente.',
    fecha: '29 May 2025, 03:20 PM',
    tag: 'leida',
    tagLabel: 'Leída',
    leida: true,
    archivada: false
  },
  {
    id: 4,
    tipo: 'sistema',
    icono: 'teal',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    titulo: 'Actualización de seguridad',
    descripcion: 'Tu contraseña fue actualizada correctamente.',
    fecha: '29 May 2025, 09:45 AM',
    tag: 'sistema',
    tagLabel: 'Sistema',
    leida: true,
    archivada: false
  },
  {
    id: 5,
    tipo: 'sistema',
    icono: 'gray',
    iconoSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    titulo: 'Reporte generado',
    descripcion: 'El reporte administrativo solicitado ya está disponible para descarga.',
    fecha: '28 May 2025, 02:18 PM',
    tag: 'completado',
    tagLabel: 'Completado',
    leida: true,
    archivada: false
  }
];

let filtroActivo = 'todas';

// =====================
// RENDERIZAR LISTA
// =====================
function renderLista() {
  const contenedor = document.getElementById('lista-notificaciones');
  contenedor.innerHTML = '';

  let lista = notificaciones.filter(n => !n.archivada);

  if (filtroActivo === 'no-leida') {
    lista = lista.filter(n => !n.leida);
  } else if (filtroActivo === 'recordatorio') {
    lista = lista.filter(n => n.tipo === 'recordatorio');
  } else if (filtroActivo === 'sistema') {
    lista = lista.filter(n => n.tipo === 'sistema');
  }

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:#9ca3af;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40" style="margin:0 auto 0.75rem; display:block; opacity:0.4;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <p style="font-size:0.875rem; font-weight:500;">No hay notificaciones en esta categoría.</p>
      </div>
    `;
    return;
  }

  lista.forEach(n => {
    const div = document.createElement('div');
    div.classList.add('notif-list-item');
    if (!n.leida) div.classList.add('unread');

    div.innerHTML = `
      <div class="notif-punto ${n.leida ? 'oculto' : ''}"></div>
      <div class="notif-list-icono ${n.icono}">${n.iconoSvg}</div>
      <div class="notif-list-body">
        <p class="notif-list-titulo">${n.titulo}</p>
        <p class="notif-list-desc">${n.descripcion}</p>
        <div class="notif-list-meta">
          <span class="notif-list-fecha">${n.fecha}</span>
          <span class="notif-tag ${n.tag}">${n.tagLabel}</span>
        </div>
      </div>
      <div class="notif-list-acciones">
        <button class="btn-notif-accion" onclick="marcarLeida(${n.id})" title="${n.leida ? 'Marcar como no leída' : 'Marcar como leída'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="btn-notif-accion" onclick="archivar(${n.id})" title="Archivar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
        </button>
        <button class="btn-notif-accion" title="Más opciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  actualizarContadores();
}

// =====================
// FILTRAR
// =====================
function filtrar(tipo, btn) {
  filtroActivo = tipo;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderLista();
}

// =====================
// MARCAR LEÍDA
// =====================
function marcarLeida(id) {
  const n = notificaciones.find(n => n.id === id);
  if (!n) return;

  n.leida    = !n.leida;
  n.tag      = n.leida ? 'leida' : 'no-leida';
  n.tagLabel = n.leida ? 'Leída' : 'No leída';

  renderLista();
  mostrarAlerta('success',
    n.leida ? 'Marcada como leída' : 'Marcada como no leída',
    n.leida ? 'La notificación fue marcada como leída.' : 'La notificación fue marcada como no leída.'
  );
}

// =====================
// ARCHIVAR
// =====================
function archivar(id) {
  const n = notificaciones.find(n => n.id === id);
  if (!n) return;
  n.archivada = true;
  renderLista();
  mostrarAlerta('info', 'Notificación archivada', 'La notificación fue archivada correctamente.');
}

// =====================
// MARCAR TODAS LEÍDAS
// =====================
function marcarTodasLeidas() {
  notificaciones.forEach(n => {
    n.leida    = true;
    n.tag      = 'leida';
    n.tagLabel = 'Leída';
  });

  // Actualizar badge del header
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';

  // Actualizar badge sidebar
  const sidebarBadge = document.querySelector('.nav-item.active .badge');
  if (sidebarBadge) sidebarBadge.style.display = 'none';

  renderLista();
  mostrarAlerta('success', 'Todas leídas', 'Todas las notificaciones fueron marcadas como leídas.');
}

// =====================
// ACTUALIZAR CONTADORES
// =====================
function actualizarContadores() {
  const noLeidas = notificaciones.filter(n => !n.leida && !n.archivada).length;
  document.getElementById('count-noleidas').textContent = noLeidas;

  const badge = document.getElementById('notif-badge');
  if (badge) {
    if (noLeidas > 0) {
      badge.style.display = 'flex';
      badge.textContent   = noLeidas;
    } else {
      badge.style.display = 'none';
    }
  }

  // Badge sidebar
  const sidebarBadge = document.querySelector('.nav-item.active .badge');
  if (sidebarBadge) {
    if (noLeidas > 0) {
      sidebarBadge.style.display = 'inline';
      sidebarBadge.textContent   = noLeidas;
    } else {
      sidebarBadge.style.display = 'none';
    }
  }
}

// =====================
// ALERTAS
// =====================
function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta-global');

  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
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

  setTimeout(() => { alerta.style.display = 'none'; }, 4000);
}

// =====================
// NOTIF HEADER DROPDOWN
// =====================
function toggleNotif() {
  const notif = document.getElementById('notif-dropdown');
  notif.classList.toggle('active');
}

document.addEventListener('click', function (e) {
  const notifWrap = document.querySelector('.notif-wrap');
  const notifDrop = document.getElementById('notif-dropdown');
  if (notifWrap && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});

// =====================
// INICIALIZAR
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderLista();
});