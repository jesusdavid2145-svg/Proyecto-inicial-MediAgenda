// =====================
// DATOS DE CITAS
// =====================
let citas = [
  {
    id: 0,
    fecha: '27 May 2025',
    diaSemana: 'Martes',
    hora: '10:30 AM',
    especialidad: 'Medicina general',
    especialidadKey: 'medicina-general',
    medico: 'Dra. Laura Gómez',
    medicoIniciales: 'LG',
    modalidad: 'Presencial',
    sede: 'Sede Norte',
    consultorio: 'Consultorio 203',
    estado: 'programada',
    mes: 'mayo',
    proximaCita: true
  },
  {
    id: 1,
    fecha: '03 Jun 2025',
    diaSemana: 'Martes',
    hora: '11:00 AM',
    especialidad: 'Dermatología',
    especialidadKey: 'dermatologia',
    medico: 'Dra. María Solano',
    medicoIniciales: 'MS',
    modalidad: 'Virtual',
    sede: 'Videoconsulta',
    consultorio: '',
    estado: 'confirmada',
    mes: 'junio',
    proximaCita: false
  },
  {
    id: 2,
    fecha: '10 Jun 2025',
    diaSemana: 'Martes',
    hora: '04:00 PM',
    especialidad: 'Ortopedia',
    especialidadKey: 'ortopedia',
    medico: 'Dr. Felipe Ruiz',
    medicoIniciales: 'FR',
    modalidad: 'Presencial',
    sede: 'Sede Sur',
    consultorio: 'Consultorio 105',
    estado: 'cancelada',
    mes: 'junio',
    proximaCita: false
  },
  {
    id: 3,
    fecha: '17 Jun 2025',
    diaSemana: 'Martes',
    hora: '10:30 AM',
    especialidad: 'Ginecología',
    especialidadKey: 'ginecologia',
    medico: 'Dra. Ana Torres',
    medicoIniciales: 'AT',
    modalidad: 'Presencial',
    sede: 'Sede Norte',
    consultorio: 'Consultorio 203',
    estado: 'atendida',
    mes: 'junio',
    proximaCita: false
  },
  {
    id: 4,
    fecha: '24 Jun 2025',
    diaSemana: 'Martes',
    hora: '02:30 PM',
    especialidad: 'Cardiología',
    especialidadKey: 'cardiologia',
    medico: 'Dr. Andrés Gómez',
    medicoIniciales: 'AG',
    modalidad: 'Virtual',
    sede: 'Videoconsulta',
    consultorio: '',
    estado: 'pendiente',
    mes: 'junio',
    proximaCita: false
  }
];

let citaSeleccionada = null;

