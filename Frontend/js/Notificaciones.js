const API = "http://localhost:3000/api";

function getToken() { return localStorage.getItem('token'); }

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'Loginindex.html'; return; }
  renderLista();
});

let notificaciones = [
  { id: 0, tipo: 'recordatorio', icono: 'blue', titulo: 'Recordatorio de cita', descripcion: 'Tienes una cita de Medicina general mañana a las 10:30 AM.', fecha: 'Hoy, 09:15 AM', tag: 'no-leida', tagLabel: 'No leída', leida: false, archivada: false },
  { id: 1, tipo: 'recordatorio', icono: 'orange', titulo: 'Cita reprogramada', descripcion: 'Tu cita de Dermatología fue reprogramada.', fecha: 'Ayer, 04:32 PM', tag: 'importante', tagLabel: 'Importante', leida: false, archivada: false },
  { id: 2, tipo: 'sistema', icono: 'green', titulo: 'Confirmación de cita', descripcion: 'Tu cita médica fue confirmada correctamente.', fecha: 'Hace 2 días', tag: 'leida', tagLabel: 'Leída', leida: true, archivada: false },
  { id: 3, tipo: 'sistema', icono: 'teal', titulo: 'Actualización de seguridad', descripcion: 'Tu contraseña fue actualizada correctamente.', fecha: 'Hace 3 días', tag: 'sistema', tagLabel: 'Sistema', leida: true, archivada: false }
];

let filtroActivo = 'todas';

function renderLista() {
  const contenedor = document.getElementById('lista-notificaciones');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  let lista = notificaciones.filter(n => !n.archivada);
  if (filtroActivo === 'no-leida')         lista = lista.filter(n => !n.leida);
  else if (filtroActivo === 'recordatorio') lista = lista.filter(n => n.tipo === 'recordatorio');
  else if (filtroActivo === 'sistema')      lista = lista.filter(n => n.tipo === 'sistema');

  if (lista.length === 0) {
    contenedor.innerHTML = `<div style="text-align:center;padding:3rem 1rem;color:#9ca3af;"><p style="font-size:0.875rem;font-weight:500;">No hay notificaciones en esta categoría.</p></div>`;
    return;
  }

  lista.forEach(n => {
    const div = document.createElement('div');
    div.classList.add('notif-list-item');
    if (!n.leida) div.classList.add('unread');
    div.innerHTML = `
      <div class="notif-punto ${n.leida ? 'oculto' : ''}"></div>
      <div class="notif-list-icono ${n.icono}">🔔</div>
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
      </div>
    `;
    contenedor.appendChild(div);
  });

  actualizarContadores();
}

function filtrar(tipo, btn) {
  filtroActivo = tipo;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderLista();
}

function marcarLeida(id) {
  const n = notificaciones.find(n => n.id === id);
  if (!n) return;
  n.leida = !n.leida;
  n.tag      = n.leida ? 'leida'  : 'no-leida';
  n.tagLabel = n.leida ? 'Leída' : 'No leída';
  renderLista();
  mostrarAlerta('success', n.leida ? 'Marcada como leída' : 'Marcada como no leída', '');
}

function archivar(id) {
  const n = notificaciones.find(n => n.id === id);
  if (!n) return;
  n.archivada = true;
  renderLista();
  mostrarAlerta('info', 'Notificación archivada', 'La notificación fue archivada correctamente.');
}

function marcarTodasLeidas() {
  notificaciones.forEach(n => { n.leida = true; n.tag = 'leida'; n.tagLabel = 'Leída'; });
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
  renderLista();
  mostrarAlerta('success', 'Todas leídas', 'Todas las notificaciones fueron marcadas como leídas.');
}

function actualizarContadores() {
  const noLeidas = notificaciones.filter(n => !n.leida && !n.archivada).length;
  const countEl  = document.getElementById('count-noleidas');
  if (countEl) countEl.textContent = noLeidas;
  const badge = document.getElementById('notif-badge');
  if (badge) { badge.style.display = noLeidas > 0 ? 'flex' : 'none'; badge.textContent = noLeidas; }
}

function toggleNotif() { document.getElementById('notif-dropdown')?.classList.toggle('active'); }

document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.notif-wrap');
  const drop = document.getElementById('notif-dropdown');
  if (wrap && drop && !wrap.contains(e.target)) drop.classList.remove('active');
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
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `<div class="alerta-icono">${iconos[tipo] || iconos.info}</div><div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>`;
  alerta.style.display = 'flex';
  setTimeout(() => alerta.style.display = 'none', 4000);
}