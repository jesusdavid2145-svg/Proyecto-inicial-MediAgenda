/* =====================
   AJUSTES.JS - MediAgenda
===================== */

/* =====================
   ALERTA GLOBAL
===================== */
function mostrarAlerta(tipo, titulo, mensaje, duracion = 4000) {
  const alerta = document.getElementById('alerta-global');

  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
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

  clearTimeout(alerta._timeout);
  alerta._timeout = setTimeout(() => {
    alerta.style.display = 'none';
  }, duracion);
}


/* =====================
   NOTIFICACIONES HEADER
===================== */
function toggleNotif() {
  const dropdown = document.getElementById('notif-dropdown');
  dropdown.classList.toggle('active');

  if (dropdown.classList.contains('active')) {
    setTimeout(() => {
      document.addEventListener('click', cerrarNotifFuera, { once: true });
    }, 0);
  }
}

function cerrarNotifFuera(e) {
  const wrap = document.querySelector('.notif-wrap');
  if (!wrap.contains(e.target)) {
    document.getElementById('notif-dropdown').classList.remove('active');
  }
}

function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  const badge = document.getElementById('notif-badge');
  badge.style.display = 'none';

  const sidebarBadge = document.querySelector('.nav-item .badge');
  if (sidebarBadge) sidebarBadge.style.display = 'none';
}


/* =====================
   INFORMACIÓN PERSONAL
===================== */
function guardarPerfil() {
  const nombres    = document.getElementById('nombres').value.trim();
  const apellidos  = document.getElementById('apellidos').value.trim();
  const correo     = document.getElementById('correo').value.trim();
  const wrapCorreo = document.getElementById('wrap-correo');

  let valido = true;

  if (!nombres || !apellidos) {
    mostrarAlerta('error', 'Campos requeridos', 'Los campos Nombres y Apellidos son obligatorios.');
    valido = false;
  }

  if (!correo || !correo.includes('@')) {
    wrapCorreo.classList.add('error');
    mostrarAlerta('error', 'Correo inválido', 'Ingresa un correo electrónico válido.');
    valido = false;
  } else {
    wrapCorreo.classList.remove('error');
  }

  if (!valido) return;

  const nombreCompleto = `${nombres} ${apellidos}`;
  const iniciales = obtenerIniciales(nombreCompleto);

  document.querySelectorAll('.avatar-grande, .profile-avatar, .profile-avatar-lg, .aside-avatar').forEach(el => {
    el.textContent = iniciales;
  });

  document.querySelectorAll('.avatar-nombre').forEach(el => el.textContent = nombreCompleto);
  document.querySelectorAll('.profile-nombre, .aside-nombre').forEach(el => el.textContent = nombreCompleto);
  document.querySelectorAll('.aside-correo').forEach(el => el.textContent = correo);

  mostrarAlerta('success', '¡Cambios guardados!', 'Tu información personal fue actualizada correctamente.');
}

function obtenerIniciales(nombre) {
  return nombre.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}


/* =====================
   CONTRASEÑA
===================== */
function togglePass(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);

  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    input.type = 'password';
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

function evaluarFortaleza() {
  const pass  = document.getElementById('pass-nueva').value;
  const wrap  = document.getElementById('fortaleza-wrap');
  const label = document.getElementById('fortaleza-label');
  const barras = [
    document.getElementById('barra-1'),
    document.getElementById('barra-2'),
    document.getElementById('barra-3'),
    document.getElementById('barra-4'),
  ];

  if (!pass) {
    wrap.style.display = 'none';
    barras.forEach(b => b.style.background = '#e2e8f0');
    return;
  }

  wrap.style.display = 'flex';

  let puntos = 0;
  if (pass.length >= 8)           puntos++;
  if (/[A-Z]/.test(pass))         puntos++;
  if (/[0-9]/.test(pass))         puntos++;
  if (/[^A-Za-z0-9]/.test(pass))  puntos++;

  const niveles = [
    { color: '#ef4444', texto: 'Muy débil' },
    { color: '#fb923c', texto: 'Débil'     },
    { color: '#eab308', texto: 'Regular'   },
    { color: '#16a34a', texto: 'Fuerte'    },
  ];

  const nivel = niveles[puntos - 1] || niveles[0];

  barras.forEach((b, i) => {
    b.style.background = i < puntos ? nivel.color : '#e2e8f0';
  });

  label.textContent = nivel.texto;
  label.style.color = nivel.color;
}

function cambiarContrasena() {
  const actual    = document.getElementById('pass-actual').value;
  const nueva     = document.getElementById('pass-nueva').value;
  const confirmar = document.getElementById('pass-confirmar').value;
  const errorEl   = document.getElementById('error-pass');

  const wrapActual    = document.getElementById('wrap-pass-actual');
  const wrapNueva     = document.getElementById('wrap-pass-nueva');
  const wrapConfirmar = document.getElementById('wrap-pass-confirmar');

  [wrapActual, wrapNueva, wrapConfirmar].forEach(w => w.classList.remove('error'));
  errorEl.textContent = '';

  let valido = true;

  if (!actual) {
    wrapActual.classList.add('error');
    mostrarAlerta('error', 'Campo requerido', 'Ingresa tu contraseña actual.');
    valido = false;
  }

  if (!nueva || nueva.length < 8) {
    wrapNueva.classList.add('error');
    mostrarAlerta('error', 'Contraseña muy corta', 'La nueva contraseña debe tener al menos 8 caracteres.');
    valido = false;
  }

  if (nueva !== confirmar) {
    wrapConfirmar.classList.add('error');
    errorEl.textContent = 'Las contraseñas no coinciden.';
    mostrarAlerta('error', 'No coinciden', 'La nueva contraseña y la confirmación deben ser iguales.');
    valido = false;
  }

  if (!valido) return;

  document.getElementById('pass-actual').value    = '';
  document.getElementById('pass-nueva').value     = '';
  document.getElementById('pass-confirmar').value = '';
  document.getElementById('fortaleza-wrap').style.display = 'none';

  mostrarAlerta('success', '¡Contraseña actualizada!', 'Tu contraseña fue cambiada correctamente.');
}


