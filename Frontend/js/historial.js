// =====================
// ROLES
// =====================
const rolesNombres = {
  'paciente': 'Paciente',
  'medico':   'Médico tratante',
  'admin':    'Administrador'
};

// =====================
// AL CARGAR LA PÁGINA
// =====================
document.addEventListener('DOMContentLoaded', () => {

  // Ocultar verificación y mostrar contenido directo
  document.getElementById('verificacion-overlay').style.display = 'none';
  document.getElementById('contenido-principal').style.display  = 'block';

  // Fecha y hora actual
  const ahora = new Date();
  const fechaFormato = ahora.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) + ' · ' + ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit'
  });

  // Verificar si hay sesión guardada
  const sesionStr = sessionStorage.getItem('usuario');
  let rol    = 'medico';
  let nombre = 'Jesús Ramírez';

  if (sesionStr) {
    const sesion = JSON.parse(sesionStr);
    rol    = sesion.rol    || 'medico';
    nombre = sesion.nombre || 'Jesús Ramírez';
  }

  // Actualizar info de acceso en pantalla
  const rolNombre = rolesNombres[rol] || 'Médico tratante';

  document.getElementById('acc-rol').textContent          = rolNombre;
  document.getElementById('acc-fecha').textContent        = fechaFormato;
  document.getElementById('profile-rol-text').textContent = rolNombre;
  document.getElementById('alerta-acceso-texto').textContent =
    `Acceso registrado como ${rolNombre} el ${fechaFormato}.`;

  // Configurar vista según rol
  configurarVistaPorRol(rol);
});

// =====================
// CONFIGURAR VISTA POR ROL
// =====================
function configurarVistaPorRol(rol) {
  if (rol === 'paciente') {
    document.querySelectorAll('.btn-ver-det').forEach(btn => {
      btn.style.display = 'none';
    });
  }
}

// =====================
// VERIFICAR ACCESO (pantalla de verificación — por si se usa más adelante)
// =====================
function verificarAcceso() {
  const rol  = document.getElementById('ver-rol').value;
  const pass = document.getElementById('ver-pass').value;
  const alerta   = document.getElementById('ver-alerta');
  const wrapPass = document.getElementById('ver-wrap-pass');

  alerta.style.display = 'none';
  wrapPass.classList.remove('error');

  const credenciales = {
    'paciente': '1234',
    'medico':   'medico123',
    'admin':    'admin123'
  };

  if (!rol) {
    alerta.className   = 'ver-alerta error';
    alerta.textContent = '⚠ Por favor selecciona tu rol de acceso.';
    alerta.style.display = 'block';
    return;
  }

  if (!pass) {
    alerta.className   = 'ver-alerta error';
    alerta.textContent = '⚠ Por favor ingresa tu contraseña.';
    alerta.style.display = 'block';
    wrapPass.classList.add('error');
    return;
  }

  if (credenciales[rol] !== pass) {
    alerta.className   = 'ver-alerta error';
    alerta.textContent = '⚠ Contraseña incorrecta. Acceso denegado.';
    alerta.style.display = 'block';
    wrapPass.classList.add('error');
    return;
  }

  const ahora = new Date();
  const fechaFormato = ahora.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) + ' · ' + ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit'
  });

  document.getElementById('verificacion-overlay').style.display = 'none';
  document.getElementById('contenido-principal').style.display  = 'block';

  const rolNombre = rolesNombres[rol];
  document.getElementById('acc-rol').textContent          = rolNombre;
  document.getElementById('acc-fecha').textContent        = fechaFormato;
  document.getElementById('profile-rol-text').textContent = rolNombre;
  document.getElementById('alerta-acceso-texto').textContent =
    `Acceso registrado como ${rolNombre} el ${fechaFormato}.`;

  configurarVistaPorRol(rol);
}

// =====================
// TOGGLE CONTRASEÑA VERIFICACIÓN
// =====================
function toggleVerPass() {
  const inp = document.getElementById('ver-pass');
  const ico = document.getElementById('ver-eye');

  if (inp.type === 'password') {
    inp.type = 'text';
    ico.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    inp.type = 'password';
    ico.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

// =====================
// TABS
// =====================
function cambiarTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  document.getElementById(`tab-${tab}`).classList.add('active');

  const tabs = ['resumen', 'antecedentes', 'alergias', 'medicacion', 'consultas', 'examenes'];
  const idx  = tabs.indexOf(tab);
  document.querySelectorAll('.tab')[idx]?.classList.add('active');
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
  if (notifWrap && !notifWrap.contains(e.target)) {
    notifDrop.classList.remove('active');
  }
});

// =====================
// ENTER EN VERIFICACIÓN
// =====================
document.getElementById('ver-pass').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') verificarAcceso();
});