// =====================
// RENDERIZAR TABLA
// =====================
function renderTabla(lista) {
  const tbody = document.getElementById('tabla-citas');
  tbody.innerHTML = '';

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:#9ca3af; font-size:0.875rem;">
          No se encontraron citas con los filtros aplicados.
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach(cita => {
    const puedeModificar = cita.estado !== 'cancelada' && cita.estado !== 'atendida';
    const puedeCancelar  = cita.estado !== 'cancelada' && cita.estado !== 'atendida';

    const iconoModalidad = cita.modalidad === 'Virtual'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="fecha-cell">
          📅 ${cita.fecha}
          <small>${cita.diaSemana}</small>
        </div>
      </td>
      <td>${cita.hora}</td>
      <td>${cita.especialidad}</td>
      <td>
        <div class="medico-cell">
          <div class="avatar-sm">${cita.medicoIniciales}</div>
          ${cita.medico}
        </div>
      </td>
      <td>
        <div class="modalidad-cell">
          ${iconoModalidad}
          <div>
            <div>${cita.modalidad}</div>
            <small style="color:#9ca3af; font-size:0.75rem;">${cita.sede}</small>
          </div>
        </div>
      </td>
      <td><span class="estado ${cita.estado}">${capitalizar(cita.estado)}</span></td>
      <td>
        <div class="acciones-cell">
          <button class="btn-accion ver" onclick="verDetalle(${cita.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver
          </button>
          <button class="btn-accion modificar" onclick="abrirModificar(${cita.id})" ${!puedeModificar ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Modificar
          </button>
          <button class="btn-accion cancelar" onclick="abrirCancelar(${cita.id})" ${!puedeCancelar ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Cancelar
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====================
// FILTRAR CITAS
// =====================
function filtrarCitas() {
  const buscar      = document.getElementById('filtro-buscar').value.toLowerCase().trim();
  const fecha       = document.getElementById('filtro-fecha').value;
  const estado      = document.getElementById('filtro-estado').value;
  const especialidad = document.getElementById('filtro-especialidad').value;

  let resultado = citas.filter(c => {
    const coincideBuscar = !buscar ||
      c.medico.toLowerCase().includes(buscar) ||
      c.especialidad.toLowerCase().includes(buscar) ||
      c.sede.toLowerCase().includes(buscar);

    const coincideFecha       = !fecha       || c.mes === fecha;
    const coincideEstado      = !estado      || c.estado === estado;
    const coincideEspecialidad = !especialidad || c.especialidadKey === especialidad;

    return coincideBuscar && coincideFecha && coincideEstado && coincideEspecialidad;
  });

  renderTabla(resultado);
}

// =====================
// VER DETALLE
// =====================
function verDetalle(id) {
  const cita = citas.find(c => c.id === id);
  if (!cita) return;

  citaSeleccionada = cita;

  document.getElementById('modal-detalle-body').innerHTML = `
    <div class="detalle-grid">
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <div><span class="detalle-label">Paciente</span><p class="detalle-valor">Jesús Ramírez</p><p class="detalle-sub">CC 1.234.567.890</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <div><span class="detalle-label">Especialidad</span><p class="detalle-valor">${cita.especialidad}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <div><span class="detalle-label">Médico</span><p class="detalle-valor">${cita.medico}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <div><span class="detalle-label">Fecha</span><p class="detalle-valor">${cita.fecha} — ${cita.diaSemana}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div><span class="detalle-label">Hora</span><p class="detalle-valor">${cita.hora}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <div><span class="detalle-label">Modalidad</span><p class="detalle-valor">${cita.modalidad}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div><span class="detalle-label">Sede</span><p class="detalle-valor">${cita.sede}</p><p class="detalle-sub">${cita.consultorio}</p></div>
      </div>
      <div class="detalle-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div><span class="detalle-label">Estado</span><p><span class="estado ${cita.estado}">${capitalizar(cita.estado)}</span></p></div>
      </div>
    </div>
  `;

  abrirModal('modal-detalle');
}

// =====================
// MODIFICAR CITA
// =====================
function abrirModificar(id) {
  const cita = citas.find(c => c.id === id);
  if (!cita) return;

  if (cita.estado === 'cancelada' || cita.estado === 'atendida') {
    document.getElementById('modal-error-titulo').textContent = 'No se puede modificar';
    document.getElementById('modal-error-msg').textContent    =
      cita.estado === 'cancelada'
        ? 'No es posible modificar una cita que ya fue cancelada.'
        : 'No es posible modificar una cita que ya fue atendida.';
    abrirModal('modal-error');
    return;
  }

  // Verificar si es en menos de 24 horas (simulado con cita id 0)
  if (cita.id === 0) {
    mostrarAlertaGlobal('warning', 'Cita muy próxima', 'Tu cita es en menos de 24 horas. Para modificarla comunícate directamente con la clínica.');
    return;
  }

  citaSeleccionada = cita;
  abrirModal('modal-modificar');
}

function confirmarModificacion() {
  const nuevaFecha = document.getElementById('mod-fecha').options[document.getElementById('mod-fecha').selectedIndex].text;
  const nuevaHora  = document.getElementById('mod-hora').value;

  if (citaSeleccionada) {
    citaSeleccionada.fecha     = nuevaFecha.split(',')[1]?.trim() || citaSeleccionada.fecha;
    citaSeleccionada.diaSemana = nuevaFecha.split(',')[0]?.trim() || citaSeleccionada.diaSemana;
    citaSeleccionada.hora      = nuevaHora;
  }

  cerrarModal('modal-modificar');
  renderTabla(citas);
  mostrarAlertaGlobal('success', 'Cita modificada', 'Tu cita fue actualizada correctamente. Recibirás un correo de confirmación.');
}

// =====================
// CANCELAR CITA
// =====================
function abrirCancelar(id) {
  const cita = citas.find(c => c.id === id);
  if (!cita) return;

  if (cita.estado === 'cancelada' || cita.estado === 'atendida') {
    document.getElementById('modal-error-titulo').textContent = 'No se puede cancelar';
    document.getElementById('modal-error-msg').textContent    =
      cita.estado === 'cancelada'
        ? 'Esta cita ya fue cancelada anteriormente.'
        : 'No es posible cancelar una cita que ya fue atendida.';
    abrirModal('modal-error');
    return;
  }

  // Verificar si es en menos de 24 horas (simulado con cita id 0)
  if (cita.id === 0) {
    mostrarAlertaGlobal('warning', 'Cita muy próxima', 'Tu cita es en menos de 24 horas. Para cancelarla comunícate directamente con la clínica al número 601-123-4567.');
    return;
  }

  citaSeleccionada = cita;
  abrirModal('modal-cancelar');
}

function confirmarCancelacion() {
  if (citaSeleccionada) {
    citaSeleccionada.estado = 'cancelada';
  }

  cerrarModal('modal-cancelar');
  renderTabla(citas);
  mostrarAlertaGlobal('success', 'Cita cancelada', 'Tu cita fue cancelada exitosamente. Si deseas reagendar, puedes hacerlo desde Agendar cita.');
}

// =====================
// ALERTAS GLOBALES
// =====================
function mostrarAlertaGlobal(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta-global');

  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
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
// MODALES
// =====================
function abrirModal(id) {
  document.getElementById(id).classList.add('active');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Cerrar al clic fuera
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('active');
  });
});

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
  if (notifWrap && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});

// =====================
// INICIALIZAR
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderTabla(citas);
});