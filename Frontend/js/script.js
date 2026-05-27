const API = "http://localhost:3000/api";

// =====================
// TIPO DE ACCESO
// =====================
function setType(type, btn) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const input = document.getElementById('main-input');
  const hint  = document.getElementById('input-hint');

  if (type === 'email') {
    input.type        = 'text';
    input.placeholder = 'ejemplo@correo.com';
    hint.textContent  = 'Ingresa tu correo electrónico registrado';
  } else if (type === 'doc') {
    input.type        = 'text';
    input.placeholder = 'Número de documento';
    hint.textContent  = 'Ingresa tu número de documento de identidad';
  } else if (type === 'phone') {
    input.type        = 'tel';
    input.placeholder = '300 000 0000';
    hint.textContent  = 'Ingresa tu número de teléfono registrado';
  }
}

// =====================
// MOSTRAR / OCULTAR CONTRASEÑA
// =====================
function togglePass() {
  const input = document.getElementById('pass-input');
  input.type  = input.type === 'password' ? 'text' : 'password';
}

// =====================
// ALERTA
// =====================
function mostrarAlerta(tipo, titulo, mensaje) {
  const alerta = document.getElementById('alerta');
  const iconos = {
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`
  };
  alerta.className = `alerta alerta-${tipo}`;
  alerta.innerHTML = `<div class="alerta-icono">${iconos[tipo]}</div><div class="alerta-texto"><strong>${titulo}</strong><span>${mensaje}</span></div>`;
  alerta.style.display = 'flex';
}

function limpiarAlerta() {
  document.getElementById('alerta').style.display = 'none';
  document.getElementById('wrap-usuario')?.classList.remove('error');
  document.getElementById('wrap-pass')?.classList.remove('error');
}

// =====================
// LOGIN — CONECTADO AL BACKEND
// =====================
async function validarLogin() {
  limpiarAlerta();

  const correo    = document.getElementById('main-input').value.trim();
  const contrasena = document.getElementById('pass-input').value;

  if (!correo || !contrasena) {
    if (!correo)    document.getElementById('wrap-usuario')?.classList.add('error');
    if (!contrasena) document.getElementById('wrap-pass')?.classList.add('error');
    mostrarAlerta('error', 'Campos vacíos', 'Todos los campos son obligatorios.');
    return;
  }

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('wrap-usuario')?.classList.add('error');
      document.getElementById('wrap-pass')?.classList.add('error');
      mostrarAlerta('error', 'Credenciales incorrectas', data.error || 'Correo o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('token',   data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    mostrarAlerta('success', '¡Bienvenido!', `Hola ${data.usuario.nombre}, redirigiendo...`);
    setTimeout(() => window.location.href = 'Dashboard.html', 1000);

  } catch (err) {
    mostrarAlerta('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
  }
}

// =====================
// MODAL TÉRMINOS
// =====================
function abrirModal(e) {
  e.preventDefault();
  document.getElementById('modal-terminos').classList.add('active');
}

function cerrarModal(e) {
  e.preventDefault();
  document.getElementById('modal-terminos').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-terminos');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('active');
    });
  }
});