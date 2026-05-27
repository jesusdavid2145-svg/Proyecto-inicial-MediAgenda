const API = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  const u = localStorage.getItem('usuario');
  return u ? JSON.parse(u) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'Loginindex.html'; return; }
  cargarEspecialidades();
  cargarSedes();
  renderCalendario();
  renderHorarios();
});

async function cargarEspecialidades() {
  try {
    const res  = await fetch(`${API}/medicos/especialidades`);
    const data = await res.json();
    const select = document.getElementById('especialidad');
    if (!select) return;
    data.forEach(e => {
      const opt = document.createElement('option');
      opt.value       = e.id;
      opt.textContent = e.nombre;
      select.appendChild(opt);
    });
  } catch (err) { console.error('Error cargando especialidades:', err); }
}

async function cargarMedicos() {
  const selectMedico = document.getElementById('medico');
  if (!selectMedico) return;
  selectMedico.innerHTML = '<option value="">Selecciona un médico</option>';

  try {
    const res    = await fetch(`${API}/medicos`);
    const medicos = await res.json();
    medicos.forEach(m => {
      const opt = document.createElement('option');
      opt.value       = m.id;
      opt.textContent = `${m.nombre} ${m.apellido}`;
      selectMedico.appendChild(opt);
    });
  } catch (err) { console.error('Error cargando médicos:', err); }

  actualizarRecomendaciones();
  actualizarResumen();
}

async function cargarSedes() {
  try {
    const res  = await fetch(`${API}/medicos/sedes`);
    const data = await res.json();
    const select = document.getElementById('sede');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una sede</option>';
    data.forEach(s => {
      const opt = document.createElement('option');
      opt.value       = s.id;
      opt.textContent = s.nombre;
      select.appendChild(opt);
    });
  } catch (err) { console.error('Error cargando sedes:', err); }
}

function toggleSede() {
  const modalidad = document.getElementById('modalidad')?.value;
  const campoSede = document.getElementById('campo-sede');
  const mapaCard  = document.getElementById('mapa-card');
  if (modalidad === 'virtual' || modalidad === 'domiciliaria') {
    if (campoSede) campoSede.style.display = 'none';
    if (mapaCard)  mapaCard.style.display  = 'none';
  } else {
    if (campoSede) campoSede.style.display = 'flex';
  }
  actualizarResumen();
}

let mapaVisible = false;
function toggleMapa() {
  const sede = document.getElementById('sede')?.value;
  if (!sede) { alert('Por favor selecciona una sede primero.'); return; }
  mapaVisible = !mapaVisible;
  const mapaCard = document.getElementById('mapa-card');
  if (mapaCard) mapaCard.style.display = mapaVisible ? 'block' : 'none';
}

// =====================
// CALENDARIO
// =====================
const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let fechaActual     = new Date();
let diaSeleccionado = null;

