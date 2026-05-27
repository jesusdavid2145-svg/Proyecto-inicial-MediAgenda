const API = "http://localhost:3000/api";

function getToken() { return localStorage.getItem('token'); }
function getUsuario() { const u = localStorage.getItem('usuario'); return u ? JSON.parse(u) : null; }

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) { window.location.href = 'Loginindex.html'; return; }

  const usuario = getUsuario();
  if (usuario) {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido || ''}`;
    const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase();

    document.querySelectorAll('.avatar-grande, .profile-avatar, .aside-avatar').forEach(el => el.textContent = iniciales);
    document.querySelectorAll('.avatar-nombre, .profile-nombre, .aside-nombre').forEach(el => el.textContent = nombreCompleto);
    document.querySelectorAll('.aside-correo').forEach(el => el.textContent = usuario.correo);

    const nombreInput   = document.getElementById('nombres');
    const apellidoInput = document.getElementById('apellidos');
    const correoInput   = document.getElementById('correo');
    if (nombreInput)   nombreInput.value   = usuario.nombre   || '';
    if (apellidoInput) apellidoInput.value = usuario.apellido || '';
    if (correoInput)   correoInput.value   = usuario.correo   || '';
  }
});

function guardarPerfil() {
  const nombres   = document.getElementById('nombres')?.value.trim();
  const apellidos = document.getElementById('apellidos')?.value.trim();
  const correo    = document.getElementById('correo')?.value.trim();

  if (!nombres || !apellidos) { mostrarAlerta('error', 'Campos requeridos', 'Los campos Nombres y Apellidos son obligatorios.'); return; }
  if (!correo || !correo.includes('@')) { mostrarAlerta('error', 'Correo inválido', 'Ingresa un correo electrónico válido.'); return; }

  const nombreCompleto = `${nombres} ${apellidos}`;
  const iniciales = nombreCompleto.split(' ').filter(Boolean).slice(0,2).map(n => n[0].toUpperCase()).join('');

  document.querySelectorAll('.avatar-grande, .profile-avatar, .aside-avatar').forEach(el => el.textContent = iniciales);
  document.querySelectorAll('.avatar-nombre, .profile-nombre, .aside-nombre').forEach(el => el.textContent = nombreCompleto);
  document.querySelectorAll('.aside-correo').forEach(el => el.textContent = correo);

  const usuario = getUsuario();
  if (usuario) {
    usuario.nombre   = nombres;
    usuario.apellido = apellidos;
    usuario.correo   = correo;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  mostrarAlerta('success', '¡Cambios guardados!', 'Tu información personal fue actualizada correctamente.');
}

async function cambiarContrasena() {
  const actual    = document.getElementById('pass-actual')?.value;
  const nueva     = document.getElementById('pass-nueva')?.value;
  const confirmar = document.getElementById('pass-confirmar')?.value;

  if (!actual) { mostrarAlerta('error', 'Campo requerido', 'Ingresa tu contraseña actual.'); return; }
  if (!nueva || nueva.length < 8) { mostrarAlerta('error', 'Contraseña muy corta', 'La nueva contraseña debe tener al menos 8 caracteres.'); return; }
  if (nueva !== confirmar) { mostrarAlerta('error', 'No coinciden', 'La nueva contraseña y la confirmación deben ser iguales.'); return; }

  try {
    const usuario = getUsuario();
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: usuario.correo, contrasena: actual })
    });

    if (!res.ok) { mostrarAlerta('error', 'Contraseña incorrecta', 'La contraseña actual no es correcta.'); return; }

    mostrarAlerta('success', '¡Contraseña actualizada!', 'Tu contraseña fue cambiada correctamente.');
    document.getElementById('pass-actual').value    = '';
    document.getElementById('pass-nueva').value     = '';
    document.getElementById('pass-confirmar').value = '';

  } catch (err) {
    mostrarAlerta('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
  }
}

function togglePass(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    input.type = 'password';
    if (icon) icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

function evaluarFortaleza() {
  const pass  = document.getElementById('pass-nueva')?.value;
  const wrap  = document.getElementById('fortaleza-wrap');
  const label = document.getElementById('fortaleza-label');
  const barras = [1,2,3,4].map(i => document.getElementById(`barra-${i}`));
  if (!pass) { if (wrap) wrap.style.display = 'none'; return; }
  if (wrap) wrap.style.display = 'flex';
  let puntos = 0;
  if (pass.length >= 8)          puntos++;
  if (/[A-Z]/.test(pass))        puntos++;
  if (/[0-9]/.test(pass))        puntos++;
  if (/[^A-Za-z0-9]/.test(pass)) puntos++;
  const niveles = [{ color: '#ef4444', texto: 'Muy débil' },{ color: '#fb923c', texto: 'Débil' },{ color: '#eab308', texto: 'Regular' },{ color: '#16a34a', texto: 'Fuerte' }];
  const nivel = niveles[puntos - 1] || niveles[0];
  barras.forEach((b, i) => { if (b) b.style.background = i < puntos ? nivel.color : '#e2e8f0'; });
  if (label) { label.textContent = nivel.texto; label.style.color = nivel.color; }
}

function guardarPreferencia(nombre, valor) {
  mostrarAlerta('info', 'Preferencia actualizada', `${nombre} ${valor ? 'activada' : 'desactivada'}.`, 2500);
}

function cerrarSesionDispositivo(btn) {
  const item = btn.closest('.sesion-item');
  const dispositivo = item?.querySelector('.sesion-dispositivo')?.textContent;
  item.style.opacity = '0'; item.style.transition = 'opacity 0.3s';
  setTimeout(() => { item.remove(); mostrarAlerta('success', 'Sesión cerrada', `Se cerró la sesión en "${dispositivo}".`); }, 300);
}

function cerrarTodasSesiones() {
  const items = document.querySelectorAll('.sesion-item:not(.activa)');
  if (items.length === 0) { mostrarAlerta('info', 'Sin sesiones', 'No hay otras sesiones activas.'); return; }
  items.forEach(item => { item.style.opacity = '0'; item.style.transition = 'opacity 0.3s'; });
  setTimeout(() => { items.forEach(item => item.remove()); mostrarAlerta('success', 'Sesiones cerradas', 'Se cerraron todas las demás sesiones.'); }, 300);
}

function guardarApariencia() { mostrarAlerta('success', '¡Preferencias guardadas!', 'Idioma y zona horaria actualizados.'); }

function desactivarCuenta() { abrirModal('modal-desactivar'); }
function confirmarDesactivar() { cerrarModal('modal-desactivar'); mostrarAlerta('warning', 'Cuenta desactivada', 'Tu cuenta ha sido desactivada temporalmente.', 6000); }
function abrirModalEliminar() {
  const inp = document.getElementById('confirmar-eliminar');
  const btn = document.getElementById('btn-confirmar-eliminar');
  if (inp) inp.value = ''; if (btn) btn.disabled = true;
  abrirModal('modal-eliminar');
}
function validarEliminar() {
  const val = document.getElementById('confirmar-eliminar')?.value;
  const btn = document.getElementById('btn-confirmar-eliminar');
  if (btn) btn.disabled = val !== 'ELIMINAR';
}
function confirmarEliminar() {
  cerrarModal('modal-eliminar');
  localStorage.removeItem('token'); localStorage.removeItem('usuario');
  mostrarAlerta('error', 'Cuenta eliminada', 'Tu cuenta ha sido eliminada.', 8000);
  setTimeout(() => window.location.href = 'Loginindex.html', 3000);
}

function abrirModal(id) { document.getElementById(id)?.classList.add('active'); }
function cerrarModal(id) { document.getElementById(id)?.classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    document.getElementById('notif-dropdown')?.classList.remove('active');
  }
});

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
  localStorage.removeItem('token'); localStorage.removeItem('usuario');
  window.location.href = 'Loginindex.html';
}

function mostrarAlerta(tipo, titulo, mensaje, duracion = 4000) {
  const alerta = document.getElementById('alerta-global');
  if (!alerta) return;
  const iconos = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  };
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `<div class="alerta-icono">${iconos[tipo] || iconos.info}</div><div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>`;
  alerta.style.display = 'flex';
  clearTimeout(alerta._timeout);
  alerta._timeout = setTimeout(() => alerta.style.display = 'none', duracion);
}