/* =====================
   NOTIFICACIONES (TOGGLES)
===================== */
function guardarPreferencia(nombre, valor) {
  const etiquetas = {
    recordatorios:  'Recordatorios de citas',
    confirmaciones: 'Confirmaciones de cita',
    resultados:     'Resultados de laboratorio',
    sistema:        'Actualizaciones del sistema',
    email:          'Notificaciones por correo',
    sms:            'Notificaciones por SMS',
  };

  const estado = valor ? 'activada' : 'desactivada';
  mostrarAlerta('info', 'Preferencia actualizada', `${etiquetas[nombre] || nombre} ${estado}.`, 2500);
}


/* =====================
   SESIONES
===================== */
function cerrarSesionDispositivo(btn) {
  const item        = btn.closest('.sesion-item');
  const dispositivo = item.querySelector('.sesion-dispositivo').textContent;

  item.style.opacity    = '0';
  item.style.transition = 'opacity 0.3s';

  setTimeout(() => {
    item.remove();
    actualizarContadorSesiones();
    mostrarAlerta('success', 'Sesión cerrada', `Se cerró la sesión en "${dispositivo}".`);
  }, 300);
}

function cerrarTodasSesiones() {
  const items = document.querySelectorAll('.sesion-item:not(.activa)');

  if (items.length === 0) {
    mostrarAlerta('info', 'Sin sesiones', 'No hay otras sesiones activas para cerrar.');
    return;
  }

  items.forEach(item => {
    item.style.opacity    = '0';
    item.style.transition = 'opacity 0.3s';
  });

  setTimeout(() => {
    items.forEach(item => item.remove());
    actualizarContadorSesiones();
    mostrarAlerta('success', 'Sesiones cerradas', 'Se cerraron todas las demás sesiones activas.');
  }, 300);
}

function actualizarContadorSesiones() {
  const otras = document.querySelectorAll('.sesion-item:not(.activa)').length;

  const alertaSesiones = document.querySelector('.alerta-sesiones p');
  if (alertaSesiones) {
    if (otras <= 0) {
      document.querySelector('.alerta-sesiones').style.display = 'none';
    } else {
      alertaSesiones.innerHTML = `Tienes <strong>${otras} sesión${otras > 1 ? 'es activas' : ' activa'}</strong> en otros dispositivos. Revisa y ciérralas si no las reconoces.`;
    }
  }

  const allStats = document.querySelectorAll('.aside-stat strong');
  if (allStats[2]) allStats[2].textContent = otras;
}


/* =====================
   APARIENCIA Y REGIÓN
===================== */
function guardarApariencia() {
  const idioma      = document.getElementById('idioma');
  const zonaHoraria = document.getElementById('zona-horaria');

  const idiomaTexto = idioma.options[idioma.selectedIndex].text;
  const zonaTexto   = zonaHoraria.options[zonaHoraria.selectedIndex].text;

  mostrarAlerta('success', '¡Preferencias guardadas!', `Idioma: ${idiomaTexto} · Zona horaria: ${zonaTexto}`);
}


/* =====================
   ZONA DE PELIGRO
===================== */
function desactivarCuenta() {
  abrirModal('modal-desactivar');
}

function confirmarDesactivar() {
  cerrarModal('modal-desactivar');
  mostrarAlerta('warning', 'Cuenta desactivada', 'Tu cuenta ha sido desactivada temporalmente. Puedes reactivarla iniciando sesión.', 6000);
}

function abrirModalEliminar() {
  document.getElementById('confirmar-eliminar').value = '';
  document.getElementById('btn-confirmar-eliminar').disabled = true;
  abrirModal('modal-eliminar');
}

function validarEliminar() {
  const val = document.getElementById('confirmar-eliminar').value;
  document.getElementById('btn-confirmar-eliminar').disabled = val !== 'ELIMINAR';
}

function confirmarEliminar() {
  cerrarModal('modal-eliminar');
  mostrarAlerta('error', 'Cuenta eliminada', 'Tu cuenta y todos tus datos han sido eliminados permanentemente.', 8000);

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}


/* =====================
   MODALES
===================== */
function abrirModal(id) {
  document.getElementById(id).classList.add('active');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    document.getElementById('notif-dropdown').classList.remove('active');
  }
});


/* =====================
   NAVEGACIÓN ASIDE
===================== */
document.querySelectorAll('.aside-nav-item').forEach((item, index) => {
  item.addEventListener('click', function(e) {
    e.preventDefault();

    document.querySelectorAll('.aside-nav-item').forEach(i => i.classList.remove('active'));
    if (!this.classList.contains('rojo')) this.classList.add('active');

    const secciones = document.querySelectorAll('.seccion-card');
    if (secciones[index]) {
      secciones[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});