function renderCalendario() {
  const titulo = document.getElementById('cal-titulo');
  const grid   = document.getElementById('cal-dias');
  if (!titulo || !grid) return;

  titulo.textContent = `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
  grid.innerHTML = '';

  const hoy       = new Date();
  const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  const diasEnMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const offset    = primerDia === 0 ? 6 : primerDia - 1;

  for (let i = 0; i < offset; i++) {
    const vacio = document.createElement('div');
    vacio.classList.add('cal-dia', 'vacio');
    grid.appendChild(vacio);
  }

  for (let d = 1; d <= diasEnMes; d++) {
    const dia      = document.createElement('div');
    const fechaDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), d);
    const fechaStr = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    dia.classList.add('cal-dia');
    dia.textContent = d;

    if (fechaDia < hoy && fechaDia.toDateString() !== hoy.toDateString()) {
      dia.classList.add('no-disponible');
    } else {
      dia.classList.add('disponible');
      dia.addEventListener('click', () => {
        diaSeleccionado = fechaStr;
        renderCalendario();
        actualizarResumen();
      });
    }

    if (diaSeleccionado === fechaStr) dia.classList.add('seleccionado');
    grid.appendChild(dia);
  }
}

function mesAnterior() { fechaActual.setMonth(fechaActual.getMonth() - 1); renderCalendario(); }
function mesSiguiente() { fechaActual.setMonth(fechaActual.getMonth() + 1); renderCalendario(); }

// =====================
// HORARIOS
// =====================
const horariosTodos = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00'
];
let horarioSeleccionado = null;

function renderHorarios() {
  const grid = document.getElementById('horarios-grid');
  if (!grid) return;
  grid.innerHTML = '';
  horariosTodos.forEach(h => {
    const btn = document.createElement('button');
    btn.classList.add('horario-btn');
    btn.textContent = h;
    if (h === horarioSeleccionado) btn.classList.add('active');
    btn.addEventListener('click', () => {
      horarioSeleccionado = h;
      renderHorarios();
      actualizarResumen();
    });
    grid.appendChild(btn);
  });
}

function contarCaracteres() {
  const motivo = document.getElementById('motivo');
  const count  = document.getElementById('char-count');
  if (motivo && count) count.textContent = `${motivo.value.length}/200`;
}

function actualizarRecomendaciones() {
  const recDiv = document.getElementById('recomendaciones');
  if (recDiv) recDiv.style.display = 'none';
}

function actualizarResumen() {
  const especialidadEl = document.getElementById('especialidad');
  const medicoEl       = document.getElementById('medico');
  const modalidadEl    = document.getElementById('modalidad');
  const sedeEl         = document.getElementById('sede');

  const resEsp  = document.getElementById('resumen-especialidad');
  const resMed  = document.getElementById('resumen-medico');
  const resFech = document.getElementById('resumen-fecha');
  const resHora = document.getElementById('resumen-hora');
  const resMod  = document.getElementById('resumen-modalidad');
  const resSede = document.getElementById('resumen-sede');

  if (resEsp)  resEsp.textContent  = especialidadEl?.options[especialidadEl.selectedIndex]?.text || '— Selecciona';
  if (resMed)  resMed.textContent  = medicoEl?.options[medicoEl.selectedIndex]?.text             || '— Selecciona';
  if (resFech) resFech.textContent = diaSeleccionado    || '— Selecciona';
  if (resHora) resHora.textContent = horarioSeleccionado || '— Selecciona';
  if (resMod)  resMod.textContent  = modalidadEl?.options[modalidadEl.selectedIndex]?.text       || '— Selecciona';
  if (resSede) resSede.textContent = sedeEl?.options[sedeEl.selectedIndex]?.text                 || '— Selecciona';
}

// =====================
// AGENDAR CITA
// =====================
async function agendarCita() {
  const medicoId  = document.getElementById('medico')?.value;
  const sedeId    = document.getElementById('sede')?.value;
  const modalidad = document.getElementById('modalidad')?.value;
  const motivo    = document.getElementById('motivo')?.value.trim();

  if (!medicoId || !diaSeleccionado || !horarioSeleccionado || !modalidad) {
    mostrarAlerta('Campos incompletos', 'Debes seleccionar médico, fecha, hora y modalidad.');
    return;
  }

  try {
    const res = await fetch(`${API}/citas`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({
        id_medico: parseInt(medicoId),
        id_sede:   sedeId ? parseInt(sedeId) : null,
        modalidad,
        fecha:     diaSeleccionado,
        hora:      horarioSeleccionado,
        motivo
      })
    });

    const data = await res.json();
    if (!res.ok) { mostrarAlerta('Error', data.error || 'No se pudo agendar la cita.'); return; }

    alert('✅ Cita agendada correctamente.');
    window.location.href = 'Gestioncitas.html';

  } catch (err) {
    mostrarAlerta('Error de conexión', 'No se pudo conectar con el servidor.');
  }
}

function mostrarAlerta(titulo, mensaje) {
  const alerta = document.getElementById('alerta');
  if (!alerta) return;
  alerta.className = 'alerta alerta-warning';
  alerta.innerHTML = `
    <div class="alerta-icono" style="background:#fb923c;">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
    <div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>
  `;
  alerta.style.display = 'flex';
  alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function limpiarAlerta() {
  const alerta = document.getElementById('alerta');
  if (alerta) alerta.style.display = 'none';
}

function filtrarCitas() { cargarMedicos(); }