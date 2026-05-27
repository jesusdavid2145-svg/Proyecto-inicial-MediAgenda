const API = "http://localhost:3000/api";

function getToken() { return localStorage.getItem('token'); }
function getUsuario() { const u = localStorage.getItem('usuario'); return u ? JSON.parse(u) : null; }

const rolesNombres = { 'paciente': 'Paciente', 'medico': 'Médico tratante', 'administrador': 'Administrador' };

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'Loginindex.html'; return; }

  document.getElementById('verificacion-overlay').style.display = 'none';
  document.getElementById('contenido-principal').style.display  = 'block';

  const ahora = new Date();
  const fechaFormato = ahora.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  const usuario   = getUsuario();
  const rol       = usuario?.rol    || 'paciente';
  const rolNombre = rolesNombres[rol] || 'Paciente';

  const accRol   = document.getElementById('acc-rol');
  const accFecha = document.getElementById('acc-fecha');
  const profRol  = document.getElementById('profile-rol-text');
  const alertTxt = document.getElementById('alerta-acceso-texto');

  if (accRol)   accRol.textContent   = rolNombre;
  if (accFecha) accFecha.textContent = fechaFormato;
  if (profRol)  profRol.textContent  = rolNombre;
  if (alertTxt) alertTxt.textContent = `Acceso registrado como ${rolNombre} el ${fechaFormato}.`;

  configurarVistaPorRol(rol);
  cargarHistorial();
});

async function cargarHistorial() {
  try {
    const res  = await fetch(`${API}/citas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    const completadas = data.filter(c => c.estado === 'completada');
    const tbody = document.querySelector('.consultas-tabla tbody, #tab-consultas tbody');

    if (tbody) {
      tbody.innerHTML = '';
      if (completadas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#9ca3af;">No hay consultas previas registradas.</td></tr>`;
      } else {
        completadas.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${c.fecha}</td>
            <td>${c.medico_nombre} ${c.medico_apellido}</td>
            <td>${c.especialidad}</td>
            <td>${c.modalidad}</td>
            <td><span class="estado-badge estado-completada">Completada</span></td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  } catch (err) {
    console.error('Error cargando historial:', err);
  }
}

function configurarVistaPorRol(rol) {
  if (rol === 'paciente') {
    document.querySelectorAll('.btn-ver-det').forEach(btn => btn.style.display = 'none');
  }
}

function cambiarTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const tabEl = document.getElementById(`tab-${tab}`);
  if (tabEl) tabEl.classList.add('active');
}

function toggleVerPass() {
  const inp = document.getElementById('ver-pass');
  const ico = document.getElementById('ver-eye');
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    if (ico) ico.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    inp.type = 'password';
    if (ico) ico.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

function toggleNotif() { document.getElementById('notif-dropdown')?.classList.toggle('active'); }
function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
}

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

const verPass = document.getElementById('ver-pass');
if (verPass) verPass.addEventListener('keydown', function(e) { if (e.key === 'Enter') verificarAcceso(); });